const express = require('express');
const router = express.Router();
const Forum = require('../models/ForumModel');
const Post = require('../models/PostModel');

// Create a new forum
router.post('/', async (req, res) => {
  const forum = new Forum({
    course: req.body.courseId
  });

  await forum.save();
  res.status(201).send(forum);
});

// Create a new post in a forum
router.post('/forum/:forumId/posts', async (req, res) => {
  const post = new Post({
    user: req.user._id,
    forum: req.params.forumId,
    content: req.body.content
  });

  await post.save();
  res.status(201).send(post);
});

// Get all posts in a forum
router.get('/forums/:forumId/posts', async (req, res) => {
  const posts = await Post.find({ forum: req.params.forumId }).populate('user');
  res.send(posts);
});

module.exports = router;