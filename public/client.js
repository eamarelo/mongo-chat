const io = require('socket.io-client');
const socket = io.connect('http://localhost:8080');

const inputUsername = document.querySelector('.username');
const valueMessages = document.querySelector('.valueMessages');
const clearBtn = document.querySelector('.clearBtn');
const messages = document.querySelector('.messages');

// Set default status
var statusDefault = status.textContent;

var setStatus = function (s) {
// Set status
  status.textContent = s;

  if (s !== statusDefault) {
    var delay = setTimeout(function () {
      setStatus(statusDefault);
    }, 4000);
  }
};

socket.on('output', function (data) {
  if (data.length) {
    for (var x = 0; x < data.length; x ++) {
      // Build out message div
      showMessage(data[x].username, data[x].message);
    }
  }
});

// Get Status From Server
socket.on('status', function (data) {
  console.log(data);
  // get message status
  setStatus(typeof data === 'object' ? data.message : data);

  // If status is clear, clear text
  if (data.clear) {
    valueMessages.value = '';
  }
});

valueMessages.addEventListener('keypress', e => {
  if (e.keyCode === 13 && event.shiftKey == false) {
    let message = valueMessages.value;
    let username = inputUsername.value;

    if (username == '' || message == '') {
      alert('Please enter a username and message');
    } else {
      let intro = 'Vous êtes connecter sous le nom de ' + username;

      showMessage(username, intro);
      socket.emit('message', {'pseudo': username, 'message': message});
      showMessage(username, message);
    }
  }
});

// Handle Chat Clear
clearBtn.addEventListener('click', function () {
  console.log('clicked');
  socket.emit('clear');
});

// Clear Message
socket.on('cleared', function () {
  console.log('cleared');
  messages.textContent = '';
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
}
