// routes/submissions.js
const express = require('express');
const Submission = require('../models/Submission');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Create a new submission
router.post('/', authenticateToken, async (req, res) => {
  const { problem_id, language, code } = req.body;
  const user_id = req.user.id;

  try {
    const newSubmission = new Submission({ user_id, problem_id, language, code });
    await newSubmission.save();
    res.status(201).json(newSubmission);
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all submissions for a user
router.get('/', authenticateToken, async (req, res) => {
  const user_id = req.user.id;

  try {
    const submissions = await Submission.find({ user_id }).populate('problem_id');
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
