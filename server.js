var express = require('express');
var http = require("http");

var app = express();
let port = 4200;
app.use(express.static('./dist/geo'));
app.get('/', function (req, res) {
  res.sendFile('index.html', {
    root: 'dist/geo/'
  });
});

app.listen(port,'185.119.89.37',function(){
  console.log('App runing on port' + port)
 })
