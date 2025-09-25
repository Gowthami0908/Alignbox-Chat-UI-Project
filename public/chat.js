const socket = io();
const messagesDiv = document.getElementById('messages');
const form = document.getElementById('chat-form');
const userInput = document.getElementById('user');
const messageInput = document.getElementById('message');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const user = userInput.value.trim();
  const message = messageInput.value.trim();
  if (user && message) {
    socket.emit('chat message', { user, message });
    messageInput.value = '';
  }
});

socket.on('chat message', (data) => {
  const div = document.createElement('div');
  const currentUser = userInput.value.trim();
  div.className = 'message ' + (data.user === currentUser ? 'self' : 'other');
  div.innerHTML = `<span class="meta">${data.user} ・ ${new Date(data.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>${data.message}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});