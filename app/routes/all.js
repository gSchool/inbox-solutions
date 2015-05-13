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
  if (req.body.starred) newAttributes.starred = req.body.starred;
  Message.update({_id: req.params.id}, newAttributes, function (err, message) {
    if (err) throw err;
    res.json(message);
  });
});

router.delete('/api/messages', function(req, res, next) {
  Message.remove({_id: { $in: [].concat(req.body['ids[]']) }}, function (err, response) {
    if (err) throw err;
    res.json(response);
  });
});

router.get('/favicon.ico', function(req, res, next) {
  res.end();
});

module.exports = router;
