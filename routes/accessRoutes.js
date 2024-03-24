const ac = require('../middleware/checkAccess');

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

router.post('/create-course', checkAccess('createOwn', 'course'), function(req, res) {
  // code to create a course
});

router.put('/modify-course/:id', checkAccess('updateAny', 'course'), function(req, res) {
  // code to modify a course
});

router.get('/view-course/:id', checkAccess('readOwn', 'course'), function(req, res) {
  // code to view a course
});