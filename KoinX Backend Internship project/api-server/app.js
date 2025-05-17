// api-server/app.js
const express = require('express');
const connectDB = require('./config/db');
const { connectNATS } = require('./config/nats');
const { storeCryptoStats } = require('./services/cryptoService');

// Import routes
const statsRouter = require('./routes/stats');
const deviationRouter = require('./routes/deviation');

// Initialize Express app
const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Connect to NATS and listen for events
(async () => {
  try {
    const { subscription } = await connectNATS();
    
    // Process incoming NATS messages
    (async () => {
      for await (const msg of subscription) {
        const data = JSON.parse(msg.data);
        if (data.trigger === 'update') {
          console.log('Received update event from NATS. Fetching crypto data...');
          await storeCryptoStats();
        }
      }
    })();

    // Initial fetch when server starts
    await storeCryptoStats();
  } catch (error) {
    console.error('Failed to process NATS subscription:', error);
  }
})();

// API routes
app.use('/stats', statsRouter);
app.use('/deviation', deviationRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.send('KoinX API Server is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

module.exports = app;
