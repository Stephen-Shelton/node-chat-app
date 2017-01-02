//join method of path takes partial paths and joins them together
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message.js');
const {isRealString} = require('./utils/validation.js');
const {Users} = require('./utils/users.js');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

//listen for an incoming connection
io.on('connection', (socket) => {
  console.log('New user connected');


  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }
    //socket.join native to socket.io
    socket.join(params.room);
    users.removeUser(socket.id); //remove user if in other room already
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    //emit msg to the individual user/cxn that joined
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    //emit msg to all other users in room, i.e. excludes current user/cxn
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

    callback();
  });

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
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
  });
});

//use server instead of app.listen
server.listen(port, () => {
  console.log(`Server up on port ${port}`);
});
