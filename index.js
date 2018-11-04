const express = require('express');
const socket = require('socket.io');
const callNewsApi = require('./src/helpers/newsApi');
const sentimentAnalysis = require('./src/helpers/sentimentAnalysis');
const redis = require('redis');

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
  
  // when a user submits a query, call the news api, perform analysis and store in redis cache
  socket.on('query-news-api', function(data) {
    console.log('message recieved w/ data', data);
    callNewsApi(data.content.sources, data.content.query)
      .then((response)=> {
        let responseJson = JSON.parse(response);
        sentimentAnalysis(responseJson)
          .then((response) =>{
            console.log(typeof response)
            client.set(clientId, response, function(err, reply) {
              if (err) {
                console.log(err);
              }
              console.log(reply);
            });
          })
      })
  })
  // when client polls, send back an update.  
  socket.on('query-update', function(data) {
    console.log('client checking if api call is done', clientId);
    client.get(clientId, function(err, reply) {
      if (err) {
        console.log(err);
      }
      //console.log(reply);
      socket.emit('query-finished', reply)
    });
  })
})