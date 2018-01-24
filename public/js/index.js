// when call io(), we make a request from client to the server to open up a web socket and keep that connection open
var socket = io();

function scrollToBottom() {
  // selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children("li:last-child");
  // heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  console.log('clientHeight: ', clientHeight);
  console.log('scrollTop: ', scrollTop);
  console.log('scrollHeight: ', scrollHeight);
  console.log(newMessage);
  console.log('newMessageHeight: ', newMessageHeight);
  console.log('lastMessageHeight: ', lastMessageHeight);

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

// first param: event name
// second param: callback
// connect is a built-in event
socket.on('connect', function() {
  socket.emit('join', (jQuery.deparam(window.location.search).user));
});

socket.on('updatePeople', (num) => {
  jQuery('#users').html(num);
});

socket.on('disconnect', function() {
  socket.emit('leave', (jQuery.deparam(window.location.search).user));
});

socket.on('newLocation', function(position) {
  var template = jQuery('#location-template').html();
  var html = Mustache.render(template, {
    createAt: position.createAt,
    from: position.from,
    url: position.url
  });
  jQuery('#messages').append(html);
  scrollToBottom();
  // var li = jQuery('<li id="time-center"></li>');
  // li.text(position.createAt);
  // jQuery('#messages').append(li);

  // var li = jQuery('<li></li>');
  // var a = jQuery('<a target="_blank">My current location</a>');
  // li.text(`${position.from}: `);
  // a.attr('href', position.url);
  // li.append(a);
  // jQuery('#messages').append(li);
})
// the parameter in the callback function is the data emitted from server

// listener for newMessage
socket.on('newMessage', function(data) {
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    createAt: data.createAt,
    from: data.from,
    text: data.text
  });
  jQuery('#messages').append(html);
  scrollToBottom();

  // console.log(data);
  // var li = jQuery('<li id="time-center"></li>');
  // li.text(data.createAt);
  // jQuery('#messages').append(li);

  // var li = jQuery('<li></li>');
  // // var li = '<li>' + data.from + ': ' + data.text;

  // li.text(`${data.from}: ${data.text}`);

  // jQuery('#messages').append(li);
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
    from: jQuery.deparam(window.location.search).user,
    // jQuery('[]') select property, in this case, any element including name="message" property will be selected
    text: jQuery('[name=message]').val()
  }, function() {
    jQuery('[name=message]').val('');
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function() {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }
  jQuery('#send-location').attr('disabled', 'disabled').text('Sending location...');
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log(position);

    socket.emit('createLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, function() {
      jQuery('#send-location').removeAttr('disabled').text('Send location');
    });
  }, function(error) {  
    jQuery('#send-location').removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});


