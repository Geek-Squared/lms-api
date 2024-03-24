const express = require('express');
const router = express.Router();
const CourseMaterial = require('../models/CourseMaterialModel');
const upload = require('../middlewares/upload');

// Create a course material
router.post('/', upload.single('file'), async (req, res) => {
  const courseMaterial = new CourseMaterial({
    type: req.body.type,
    title: req.body.title,
    description: req.body.description,
    content: req.file.location,
    courseId: req.body.courseId
  });
  await courseMaterial.save();
  res.status(201).send(courseMaterial);
});

// Get all course materials
router.get('/course/:courseId', async (req, res) => {
    const courseMaterials = await CourseMaterial.find({ courseId: req.params.courseId });
    res.send(courseMaterials);
  });

// Get a specific course material
router.get('/:id', async (req, res) => {
  const courseMaterial = await CourseMaterial.findById(req.params.id);
  if (!courseMaterial) return res.status(404).send('Course material not found');
  res.send(courseMaterial);
});

// Update a course material
router.put('/:id', async (req, res) => {
  const courseMaterial = await CourseMaterial.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!courseMaterial) return res.status(404).send('Course material not found');
  res.send(courseMaterial);
});

// Delete a course material
router.delete('/:id', async (req, res) => {
  const courseMaterial = await CourseMaterial.findByIdAndDelete(req.params.id);
  if (!courseMaterial) return res.status(404).send('Course material not found');
  res.send(courseMaterial);
});

module.exports = router;