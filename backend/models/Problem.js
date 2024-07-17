const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, required: true, enum: ['Easy', 'Medium', 'Hard'] },
  tags: { type: [String], required: true },
  sample_input: { type: String, required: true },
  sample_output: { type: String, required: true },
  constraints: { type: String, required: true }
});

module.exports = mongoose.model('Problem', problemSchema);
