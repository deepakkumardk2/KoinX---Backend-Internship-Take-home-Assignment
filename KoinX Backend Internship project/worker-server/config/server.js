// worker-server/server.js
const { connectNATS } = require('./config/nats');
const { startScheduler } = require('./scheduler');
require('dotenv').config();

// Main function to start the worker server
const start = async () => {
  try {
    // Connect to NATS
    await connectNATS();
    
    // Start the scheduler
    startScheduler();
    
    console.log('Worker server started successfully');
  } catch (error) {
    console.error('Failed to start worker server:', error);
    process.exit(1);
  }
};

// Start the server
start();
