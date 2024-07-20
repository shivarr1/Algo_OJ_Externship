// models/Submission.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problem_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  language: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  verdict: {
    type: String,
    enum: ['Pending', 'Running', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Memory Limit Exceeded', 'Runtime Error'],
    default: 'Pending'
  },
  execution_time: {
    type: Number,
    default: 0
  },
  memory_used: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
