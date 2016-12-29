var socket = io(); //initiate client-side socket

//don't use arrow functions client-side, inconsistent support from browsers outside of chrome
socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

//client-side custom event listener, data sent by emitter is arg for cb
//takes message sent by emitter and appends it to client/DOM
socket.on('newMessage', function (message) {
  //Old way to append to DOM with just jQuery
  // console.log('newMessage', message);
  // var formattedTime = moment(message.createdAt).format('h:mm a');
  // //create element then append it to DOM
  // var li = jQuery('<li></li>');
  // li.text(`${message.from} ${formattedTime}: ${message.text}`);
  // jQuery('#messages').append(li); //add to end of element

  //Newer method to append to DOM with Mustache template and jQuery
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
});

socket.on('newLocationMessage', function (message) {
  //Old way to append to DOM with just jQuery
  // var formattedTime = moment(message.createdAt).format('h:mm a');
  // var li = jQuery('<li></li>');
  // //target="_blank" attribute tells browser to open up link in new tab instead of current tab, which would kick you out of the chat room.
  // var a = jQuery('<a target="_blank">My Current Location</a>');
  // //use li.text and a.attr to prevent xss
  // li.text(`${message.from} ${formattedTime}: `);
  // a.attr('href', message.url);
  // li.append(a);
  // jQuery('#messages').append(li);

  //Newer method to append to DOM with Mustache template and jQuery
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
});

//Collect text from message-form to then create message object/data
jQuery('#message-form').on('submit', function (e) {
  //preventDefault prevents page from refreshing and attaching text to query string, which is default bx
  e.preventDefault();
  var messageTextbox = jQuery('[name=message]');

  //Create object from text and send to 'createMessage' event listener
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
