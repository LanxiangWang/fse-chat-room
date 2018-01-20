// when call io(), we make a request from client to the server to open up a web socket and keep that connection open
var socket = io();

// first param: event name
// second param: callback
// connect is a built-in event
socket.on('connect', function() {
  console.log('Connect to server');

  socket.emit('createMessage', {
    text: "What'up, this is from client.",
    from: "Lanxiang"
  });
  

});

socket.on('disconnect', function() {
  console.log('Disconnect from server');
});

// the parameter in the callback function is the data emitted from server

// listener for newMessage
socket.on('newMessage', function(data) {
  console.log(data);
});

// emitter for createMessage
// socket.emit('createMessage', {
//   text: "What'up, this is from client."
// });



