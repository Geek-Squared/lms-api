// dependencies
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');

// models
const User = require('./models/UserModel');

//routes
const authRoutes = require('./routes/authRoutes');
const coursesRoutes = require('./routes/coursesRoutes');
const courseMaterialRoutes = require('./routes/courseMaterialRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const forumRoutes = require('./routes/forumRoutes');
const indexRouter = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 32450;

// db connection
mongoose.connect('mongodb+srv://msngwelz:PgLwIc48L14gTMt2@cluster0.ohzwba6.mongodb.net/', { useNewUrlParser: true })
  .then(() => console.log('Connected to the database'))
  .catch((error) => console.error('Error connecting to the database', error));

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function () {
  console.log('Connected to the database');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS
app.use(cors());

app.use(session({
  secret: 'lms-key',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 60000 * 60,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  },
}));

// Authentication middleware
app.use(async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return next();
  }

  try {
    const user = await User.findOne({ token });
    if (user) {
      req.user = user;
    }
  } catch (err) {
    console.error(err);
  }

  next();
});

app.use(function (req, res, next) {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use('/', indexRouter);
app.use('/auth', authRoutes);
app.use('/course', coursesRoutes);
app.use('/course-material', courseMaterialRoutes);
app.use('/submission', submissionRoutes);
app.use('/forum', forumRoutes);

// run server
app.listen(PORT, function () {
  console.log('Server listening on port ' + PORT);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;