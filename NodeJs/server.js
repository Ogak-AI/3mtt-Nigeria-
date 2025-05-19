const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

// Clustering for scalability
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers for each CPU
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // Replace the dead worker
    cluster.fork();
  });
} else {
  // Workers can share the TCP connection
  const app = express();
  const server = http.createServer(app);
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // In-memory storage for active users and messages
  // In a production app, you'd use Redis for sharing state between workers
  const activeUsers = new Map();
  const chatHistory = [];
  const MAX_HISTORY = 50;

  // Serve static files
  app.use(express.static(path.join(__dirname, 'public')));

  // Socket.io connection handling
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);
    
    // Send chat history to new connections
    socket.emit('chat history', chatHistory);
    
    // Handle user joining
    socket.on('user join', (username) => {
      activeUsers.set(socket.id, username);
      
      // Broadcast new user to all clients
      io.emit('user joined', {
        userId: socket.id,
        username,
        activeUsers: Array.from(activeUsers.values()),
        timestamp: Date.now()
      });
      
      // Add system message to history
      addMessageToHistory({
        type: 'system',
        content: `${username} has joined the chat`,
        timestamp: Date.now()
      });
    });
    
    // Handle chat messages
    socket.on('chat message', (message) => {
      const username = activeUsers.get(socket.id);
      if (!username) return;
      
      const messageObject = {
        type: 'message',
        userId: socket.id,
        username,
        content: message,
        timestamp: Date.now()
      };
      
      // Add to history and broadcast
      addMessageToHistory(messageObject);
      io.emit('chat message', messageObject);
    });
    
    // Handle typing events
    socket.on('typing', (isTyping) => {
      const username = activeUsers.get(socket.id);
      if (!username) return;
      
      socket.broadcast.emit('user typing', {
        userId: socket.id,
        username,
        isTyping
      });
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      const username = activeUsers.get(socket.id);
      if (username) {
        activeUsers.delete(socket.id);
        
        // Notify others
        io.emit('user left', {
          userId: socket.id,
          username,
          activeUsers: Array.from(activeUsers.values()),
          timestamp: Date.now()
        });
        
        // Add system message to history
        addMessageToHistory({
          type: 'system',
          content: `${username} has left the chat`,
          timestamp: Date.now()
        });
      }
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
  
  // Helper function to add message to history with cap
  function addMessageToHistory(message) {
    chatHistory.push(message);
    if (chatHistory.length > MAX_HISTORY) {
      chatHistory.shift();
    }
    
    // In a real app, you might persist this to a database
  }

  // Start server
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Worker ${process.pid} started and listening on port ${PORT}`);
  });
                      }
