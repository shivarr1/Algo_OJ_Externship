const express = require('express');
const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const { performance } = require('perf_hooks');
const router = express.Router();
const Submission = require('../models/Submission');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/run', authenticateToken, async (req, res) => {
    const { problem_id, language, code, input } = req.body;

    try {
        // Generate temporary filenames based on the current timestamp and language
        const timestamp = Date.now();
        const tempFileName = `solution-${timestamp}.${language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : 'js'}`;
        const tempFilePath = path.join(__dirname, '..', 'temp', tempFileName);
        const inputFileName = `input-${timestamp}.txt`;
        const inputFilePath = path.join(__dirname, '..', 'temp', inputFileName);

        // Ensure the temp directory exists
        await fs.ensureDir(path.join(__dirname, '..', 'temp'));

        // Write the submitted code and input to temporary files
        await fs.writeFile(tempFilePath, code);
        await fs.writeFile(inputFilePath, input);

        // Determine the command to execute based on the language
        let command;
        if (language === 'python') {
            command = `python3 ${tempFilePath} < ${inputFilePath}`;
        } else if (language === 'cpp') {
            const compiledFile = tempFilePath.replace('.cpp', '');
            command = `g++ ${tempFilePath} -o ${compiledFile} && ${compiledFile} < ${inputFilePath}`;
        } else {
            command = `node ${tempFilePath} < ${inputFilePath}`;
        }

        // Measure the start time
        const startTime = performance.now();

        // Handle the execution and result processing
        const handleExecutionResult = async (error, stdout, stderr) => {
            // Measure the end time and calculate execution time
            const endTime = performance.now();
            const executionTime = endTime - startTime;

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

            // Clean up the temp directory after execution
            await fs.emptyDir(path.join(__dirname, '..', 'temp'));

            // Respond with the result
            res.json({ verdict, output, executionTime, memoryUsed });
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
