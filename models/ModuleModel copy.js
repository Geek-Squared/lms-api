const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  type: String,
  file: String,
});

const QuizSchema = new mongoose.Schema({
  question: String,
  answers: [String],
  correctAnswer: String,
});

const ModuleSchema = new mongoose.Schema({
  title: String,
  resources: [ResourceSchema],
  quizzes: [QuizSchema],
  prerequisites: [String],
  releaseDate: Date,
});

const Module = mongoose.model('Module', ModuleSchema);

module.exports = Module;