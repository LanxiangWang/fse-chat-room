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

  socket.on('disconnect', () => {
    console.log('User disconnected from server.');
  })
});






server.listen(port, () => {
  console.log(`Server is up on ${port}`);
})

