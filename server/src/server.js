require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.IO for real-time notifications & updates
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  socket.on('join_organization', (orgId) => {
    socket.join(`org_${orgId}`);
    console.log(`[Socket.IO] Socket ${socket.id} joined room org_${orgId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Start HTTP Server immediately
server.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 ClassFlow AI Express API running on port ${PORT}`);
  console.log(`📡 Real-time Socket.IO initialized`);
  console.log(`==================================================`);
});

// Asynchronously attempt MongoDB Atlas connection
connectDB();
