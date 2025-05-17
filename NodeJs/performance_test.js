// performance-test.js
const { io } = require('socket.io-client');
const axios = require('axios');

// Configuration
const TEST_DURATION = 60000; // 1 minute in milliseconds
const CONCURRENT_USERS = 500;
const MESSAGES_PER_USER = 10;
const SERVER_URL = 'http://localhost:3000';
const ROOMS = ['general', 'tech', 'random', 'news', 'games'];

// Performance metrics
let connectedClients = 0;
let messagesSent = 0;
let messagesReceived = 0;
let errors = 0;
let connectionTimes = [];
let messageTimes = [];

console.log(`Starting performance test with ${CONCURRENT_USERS} concurrent users`);
console.log(`Each user will send ${MESSAGES_PER_USER} messages`);
console.log(`Test will run for ${TEST_DURATION / 1000} seconds`);

// Create clients
const createClient = (index) => {
  const startTime = Date.now();
  const username = `user_${index}`;
  const room = ROOMS[index % ROOMS.length];
  
  const socket = io(SERVER_URL, {
    transports: ['websocket'],
    forceNew: true
  });
  
  socket.on('connect', () => {
    connectionTimes.push(Date.now() - startTime);
    connectedClients++;
    
    console.log(`Client ${index} connected (${connectedClients}/${CONCURRENT_USERS})`);
    
    // Join room
    socket.emit('join', { username, room });
    
    // Send messages with random delay
    let messageCount = 0;
    
    const sendMessage = () => {
      if (messageCount < MESSAGES_PER_USER) {
        const messageStartTime = Date.now();
        
        socket.emit('chatMessage', `Test message ${messageCount + 1} from ${username}`);
        messagesSent++;
        messageCount++;
        
        // Schedule next message
        setTimeout(() => {
          sendMessage();
        }, Math.random() * 5000); // Random delay between 0-5 seconds
      }
    };
    
    // Start sending messages after a short delay
    setTimeout(sendMessage, 1000 + Math.random() * 2000);
  });
  
  socket.on('message', () => {
    messagesReceived++;
  });
  
  socket.on('connect_error', (err) => {
    console.error(`Connection error for client ${index}: ${err.message}`);
    errors++;
  });
  
  socket.on('error', (err) => {
    console.error(`Socket error for client ${index}: ${err.message}`);
    errors++;
  });
  
  return socket;
};

// Create array of clients
const clients = Array.from({ length: CONCURRENT_USERS }, (_, i) => createClient(i));

// Monitor server health
const monitorServer = async () => {
  try {
    const response = await axios.get(`${SERVER_URL}/status`);
    return response.data;
  } catch (err) {
    console.error('Error fetching server status:', err.message);
    errors++;
    return null;
  }
};

// Print stats periodically
const statsInterval = setInterval(async () => {
  console.log('\n--- Current Stats ---');
  console.log(`Connected clients: ${connectedCl
