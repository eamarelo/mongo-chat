//Declare dependencies
const app = require('express')();
const express = require('express');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const ent = require('ent');
const mongo = require('mongodb').MongoClient;

// Connect to mongo
mongo.connect('mongodb://localhost/mongochat', function (err, db) {
  if (err) {
    throw err;
  }

  //redirect http request to public folder
  app.use('/', express.static(`${__dirname}/public`));

  io.sockets.on('connection', (socket)=> {
    let chat = db.collection('chats');

    // Create function to send status
    sendStatus = function (s) {
      socket.emit('status', s);
    };

    // Get chats from mongo collection
    chat.find().limit(100).sort({'_id': 1}).toArray(function (err, res) {
      if (err) {
        throw err;
      }
      // Emit the messages
      socket.emit('output', res);
    });

    // when someone submit a pseudo we send it to clients

    socket.on('message', (message)=> {
      var username = ent.encode(message.pseudo);

      socket.username = username;
      var message = message.message;

      if (username == '' || message == '') {
        // Send error status
        sendStatus('Please enter a username and message');
      } else {
        // Insert message
        chat.insert({'username': username, 'message': message}, function () {
          socket.emit('output', {'username': username, 'message': message});

          // Send status object
          sendStatus({
            'message': 'Message sent',
            'clear': true
          });
        });
      }
      socket.broadcast.emit('message', {'pseudo': socket.username, 'message': message});
    });
    // Handle clear
    socket.on('clear', function (data) {
      // Remove all chats from collection
      chat.remove({}, function () {
        // Emit cleared
        socket.emit('cleared');
      });
    });
  });
});
server.listen(8080);
