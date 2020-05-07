const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const csrf = require('csurf')
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const compression = require('compression');
const helmet = require('helmet')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const addRouter = require("./routes/add");
const cardRouter = require("./routes/card");
const coursesCourses = require("./routes/courses");
const orderRouter = require("./routes/order");
const singleRouter = require("./routes/single");
const variable = require("./var/index");
const middle = require("./middleware/index");
const upload = require("./middleware/upload");

const app = express();

mongoose.connect(variable.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).catch(error => handleError(error));

// view engine setup
app.set('views', path.join(__dirname, 'views/page'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/my-uploads',express.static(path.join(__dirname, 'my-uploads')));
app.use(csrf({ cookie: true }))
app.use(helmet())
app.use(session({
  secret: variable.SECRET_WORD,
  resave: false,
  saveUninitialized: false,
	store: new MongoStore({
		url: variable.MONGODB_URI,
	})
}))
app.use(middle);
app.use(upload.single('avatar'))
app.use(compression())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/add', addRouter);
app.use('/card', cardRouter);
app.use('/courses', coursesCourses);
app.use('/order', orderRouter);
app.use('/single', singleRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
