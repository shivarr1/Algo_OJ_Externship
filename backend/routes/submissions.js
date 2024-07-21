const express = require('express');
const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const { performance } = require('perf_hooks');
const router = express.Router();
const Submission = require('../models/Submission');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/run', authenticateToken, async (req, res) => {
    const { problem_id, language, code } = req.body;

    try {
        // Generate a temporary filename based on the current timestamp and language
        const tempFileName = `solution-${Date.now()}.${language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : 'js'}`;
        const tempFilePath = path.join(__dirname, '..', 'temp', tempFileName);

        // Ensure the temp directory exists
        await fs.ensureDir(path.join(__dirname, '..', 'temp'));

        // Write the submitted code to the temporary file
        await fs.writeFile(tempFilePath, code);

        // Determine the command to execute based on the language
        let command;
        if (language === 'python') {
            command = `python3 ${tempFilePath}`;
        } else if (language === 'cpp') {
            const compiledFile = tempFilePath.replace('.cpp', '');
            command = `g++ ${tempFilePath} -o ${compiledFile} && ${compiledFile}`;
        } else {
            command = `node ${tempFilePath}`;
        }

        // Measure the start time
        const startTime = performance.now();

        exec(command, async (error, stdout, stderr) => {
            // Measure the end time and calculate execution time
            const endTime = performance.now();
            const executionTime = endTime - startTime;

            // Remove the temporary file after execution
            await fs.remove(tempFilePath);

            // Determine the verdict based on the execution result
            let verdict = 'Accepted';
            let output = stdout;
            if (error) {
                verdict = 'Runtime Error';
                output = stderr;
            }

            // Measure memory usage (This is for the current process, not the executed code specifically)
            const memoryUsage = process.memoryUsage();
            const memoryUsed = Math.round(memoryUsage.heapUsed / 1024); // Convert bytes to KB

            // Save the submission details in the database
            const submission = new Submission({
                user_id: req.user.id,
                problem_id,
                language,
                code,
                verdict,
                execution_time: executionTime,
                memory_used: memoryUsed,
            });

            await submission.save();

            // Respond with the result
            res.json({ verdict, output, executionTime, memoryUsed });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

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
