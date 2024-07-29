const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, required: true, enum: ['Easy', 'Medium', 'Hard'] },
  tags: { type: [String], required: true },
  sample_input: { type: String, required: true },
  sample_output: { type: String, required: true },
  constraints: { type: String, required: true },
  test_inputs: { type: [String], required: true },  // Array of inputs for test cases
  test_outputs: { type: [String], required: true }  // Array of expected outputs for test cases
});

module.exports = mongoose.model('Problem', problemSchema);
