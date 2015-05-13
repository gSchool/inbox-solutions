var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Message = mongoose.model('Message');

router.get('/', function(req, res, next) {
  res.render('index.html');
});

router.get('/api/messages', function(req, res, next) {
  // res.json({foo: 'bar'});
  Message.find({}, function (err, messages) {
    if (err) throw err;
    res.json(messages);
  });
});

router.get('/favicon.ico', function(req, res, next) {
  res.end();
});

module.exports = router;
