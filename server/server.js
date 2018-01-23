// built-in module
const path = require('path');
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const {mongoose} = require('./db/mongoose');
const {Users} = require('./models/user');

// third-party module
const express = require('express');
const socketIO = require('socket.io');
const hbs = require('hbs');

// self-defined module
const {generateMessage, generateLocationMessage} = require('./utils/message');

// setup for heroku
const port = process.env.PORT || 3000;

// setup for server and socket.io
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

// setup view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));

// serve static resources
// middleware
app.use(express.static(publicPath));

// io.on register an event listener, when this even happens, server can do something
// connection is a default event
io.on('connection', (socket) => {
  console.log('New user connected');

  // greeting to the new user
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to FSE Chat Room!'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user join in FSE Chat Room!'));

  // listener for createMessage
  // 2nd param is the data emitted from client
  // 3rd param is the acknowledge (callback function) emitted from client
  socket.on('createMessage', (data, callback) => {
    console.log(data);

    // io.emit() will emit message to all sockets instead of the only socket in this io.on() method
    // the second param in the io.on() method is the individual client that send request to server
    io.emit('newMessage', generateMessage(data.from, data.text));
    callback();

    // socket.broadcast.emit() is similar to io.emit() but it will not send message to this socket
    // socket.broadcast.emit('newMessage', {
    //   from: data.from,
    //   text: data.text,
    //   createAt: new Date().getTime()
    // });
  })

  socket.on('disconnect', () => {
    console.log('User disconnected from server.');
  });

  socket.on('createLocation', (coords, callback) => {
    io.emit('newLocation', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    callback();
  })

  // socket.emit('newEmail', {
  //   from: 'Mike@example.com',
  //   subject: 'Hey!',
  //   createAt: 123
  // });

  // socket.on('createEmail', (data) => {
  //   console.log(data);
  // })
});

app.get('/', (req, res) => {
  res.render('index.hbs');
});

app.get('/signup', (req, res) => {
  res.render('signup.hbs');
})






server.listen(port, () => {
  console.log(`Server is up on ${port}`);
})

