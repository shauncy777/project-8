var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sequelize = require('./models/index').sequelize;


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { nextTick } = require('process');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  try {
    await sequelize.sync();
    console.log('database synced');
  } catch (error) {
    console.log('Unable to sync the database', error);
  }
})();


// custom 404 error handler
app.use((req, res) => {
  const error = new Error("The page you're looking for doesn't exist!");
  error.status = 404;
  res.status(404).render("page-not-found", { error })
  
});




// global error handler
app.use((err,req, res, next) => {
  if (err.status === 404) {
    res.render("page-not-found", { error });
  } else {
    console.log('500 global error handler called');
    err.message = err.message || 'Something went wrong with the server';
    res.locals.error = err;
    res.status(err.status || 500).render('error', { err });
  }
  
});









module.exports = app;
