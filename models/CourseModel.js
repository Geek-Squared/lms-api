const mongoose = require('mongoose');
const Module = require('./ModuleModel');

const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  duration: String,
  language: String,
  level: String,
  prerequisites: String,
  image: String,
  instructor: String,
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  materials: [String],
  modules: [Module.schema],
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;