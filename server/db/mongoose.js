var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/chatRoom');

module.exports = {
  mongoose
}
