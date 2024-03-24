const express = require('express');
const router = express.Router();
const Course = require('../models/CourseModel');
const Module = require('../models/ModuleModel');
const checkAccess = require('../middlewares/checkAccess');
const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/upload');

// Create a course
router.post('/', authenticate, checkAccess('createOwn', 'course'), upload.single('image'), async (req, res) => {

  if (!req.file) {
    return res.status(400).send('No file was uploaded.');
  }

  const course = new Course({
    ...req.body,
    image: req.file.location,
  });

  await course.save();
  res.status(201).send(course);
});

// Get all courses
router.get('/', async (req, res) => {
  const courses = await Course.find();
  res.send(courses);
});

// Get a specific course
router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).send('Course not found');
  res.send(course);
});

// Update a course
router.put('/:id', async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!course) return res.status(404).send('Course not found');
  res.send(course);
});

// Add a module to a course
router.put('/:id/modules', upload.array('videoUrl'), async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).send('Course not found');

  const module = new Module(req.body);

  // Add the uploaded video to the module
  if (req.files && req.files.length > 0) {
    // Use the location of the first file as the videoUrl
    module.videoUrl = req.files[0].location;
  } else {
    console.log('No files were uploaded.');
  }

  await module.save();

  course.modules.push(module);
  await course.save();

  res.send(course);
});

// Delete a course
router.delete('/:id', authenticate, checkAccess('deleteAny', 'course'), async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) return res.status(404).send('Course not found');
  res.send(course);
});

module.exports = router;