const app = require('../server/src/app');
const connectDB = require('../server/src/config/db');

// Attempt database connection on invocation
connectDB();

module.exports = app;
