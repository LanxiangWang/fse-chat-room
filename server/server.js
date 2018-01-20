// built-in module
const path = require('path');
const http = require('http');
const publicPath = path.join(__dirname, '../public');

// third-party module
const express = require('express');
const socketIO = require('socket.io');

// setup for heroku
const port = process.env.PORT || 3000;

// setup
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

// serve static resources
// middleware
app.use(express.static(publicPath));

// io.on register an event listener, when this even happens, server can do something
// connection is a default event
io.on('connection', (socket) => {
  console.log('New user connected');


  // emitter for newMessage
  socket.emit('newMessage', {
    text: 'Hey, there. This is from server.',
    from: 'Lanxiang',
    createAt: new Date().toString()
  });

  // listener for createMessage
  socket.on('createMessage', (data) => {
    console.log(data);
  })

  socket.on('disconnect', () => {
    console.log('User disconnected from server.');
  });

  // socket.emit('newEmail', {
  //   from: 'Mike@example.com',
  //   subject: 'Hey!',
  //   createAt: 123
  // });

  // socket.on('createEmail', (data) => {
  //   console.log(data);
  // })
});






server.listen(port, () => {
  console.log(`Server is up on ${port}`);
})

