//Declare dependencies
const app = require('express')();
const express = require('express');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const ent = require('ent');


//redirect http request to public folder
app.use('/', express.static(`${__dirname}/public`));
io.sockets.on('connection', (socket)=> {
// when someone submit a pseudo we send it to clients
  socket.on('newClient', (username)=> {
    username = ent.encode(username);
    socket.username = username;
    socket.broadcast.emit('newClient', username);

  });

  // when someone send a message we send it to clients
  socket.on('message', (message)=> {
    message = ent.encode(message);
    socket.broadcast.emit('message', {'pseudo': socket.username, 'message': message});
  });
});
server.listen(8080);