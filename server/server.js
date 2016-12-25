//join method of path takes partial paths and joins them together
const path = require('path');
const publicPath = path.join(__dirname, '../public');
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
