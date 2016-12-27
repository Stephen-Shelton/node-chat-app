var socket = io(); //initiate client-side socket

//don't use arrow functions client-side, inconsistent support from browsers outside of chrome
socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

//client-side custom event listener, data sent by emitter is arg for cb
socket.on('newMessage', function (message) {
  console.log('newMessage', message);
  //create element then append it to DOM
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  jQuery('#messages').append(li); //add to end of element
});

jQuery('#message-form').on('submit', function (e) {
  //preventDefault prevents page from refreshing and attaching text to query string
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function() {

  });
});


// var socket = io();
//
// socket.on('connect', function () {
//   console.log('Connected to server');
// });
//
// socket.on('disconnect', function () {
//   console.log('Disconnected from server');
// });
//
// socket.on('newMessage', function (message) {
//   console.log('newMessage', message);
//   var li = jQuery('<li></li>');
//   li.text(`${message.from}: ${message.text}`);
//
//   jQuery('#messages').append(li);
// });
//
// jQuery('#message-form').on('submit', function (e) {
//   e.preventDefault();
//
//   socket.emit('createMessage', {
//     from: 'User',
//     text: jQuery('[name=message]').val()
//   }, function () {
//
//   });
// });
