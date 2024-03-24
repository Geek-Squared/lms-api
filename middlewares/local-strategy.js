const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const User = require('./models/UserModel');

passport.use(
    new Strategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
            if (err) return done(err);
            if (!user) return done(null, false);
            if (!user.comparePassword(password)) return done(null, false);
            return done(null, user);
        });
    })
)

// export
module.exports = passport;