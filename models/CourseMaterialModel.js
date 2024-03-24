const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseMaterialSchema = new Schema({
  type: {
    type: String,
    enum: ['video', 'slide', 'quiz', 'assignment'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  content: {
    type: String,
    required: true
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  }
});

const CourseMaterial = mongoose.model('CourseMaterial', CourseMaterialSchema);

module.exports = CourseMaterial;