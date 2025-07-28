var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('./config/database');
const payloadChecker = require('payload-validator');
var cors = require('cors');
var usersRouter = require('./routes/users');
const authMiddleware = require('./middlewares/auth'); // Import auth middleware
var app = express();
var sitesRouter = require('./routes/sites');


// view engine setup (optional, can remove if not using Pug for signup)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ credentials: true, origin: true })); // Enable credentials for CORS (cookies)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, New-Access-Token");
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true"); // Allow credentials (cookies)

  next();
});

app.use('/api/users', usersRouter);
app.use('/api/sites', sitesRouter);
// Example protected route (add your actual protected routes here)
app.use('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Protected content', user: req.user });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page (updated to JSON for API consistency)
  res.status(err.status || 500).json({
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

// Start the server on specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;