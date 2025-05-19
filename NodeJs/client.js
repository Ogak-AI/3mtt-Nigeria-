document.addEventListener('DOMContentLoaded', () => {
  // Connect to Socket.io server
  const socket = io();
  
  // DOM elements
  const usernameModal = document.getElementById('username-modal');
  const usernameForm = document.getElementById('username-form');
  const usernameInput = document.getElementById('username-input');
  const messageForm = document.getElementById('message-form');
  const messageInput = document.getElementById('message-input');
  const chatMessages = document.getElementById('chat-messages');
  const usersList = document.getElementById('users-list');
  const userCount = document.getElementById('user-count');
  const typingIndicator = document.getElementById('typing-indicator');
  
  // App state
  let username = '';
  let activeUsers = [];
  let typingTimeout;
  
  // Show username modal on load
  usernameModal.style.display = 'flex';
  
  // Username form submission
  usernameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    username = usernameInput.value.trim();
    
    if (username) {
      // Join chat
      socket.emit('user join', username);
      usernameModal.style.display = 'none';
      messageInput.focus();
    }
  });
  
  // Message form submission
  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    
    if (message) {
      socket.emit('chat message', message);
      messageInput.value = '';
      messageInput.focus();
    }
  });
  
  // Typing indicator
  messageInput.addEventListener('input', () => {
    socket.emit('typing', true);
    
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit('typing', false);
    }, 1000);
  });
  
  // Socket events
  socket.on('chat history', (history) => {
    history.forEach(msg => appendMessage(msg));
  });
  
  socket.on('user joined', (data) => {
    activeUsers = data.activeUsers;
    updateUsersList();
    appendMessage({
      type: 'system',
      content: `${data.username} has joined the chat`,
      timestamp: data.timestamp
    });
  });
  
  socket.on('user left', (data) => {
    activeUsers = data.activeUsers;
    updateUsersList();
    appendMessage({
      type: 'system',
      content: `${data.username} has left the chat`,
      timestamp: data.timestamp
    });
  });
  
  socket.on('chat message', (msg) => {
    appendMessage(msg);
  });
  
  socket.on('user typing', (data) => {
    if (data.isTyping) {
      typingIndicator.textContent = `${data.username} is typing...`;
    } else {
      typingIndicator.textContent = '';
    }
  });
  
  // Helper functions
  function appendMessage(msg) {
    const messageEl = document.createElement('div');
    messageEl.classList.add('message');
    
    if (msg.type === 'system') {
      messageEl.classList.add('system-message');
      messageEl.innerHTML = `<div class="message-content">${msg.content}</div>
                           <div class="message-time">${formatTime(msg.timestamp)}</div>`;
    } else {
      const isOwnMessage = msg.username === username;
      messageEl.classList.add(isOwnMessage ? 'own-message' : 'other-message');
      
      messageEl.innerHTML = `<div class="message-header">
                           <span class="message-username">${msg.username}</span>
                           <span class="message-time">${formatTime(msg.timestamp)}</span>
                          </div>
                          <div class="message-content">${msg.content}</div>`;
    }
    
    chatMessages.appendChild(messageEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  function updateUsersList() {
    usersList.innerHTML = '';
    activeUsers.forEach(user => {
      const userEl = document.createElement('li');
      userEl.textContent = user;
      if (user === username) {
        userEl.classList.add('current-user');
      }
      usersList.appendChild(userEl);
    });
    
    userCount.textContent = activeUsers.length;
  }
  
  function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
});
