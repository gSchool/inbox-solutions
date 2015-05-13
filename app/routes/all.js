var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Message = mongoose.model('Message');

router.get('/', function(req, res, next) {
  res.render('index.html');
});

router.get('/api/messages', function(req, res, next) {
  Message.find({}, function (err, messages) {
    if (err) throw err;
    res.json(messages);
  });
});

router.post('/api/messages/:id', function(req, res, next) {
  var newAttributes = {};
  console.log(req.body);
  if (req.body.starred) newAttributes.starred = req.body.starred;
  Message.update({_id: req.params.id}, newAttributes, function (err, message) {
    if (err) throw err;
    res.json(message);
  });
});

router.get('/favicon.ico', function(req, res, next) {
  res.end();
});

module.exports = router;
