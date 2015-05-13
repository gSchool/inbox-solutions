var mongoose = require('mongoose');
var dotenv = require('dotenv').load();
var Q = require('q');

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

require('./app/models/message');
var Message = mongoose.model('Message');

var messages = [
  {
    "id": 1,
    "subject": "You can't input the protocol without calculating the mobile RSS protocol!",
    "read": false,
    "starred": true,
    "labels": ["dev", "personal"]
  },
  {
    "id": 2,
    "subject": "connecting the system won't do anything, we need to input the mobile AI panel!",
    "read": false,
    "starred": false,
    "selected": true,
    "labels": []
  },
  {
    "id": 3,
    "subject": "Use the 1080p HTTP feed, then you can parse the cross-platform hard drive!",
    "read": false,
    "starred": true,
    "labels": ["dev"]
  },
  {
    "id": 4,
    "subject": "We need to program the primary TCP hard drive!",
    "read": true,
    "starred": false,
    "selected": true,
    "labels": []
  },
  {
    "id": 5,
    "subject": "If we override the interface, we can get to the HTTP feed through the virtual EXE interface!",
    "read": false,
    "starred": false,
    "labels": ["personal"]
  },
  {
    "id": 6,
    "subject": "We need to back up the wireless GB driver!",
    "read": true,
    "starred": true,
    "labels": []
  },
  {
    "id": 7,
    "subject": "We need to index the mobile PCI bus!",
    "read": true,
    "starred": false,
    "labels": ["dev", "personal"]
  },
  {
    "id": 8,
    "subject": "If we connect the sensor, we can get to the HDD port through the redundant IB firewall!",
    "read": true,
    "starred": true,
    "labels": []
  }
];

Message.remove({})
  .then(function () {
    console.log("Creating messages..");
    var messagePromises = messages.map(function (attributes) {
      var message = new Message(attributes);
      var promise = message.save();
      promise
        .then(
          function (message) { console.log('Created message ', message._id) },
          function () { console.log('FAIL') }
        );
      return promise;
    });
    return Q.all(messagePromises);
  })
  .then(function (messagePromises) {
    console.log("Created " + messagePromises.length + " messages")
    console.log("Disconnecting..");
    mongoose.disconnect();
  });
