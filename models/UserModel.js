const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default:'student'
  }
});

UserSchema.pre('save', function(next) {
    const user = this;
  
    if (!user.isModified('password')) return next();
  
    if (user.password === undefined) {
      return next(new Error('Password is undefined'));
    }
  
    bcrypt.hash(user.password, 10, function(err, hashedPassword) {
      if (err) return next(err);
  
      user.password = hashedPassword;
      next();
    });
  });

UserSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);