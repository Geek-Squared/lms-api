const AccessControl = require('accesscontrol');
const ac = new AccessControl();

ac.grant('student')
  .readOwn('course')
  .updateOwn('profile')
  .deleteOwn('profile')
.grant('instructor')
  .extend('student')
  .createOwn('course')
  .deleteOwn('course')
  .readAny('profile')
.grant('admin')
  .extend('student')
  .extend('instructor')
  .updateAny('course')
  .deleteAny('course');

module.exports = ac;