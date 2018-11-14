//var os = require('os');
var should = require("chai").should();
var socketio_client = require('socket.io-client');

//var end_point = 'http://' + os.hostname() + ':8080';
var end_point = 'http://localhost:8080';
var opts = {forceNew: true};

describe("async test with socket.io", function () {
this.timeout(10000);

it('Response should be an non empty string that will then be parsed to json', function (done) {
  setTimeout(function () {
    var socket_client = socketio_client(end_point, opts);  
    let data = {
      content: {
        sources: ['fox-news'],
        query: 'trump'
      },
    }
    socket_client.emit('query-news-api', data);
    
    let interval = setInterval(() => {
      socket_client.emit('query-update', {});
    }, 100);
    // when server responds with query finished, stop the polling,
    // and parse the response data and store in state
    socket_client.on('query-finished', (data) => {
      clearInterval(interval);
      data.should.be.an('string');
      socket_client.disconnect();
      done();
    });

    socket_client.on('event response error', function (data) {
        console.error(data);
        socket_client.disconnect();
        done();
        });
    }, 4000);
  });
});