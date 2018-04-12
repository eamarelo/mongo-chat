const io = require('socket.io-client');
const socket = io.connect('http://localhost:8080');

const inputUsername = document.querySelector('.username');
const valueMessages = document.querySelector('.valueMessages');
let username ='';

inputUsername.addEventListener('keypress', e => {
  if (e.keyCode === 13) {
   username = inputUsername.value;
    socket.emit('newClient', username);
    document.title = username + ' - ' + document.title;
    let message ='Vous êtes connecter sous le nom de ' + username;
    showMessage(username, message)
  }
});


valueMessages.addEventListener('keypress', e => {
   if (e.keyCode === 13) {
    let message = valueMessages.value;
    socket.emit('message', message);
    showMessage(username, message)
  }
});

socket.on('newClient', (data)=> {
  let message = ' vient de se connecter';
  showMessage(data, message);
});

socket.on('message', (data)=> {
  showMessage(data.pseudo, data.message);
});

function showMessage (username, message) {
  const element = document.createElement('p');
  const textnode = document.createTextNode(username + ': ' + message);

  element.setAttribute('id', 'container');
  element.appendChild(textnode);
  document.querySelector('.messages').appendChild(element);
  document.querySelector('.valueMessages').value = '';
  document.querySelector('.username').value = '';
}

/*
*display message to zone_chat id
*/
/*document.getElementById('formulaire_chat').onsubmit = ()=> {
  let message = document.getElementById('message').value();*/