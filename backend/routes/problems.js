const express = require('express');
const Problem = require('../models/Problem');

const router = express.Router();

// Get all problems
router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single problem by ID
router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json(problem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new problem (create)
router.post('/', async (req, res) => {
  try {
    const { id, title, description, difficulty, tags, sample_input, sample_output, constraints, test_inputs, test_outputs } = req.body;

    const newProblem = new Problem({
      id,
      title,
      description,
      difficulty,
      tags,
      sample_input,
      sample_output,
      constraints,
      test_inputs,
      test_outputs
    });

    await newProblem.save();

    res.status(201).json({ message: 'Problem added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a problem by ID
router.put('/:id', async (req, res) => {
  try {
    const { title, description, difficulty, tags, sample_input, sample_output, constraints, test_inputs, test_outputs } = req.body;

    const updatedProblem = await Problem.findByIdAndUpdate(
      req.params.id,
      { title, description, difficulty, tags, sample_input, sample_output, constraints, test_inputs, test_outputs },
      { new: true }
    );

    if (!updatedProblem) return res.status(404).json({ message: 'Problem not found' });

    res.json({ message: 'Problem updated successfully', problem: updatedProblem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a problem by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedProblem = await Problem.findByIdAndDelete(req.params.id);

    if (!deletedProblem) return res.status(404).json({ message: 'Problem not found' });

    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
