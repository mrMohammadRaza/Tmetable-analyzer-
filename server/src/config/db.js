const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/classflow_ai';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database Warning] MongoDB connection error: ${error.message}`);
    console.warn('[Database Warning] System will run with memory fallback / lazy reconnect mode until database is reachable.');
    return null;
  }
};

module.exports = connectDB;
