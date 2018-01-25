// built-in module


const path = require('path');
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const {mongoose} = require('./db/mongoose');
const {Users} = require('./models/user');
const {messages} = require('./models/message');

// third-party module
const express = require('express');
const socketIO = require('socket.io');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const moment = require('moment');

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

var onlineNum = 0;
var userMap = new Map();

// serve static resources
// middleware
app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());

// io.on register an event listener, when this event happens, server can do something
// connection is a default event
io.on('connection', (socket) => {
  // greeting to the new user
  

  

  // listener for createMessage
  // 2nd param is the data emitted from client
  // 3rd param is the acknowledge (callback function) emitted from client
  socket.on('createMessage', (data, callback) => {
    console.log(data);
    var date = moment(new Date().getTime());

    var histroyMessage = new messages({
      text: data.text,
      user: data.from,
      createAt: date.format('h:mm a')
    });

    histroyMessage.save().then(() => {
      console.log('save message successfully');
    }, () => {
      console.log('save message fail');
    })

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

  socket.on('join', (user) => {
    userMap.set(socket.id, user);
    console.log(userMap.get(socket.id));

    // load all histroy message
    messages.find({}, (err, allMessages) => {
      allMessages.map(eachMessage => {
        socket.emit('newMessage', generateMessage(eachMessage.user, eachMessage.text, eachMessage.createAt));
      });
      socket.emit('newMessage', generateMessage('Admin', 'Welcome to FSE Chat Room!'));
    });

    

    socket.broadcast.emit('newMessage', generateMessage('Admin', `${user} join in FSE Chat Room!`));
    onlineNum++;
    io.emit('updatePeople', onlineNum);
  });


  socket.on('disconnect', () => {
    var user = userMap.get(socket.id);
    socket.broadcast.emit('newMessage', generateMessage('Admin', `${user} has left.`));
    onlineNum--;
    io.emit('updatePeople', onlineNum);
    console.log(`${user} disconnected from server.`);
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
  console.log(req.query.message);
  if (req.query.message) {
    var logout_message = req.query.message;
    console.log(logout_message);
    return res.render('index.hbs', {logout_message, alert_class: 'alert alert-success'});
  }

  if (req.query.loginError) {
    return res.render('index.hbs', {logout_message: req.query.loginError, alert_class: 'alert alert-danger'});
  }
  
  res.render('index.hbs');
});

app.get('/signup', (req, res) => {
  res.render('signup.hbs');
});

app.get('/logout', (req, res) => {
  res.redirect('/?message=Logout successfully!');
})

app.post('/signup', (req, res) => {
  console.log(req.body.pass[0]);2
  console.log(req.body.email);
  var user = new Users({
    email: req.body.email,
    nikeName: req.body.nickname,
    password: req.body.pass[0]
  });
  user.save().then(() => {
    console.log('save successfully');
    res.redirect(`/chat.html?user=${req.body.nickname}`);
  }, (e) => {
    console.log('cannot save', e);
  });
});

app.post('/', (req, res) => {
  var email = req.body.email;
  var originalPassword = req.body.pass;
  console.log(email, originalPassword);
  Users.findByEmail(email, originalPassword).then((user) => {

    res.redirect(`/chat.html?user=${user.nikeName}`);
    
  }).catch(() => {
    res.redirect('/?loginError=Incorrect email or password.');
  });
});








server.listen(port, () => {
  console.log(`Server is up on ${port}`);
})

