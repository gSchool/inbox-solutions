var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dotenv = require('dotenv').load();
var fs = require('fs');
var io = require('socket.io')();

var connect = function () {
  mongoose.connect(process.env.MONGO_URL, {
    server: {
      socketOptions: {
        keepAlive: 1 }
      }
    }
  );
};
connect();
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

fs.readdirSync(__dirname + '/app/models').forEach(function (model) {
  require(__dirname + '/app/models/' + model);
});

var routes = require('./app/routes/all')(io);

var app = express();
app.io = io;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("view options", {layout: false});
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
