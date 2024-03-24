const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

async function authenticate(req, res, next) {
  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the token
    const decoded = jwt.verify(token, 'XNUE7G3JHJQJK');

    // Find the user associated with the token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).send('Unauthorized');
    }

    // Attach the user to the request object
    req.user = user;

    // Call next to move to the next middleware
    next();
  } catch (err) {
    res.status(401).send('Unauthorized');
  }
}

module.exports = authenticate;