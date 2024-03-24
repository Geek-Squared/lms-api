const ac = require('../utils/access');
const router = require('express').Router();

function checkAccess(action, resource) {
  return function(req, res, next) {
    const permission = ac.can(req.user.role)[action](resource);
    if (permission.granted) {
      next();
    } else {
      res.status(403).send('Forbidden');
    }
  };
}

module.exports = checkAccess;