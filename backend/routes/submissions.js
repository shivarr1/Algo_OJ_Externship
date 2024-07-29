const express = require('express');
const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const { performance } = require('perf_hooks');
const router = express.Router();
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const authenticateToken = require('../middleware/authenticateToken');

// Route to run code with user input
router.post('/run', authenticateToken, async (req, res) => {
  const { problem_id, language, code, input } = req.body;

  try {
    const result = await runCode(problem_id, language, code, input);
    res.json(result);
  } catch (error) {
    console.error('Error running code:', error);
    res.status(500).send('Server error');
  }
});

// Route to submit code and run against all test cases
router.post('/submit', authenticateToken, async (req, res) => {
  const { problem_id, language, code } = req.body;

  try {
    const problem = await Problem.findById(problem_id);

    const testResults = await Promise.all(
      problem.test_inputs.map(async (input, index) => {
        const result = await runCode(problem_id, language, code, input);
        return {
          input,
          expectedOutput: problem.test_outputs[index],
          actualOutput: result.output,
          verdict: result.verdict,
          executionTime: result.executionTime,
          memoryUsed: result.memoryUsed,
        };
      })
    );

    const allPassed = testResults.every(result => result.verdict === 'Accepted');
    res.json({ allPassed, results: testResults });
  } catch (error) {
    console.error('Error submitting code:', error);
    res.status(500).send('Server error');
  }
});

// Function to run code
const runCode = async (problem_id, language, code, input) => {
  const timestamp = Date.now();
  const tempFileName = `solution-${timestamp}.${language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : 'js'}`;
  const tempFilePath = path.join(__dirname, '..', 'temp', tempFileName);
  const inputFileName = `input-${timestamp}.txt`;
  const inputFilePath = path.join(__dirname, '..', 'temp', inputFileName);

  await fs.ensureDir(path.join(__dirname, '..', 'temp'));
  await fs.writeFile(tempFilePath, code);
  await fs.writeFile(inputFilePath, input);

  let command;
  if (language === 'python') {
    command = `python3 ${tempFilePath} < ${inputFilePath}`;
  } else if (language === 'cpp') {
    const compiledFile = tempFilePath.replace('.cpp', '');
    command = `g++ ${tempFilePath} -o ${compiledFile} && ${compiledFile} < ${inputFilePath}`;
  } else {
    command = `node ${tempFilePath} < ${inputFilePath}`;
  }

  const startTime = performance.now();

  return new Promise((resolve) => {
    const handleExecutionResult = async (error, stdout, stderr) => {
      const endTime = performance.now();
      const executionTime = endTime - startTime;

      let verdict = 'Accepted';
      let output = stdout;
      if (error) {
        verdict = 'Runtime Error';
        output = stderr;
      }

      const memoryUsage = process.memoryUsage();
      const memoryUsed = Math.round(memoryUsage.heapUsed / 1024);

      await fs.emptyDir(path.join(__dirname, '..', 'temp'));

      resolve({ verdict, output, executionTime, memoryUsed });
    };

    if (language === 'cpp') {
      const compiledFile = tempFilePath.replace('.cpp', '');
      exec(`g++ ${tempFilePath} -o ${compiledFile}`, (compileError) => {
        if (compileError) {
          handleExecutionResult(compileError, '', compileError.message);
        } else {
          exec(`${compiledFile} < ${inputFilePath}`, handleExecutionResult);
        }
      });
    } else {
      exec(command, handleExecutionResult);
    }
  });
};

router.get('/', authenticateToken, async (req, res) => {
  try {
    const submissions = await Submission.find().populate('user_id', 'username').populate('problem_id', 'title');
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
