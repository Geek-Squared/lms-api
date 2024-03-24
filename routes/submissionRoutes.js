const express = require('express');
const router = express.Router();
const Submission = require('../models/SubmissionModel');
const upload = require('../middlewares/upload');

router.post('/', upload.single('file'), async (req, res) => {
  const submission = new Submission({
    student: req.user._id,
    assignment: req.body.assignmentId,
    fileUrl: req.file.location
  });

  await submission.save();
  res.status(201).send(submission);
});

router.put('/:id', async (req, res) => {
  const updates = {
    grade: req.body.grade,
    feedback: req.body.feedback
  };

  const submission = await Submission.findByIdAndUpdate(req.params.id, updates, { new: true });
  res.send(submission);
});

module.exports = router;