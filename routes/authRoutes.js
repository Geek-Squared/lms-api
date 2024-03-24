const express = require('express');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  user.comparePassword(req.body.password, (err, isMatch) => {
    if (err) return res.status(500).json({ message: 'Error occurred' });
    if (!isMatch) return res.status(401).json({ message: 'Invalid username or password' });

    const userObject = user.toObject();
    const token = jwt.sign({ id: userObject._id, username: userObject.username, role: userObject.role }, "XNUE7G3JHJQJK", {expiresIn: '10h'});
    res.json({
      message: 'Login successful!',
      user: userObject, // Send the user object
      token: token, // Send the token separately
    });
  });
});

router.post('/signup', async (req, res) => {
  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser) {
    return res.status(409).send('Username already exists');
  }

  const user = new User({
    fullName: req.body.fullName,
    username: req.body.username,
    password: req.body.password,
    role: req.body.role
  });

  await user.save();
  res.status(201).send('User created successfully');
});

router.get('/user', async (req, res) => {
  const authHeader = req.headers.authorization;
  const secret = 'XNUE7G3JHJQJK'
  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization header' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }


  try {
    if (!secret) {
      return res.status(500).json({ message: 'JWT_SECRET is not set' });
    }

    const decoded = jwt.verify(token, secret);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: 'Invalid token' });
    }


    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;