// server.js - Main application entry point
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const { createAdapter } = require('@socket.io/cluster-adapter');
const { setupMaster, setupWorker } = require('@socket.io/sticky');
const Redis = require('ioredis');

// Configuration
const PORT = process.env.PORT || 3000;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Cluster implementation for scalability
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  
  // Set up sticky sessions
  const httpServer = http.createServer();
  setupMaster(httpServer, {
    loadBalancingMethod: "least-connection"
  });
  
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
  // Fork workers based on CPU cores
  for (let i = 0; i < Math.min(numCPUs, 4); i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  // Worker process
  console.log(`Worker ${process.pid} started`);
  
  const app = express();
  const server = http.createServer(app);
  const io = socketIo(server);
  
  // Set up socket.io adapter for cross-worker communication
  io.adapter(createAdapter());
  setupWorker(io);
  
  // Serve static files
  app.use(express.static('public'));
  
  // Redis client for pub/sub across multiple Node instances
  const redisClient = new Redis(REDIS_URL);
  const redisPub = new Redis(REDIS_URL);
  
  // Connection tracking
  let connectionsCount = 0;
  
  // Socket.io event handling
  io.on('connection', (socket) => {
    connectionsCount++;
    
    // Log metrics every 10 connections
    if (connectionsCount % 10 === 0) {
      console.log(`Active connections: ${connectionsCount}`);
      console.log(`Memory usage: ${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`);
    }
    
    // When user joins
    socket.on('join', (userData) => {
      socket.username = userData.username;
      socket.room = userData.room;
      
      // Join room
      socket.join(userData.room);
      
      // Notify room of new user
      io.to(userData.room).emit('message', {
        type: 'system',
        text: `${userData.username} has joined the room`,
        timestamp: Date.now()
      });
      
      // Update user list
      updateUserList(userData.room);
    });
    
    // Handle chat messages
    socket.on('chatMessage', (message) => {
      // Publish to Redis for cross-instance communication
      const messageData = {
        type: 'user',
        username: socket.username,
        text: message,
        room: socket.room,
        timestamp: Date.now()
      };
      
      redisPub.publish('chat_messages', JSON.stringify(messageData));
      
      // Emit to current instance
      io.to(socket.room).emit('message', messageData);
    });
    
    // Handle user typing indicator
    socket.on('typing', (isTyping) => {
      socket.to(socket.room).emit('userTyping', {
        username: socket.username,
        isTyping
      });
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      connectionsCount--;
      
      if (socket.username) {
        io.to(socket.room).emit('message', {
          type: 'system',
          text: `${socket.username} has left the room`,
          timestamp: Date.now()
        });
        
        // Update user list
        updateUserList(socket.room);
      }
    });
  });
  
  // Subscribe to Redis messages
  redisClient.subscribe('chat_messages');
  redisClient.on('message', (channel, message) => {
    if (channel === 'chat_messages') {
      const messageData = JSON.parse(message);
      // Broadcast to appropriate room
      io.to(messageData.room).emit('message', messageData);
    }
  });
  
  // Helper to update user list in a room
  function updateUserList(room) {
    const clients = io.sockets.adapter.rooms.get(room);
    const users = [];
    
    if (clients) {
      clients.forEach(clientId => {
        const clientSocket = io.sockets.sockets.get(clientId);
        if (clientSocket.username) {
          users.push(clientSocket.username);
        }
      });
    }
    
    io.to(room).emit('userList', users);
  }
  
  // API routes
  app.get('/status', (req, res) => {
    res.json({
      connections: connectionsCount,
      worker: process.pid,
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  });
  
  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
        }
