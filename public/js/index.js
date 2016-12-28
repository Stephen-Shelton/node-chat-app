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

socket.on('newLocationMessage', function (message) {
  var li = jQuery('<li></li>');
  //target="_blank" attribute tells browser to open up link in new tab instead of current tab, which would kick you out of the chat room.
  var a = jQuery('<a target="_blank">My Current Location</a>');
  //use li.text and a.attr to prevent xss
  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
  //preventDefault prevents page from refreshing and attaching text to query string
  e.preventDefault();
  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function() {
    messageTextbox.val('');
  });
});

//fetch and show location to client
var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }
  //when btn clicked, disable btn by adding attr and val of disabled
  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    //remove disabled attr if location successfully sent to re-enable btn
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location');
  });
});
