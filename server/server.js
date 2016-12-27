//join method of path takes partial paths and joins them together
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.port || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

//listen for an incoming connection
io.on('connection', (socket) => {
  console.log('New user connected');

  //emit msg to the individual user that joined
  socket.emit('newMessage', {
    text: 'Welcome to the chat app',
    from: 'Admin',
    createdAt: new Date().getTime()
  });
  //emit msg to all other users
  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New user joined',
    createdAt: new Date().getTime()
  });

  // //server-side event emitter, socket.emit emits event to a single cxn
  // socket.emit('newMessage', {
  //   from: 'testUser',
  //   text: 'test new message',
  //   createAt: new Date()
  // });

  //server-side custom event listener
  socket.on('createMessage', (message) => {
    console.log('createMessage', message);

    // io.emit emits an event to every single connection
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });

    // //broadcast.emit, emit to everyone except the emitting user
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

//use server instead of app.listen
server.listen(port, () => {
  console.log(`Server up on port ${port}`);
});
