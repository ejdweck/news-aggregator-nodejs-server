const express = require('express');
const socket = require('socket.io');
const callNewsApi = require('./src/helpers/newsApi');
const sentimentAnalysis = require('./src/helpers/sentimentAnalysis');
const pdSentimentAnalysis = require('./src/helpers/parallelDots');
const redis = require('redis');

// create redis client
let client = redis.createClient();

// connect redis client
client.on('connect', function(){
  console.log('connected to redis...');
});

// Application Setup
var app = express();
let port = process.env.PORT || 8080;
var server = app.listen(port, function() {
  console.log('listening to requests on port 8080!')
})

// Socket setup
var io = socket(server);

io.on('connection', function(socket){
  console.log('Client Connected: ', socket.id)
  let clientId = socket.id.toString();
  // when a user submits a query, call the news api, perform analysis and store in redis cache
  socket.on('query-news-api', function(data) {
    console.log('message recieved w/ data', data);
    callNewsApi(data.content.sources, data.content.query)
      .then((response)=> {
        let responseJson = JSON.parse(response);
        sentimentAnalysis(responseJson)
        //pdSentimentAnalysis(responseJson)
          .then((response) =>{
            //console.log(typeof response)
            client.set(clientId, response, function(err, reply) {
              if (err) {
                console.log(err);
              } else {
                console.log('data stored: ' , reply);
              }
            });
          });
      });
  });
  // when client polls, send back an update.  
  socket.on('query-update', function(data) {
    console.log('client checking if api call is done', clientId);
    client.get(clientId, function(err, data) {
      if (err) {
        console.log(err);
      }
      // see the extra poll requests that make it before the client stops polling
      console.log("DATA FROMR EDIS: ", data)
      //console.log(data == null);
      // hack fix for null bug
      if (data === null) {
        console.log('data is null');
      } else {
        // send data to client
        socket.emit('query-finished', data)
        // delete job from cache
        client.del(clientId, function(err, response) {
          if (response == 1) {
            console.log("Deleted Successfully!")
          } else{
          console.log("Cannot delete")
          }
        });
      }
    });
  });
});
