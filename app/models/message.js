var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Message = new Schema({
  subject: {type : String, default : '', trim : true},
  read: Boolean,
  starred: Boolean,
  labels: Array
});

mongoose.model('Message', Message);
