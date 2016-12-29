//join method of path takes partial paths and joins them together
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message.js');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

//listen for an incoming connection
io.on('connection', (socket) => {
  console.log('New user connected');

  //emit msg to the individual user/cxn that joined
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  //emit msg to all other users, i.e. excludes user/cxn that just joined
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user Joined'));

  //server-side custom event listener
  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);

    // io.emit emits an event to every single connection
    // generate message and send to 'newMessage' event listener
    io.emit('newMessage', generateMessage(message.from, message.text));

    //acknowledgement callback, tells client that server processed the event
    callback();

    // //broadcast.emit, emit to all except the emitting user
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

//use server instead of app.listen
server.listen(port, () => {
  console.log(`Server up on port ${port}`);
});
