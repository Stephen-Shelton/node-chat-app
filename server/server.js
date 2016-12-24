//old way of creating paths, cumbersome since you go up then into dirs
// console.log(__dirname + '/../public');

//join method of path takes partial paths and joins them together
const path = require('path');
const publicPath = path.join(__dirname, '../public');
// console.log(publicPath);
const express = require('express');
const port = process.env.port || 3000;

var app = express();
app.use(express.static(publicPath));

// app.get('/', () => {
//   res.render('index.html');
// });

app.listen(port, () => {
  console.log(`Server up on port ${port}`);
});
//create express app
//config static middleware to serve up public folder
//call app.listen on port 3000, provide cb to log its running
//go to localhost 3000 in browser, should see message from index.html
