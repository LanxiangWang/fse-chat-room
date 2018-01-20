// when call io(), we make a request from client to the server to open up a web socket and keep that connection open
var socket = io();

// first param: event name
// second param: callback
// connect is a built-in event
socket.on('connect', function() {
  console.log('Connect to server');

  // socket.emit('createMessage', {
  //   text: "What'up, this is from client.",
  //   from: "Lanxiang"
  // });
  

});

socket.on('disconnect', function() {
  console.log('Disconnect from server');
});

socket.on('newLocation', function(position) {
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>');
  li.text(`${position.from}: `);
  a.attr('href', position.url);
  li.append(a);
  jQuery('#messages').append(li);
})
// the parameter in the callback function is the data emitted from server

// listener for newMessage
socket.on('newMessage', function(data) {
  console.log(data);
  var li = jQuery('<li></li>');
  // var li = '<li>' + data.from + ': ' + data.text;

  li.text(`${data.from}: ${data.text}`);

  jQuery('#messages').append(li);
});

// emitter for createMessage
// socket.emit('createMessage', {
//   text: "What'up, this is from client."
// });

// the 3rd param is a callback function to realize acknowledgement
// socket.emit('createMessage', {
//   from: 'Kobe',
//   text: 'hi'
// }, function(data) {
//   console.log('Got it');
//   console.log(data);
// });

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    // jQuery('[]') select property, in this case, any element including name="message" property will be selected
    text: jQuery('[name=message]').val()
  }, function() {

  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function() {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  navigator.geolocation.getCurrentPosition(function(position) {
    console.log(position);
    socket.emit('createLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function(error) {  
    alert('Unable to fetch location.');
  });
});


