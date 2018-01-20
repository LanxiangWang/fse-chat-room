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
})


