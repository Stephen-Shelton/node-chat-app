var socket = io(); //initiate request

//don't use arrow functions client-side, inconsistent support from browsers outside of chrome
socket.on('connect', function () {
  console.log('Connected to server');

  // //client-side event emitter
  // socket.emit('createMessage', {
  //   from: 'creatorOfMessage@create.com',
  //   text: 'sample for newly created message'
  // });
});

//client-side custom event listener, data sent by emitter is arg for cb
socket.on('newMessage', function (message) {
  console.log('newMessage', message);
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});
