const mongoose = require('mongoose');

var MessageSchema = mongoose.Schema({
  text: {
    type: String,
  },

  createAt: {
    type: String
  },

  user: {
    type: String
  }

});

var messages = mongoose.model('Message', MessageSchema);

module.exports = {messages};