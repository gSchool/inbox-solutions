module.exports = function(io){
  var express = require('express');
  var router = express.Router();

  var mongoose = require('mongoose');
  var Message = mongoose.model('Message');

  // io.on('connection', function (socket) {
  //   socket.emit('news', { hello: 'world' });
  //   socket.on('my other event', function (data) {
  //     console.log(data);
  //   });
  // });

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
      io.emit('message:updated', {id: req.params.id, attrs: newAttributes});
    });
  });

  router.delete('/api/messages', function(req, res, next) {
    Message.remove({_id: { $in: [].concat(req.body['ids[]']) }}, function (err, response) {
      if (err) throw err;
      res.json(response);
    });
  });

  router.post('/api/messages', function(req, res, next) {
    var newAttributes = {};
    if (req.body.read) newAttributes.read = req.body.read;
    Message.update({_id: { $in: [].concat(req.body['ids[]']) }}, newAttributes, { multi: true }, function (err, response) {
      if (err) throw err;
      res.json(response);
    });
  });

  router.post('/api/messages/labels/add', function(req, res, next) {
    var query = {_id: { $in: [].concat(req.body['ids[]']) }},
        updates = { $addToSet: {labels: req.body.label} },
        options = { multi: true };

    Message.update(query, updates, options, function (err, response) {
      if (err) throw err;
      res.json(response);
    });
  });

  router.post('/api/messages/labels/remove', function(req, res, next) {
    var query = {_id: { $in: [].concat(req.body['ids[]']) }},
        updates = { $pull: {labels: req.body.label} },
        options = { multi: true };

    Message.update(query, updates, options, function (err, response) {
      if (err) throw err;
      res.json(response);
    });
  });

  router.get('/favicon.ico', function(req, res, next) {
    res.end();
  });

  return router;
};
