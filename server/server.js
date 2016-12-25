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

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// io.on('disconnect', () => {
//   console.log('Client disconnected');
// });

// app.get('/', () => {
//   res.render('index.html');
// });

//use server instead of app.listen
server.listen(port, () => {
  console.log(`Server up on port ${port}`);
});
