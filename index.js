var express = require('express');
var socket = require('socket.io');
let callNewsApi = require('./src/helpers/newsApi');
//import { callNewsApi } from './src/helpers/newsApi';
let redis = require('redis');

// create redis client
let client = redis.createClient();

// connect redis client
client.on('connect', function(){
  console.log('connected to redis...');
});

// Application Setup
var app = express();
var server = app.listen(8080, function() {
  console.log('listening to requests on port 8080!')
})

// Socket setup
var io = socket(server);

io.on('connection', function(socket){
  console.log('Client Connected: ', socket.id)
  let clientId = socket.id.toString();
  let data = {}
  
  // when a user submits a query, call the api and return the data back
  socket.on('query-news-api', function(data) {
    console.log('message recieved w/ data', data);
    callNewsApi(data.content.sources, data.content.query)
      .then((response)=> {
        console.log('AFTER PROMISE IN THEN', response);
        client.set(clientId, response, function(err, reply) {
          if (err) {
            console.log(err);
          }
          console.log(reply);
        });
        socket.emit('job-recieved', {})
      })
  })

  socket.on('query-update', function(data) {
    console.log('client checking if api call is done', clientId);
    client.get(clientId, function(err, reply) {
      if (err) {
        console.log(err);
      }
      console.log(reply);
      socket.emit('query-finished', reply)
    });
  })
})