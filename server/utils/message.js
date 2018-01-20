var moment = require('moment');


var generateMessage = (from, text) => {
  var date = moment(new Date().getTime());
  return {
    from, 
    text,
    createAt: date.format('h:mm a')
  }
};

var generateLocationMessage = (from, lat, lng) => {
  var date = moment(new Date().getTime());
  return {
    from,
    url: `https://www.google.com/maps?q=${lat},${lng}`,
    createAt: date.format('h:mm a')
  };
};

module.exports = {generateMessage, generateLocationMessage};