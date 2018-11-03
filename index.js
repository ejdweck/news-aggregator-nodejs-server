var express = require('express')
var socket = require('socket.io')


// Application Setup
var app = express();
var server = app.listen(8080, function() {
  console.log('listening to requests on port 8080!')
})

// Socket setup
var io = socket(server);

io.on('connection', function(socket){
  console.log('Client Connected: ', socket.id)

  socket.on('query-news-api', function(data){
    console.log('message recieved w/ data', data);
  })
})