var moment = require('moment');


var generateMessage = (from, text, time) => {
  var date = moment(new Date().getTime());
  var formattedDate = date.format('h:mm a');
  time = time || formattedDate;
  return {
    from, 
    text,
    createAt: time
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