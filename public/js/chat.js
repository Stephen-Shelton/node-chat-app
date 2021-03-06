var socket = io(); //initiate client-side socket

//implement automatic scrolling functionality
function scrollToBotton() {
  //selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');

  //heights variables
  //.prop gives cross-browser way to fetch a property, it's shorthand jQuery without using jQuery() to fetch a prop, works across all browsers
  var clientHeight = messages.prop('clientHeight'); //h of client's browser
  var scrollTop = messages.prop('scrollTop'); //h to scroll back to top
  var scrollHeight = messages.prop('scrollHeight'); //total h
  var newMessageHeight = newMessage.innerHeight(); //h for newest msg
  var lastMessageHeight = newMessage.prev().innerHeight(); //2nd-to-last msg

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    //if user scrolled to bottom or very close to bottom, client automatically keeps scrolling to bottom as new messages come in.
    //if user scrolled to top or somewhere middle and scrollHeight > clientHeight, client does NOT auto scroll to bottom.
    messages.scrollTop(scrollHeight);
  }
}

//don't use arrow functions client-side, inconsistent support from browsers outside of chrome
socket.on('connect', function () {
  console.log('Connected to server');
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
  console.log('Users list', users);
  var ol = jQuery('<ol></ol>');
  users.forEach(function (user) {
    var li = jQuery('<li></li>').text(user);
    ol.append(li);
    //use html and not append bc we want to wipe the list then re-render it
    jQuery('#users').html(ol);
  });
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
  scrollToBotton();
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
  scrollToBotton();
});

//Collect text from message-form to then create message object/data
jQuery('#message-form').on('submit', function (e) {
  //preventDefault prevents page from refreshing and attaching text to query string, which is default bx
  e.preventDefault();
  var messageTextbox = jQuery('[name=message]');

  //Create object from text and send to 'createMessage' event listener
  socket.emit('createMessage', {
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
