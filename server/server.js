// built-in module
const path = require('path');

// third-party module
const express = require('express');

// setup for heroku
const port = process.env.PORT || 3000;

// setup
var app = express();

// serve static resources
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));






app.listen(port, () => {
  console.log(`Server is up on ${port}`);
})

