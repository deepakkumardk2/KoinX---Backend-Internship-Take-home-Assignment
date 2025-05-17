// worker-server/scheduler.js
const { publishUpdateEvent } = require('./config/nats');

// Schedule function to publish event every 15 minutes
const startScheduler = () => {
  console.log('Starting scheduler - will publish events every 15 minutes');
  
  // Publish immediately on startup
  publishUpdateEvent();
  
  // Then publish every 15 minutes (900000 milliseconds)
  setInterval(async () => {
    await publishUpdateEvent();
  }, 15 * 60 * 1000); // 15 minutes
};

module.exports = { startScheduler };
