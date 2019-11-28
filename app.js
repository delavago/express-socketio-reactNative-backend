var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const http = require('http').Server(app)//don't really know what this is doing
const io = require('socket.io')(http);
http.listen(3001)//since app is alreadu using port 3000 set sockets to another port

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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

let messages = [];

io.on('connection',socket => {
  console.log('socket connected');
  // io.emit('welcome', {
  //   sender: 'Server',
  //   groupNumber: 0,
  //   message: 'Welcome to our messaging server'
  // })

  socket.on('message',data => {
    messages.push(data);
    socket.broadcast.emit('message',data)
  })

})

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