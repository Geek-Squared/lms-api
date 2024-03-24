const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubmissionSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignment: {
    type: Schema.Types.ObjectId,
    ref: 'CourseMaterial',
    required: true
  },
  grade: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: String,
  fileUrl: {
    type: String,
    required: true
  }
});

const Submission = mongoose.model('Submission', SubmissionSchema);

module.exports = Submission;