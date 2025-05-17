// worker-server/config/nats.js
const { connect, StringCodec } = require('nats');
require('dotenv').config();

let nc = null;
const sc = StringCodec();

const connectNATS = async () => {
  try {
    nc = await connect({
      servers: process.env.NATS_SERVER || 'nats://localhost:4222',
    });
    
    console.log(`Connected to NATS server at ${nc.getServer()}`);
    return nc;
  } catch (error) {
    console.error(`Error connecting to NATS: ${error.message}`);
    process.exit(1);
  }
};

const publishUpdateEvent = async () => {
  if (!nc) {
    throw new Error('NATS connection not established');
  }
  
  try {
    const message = { trigger: 'update' };
    nc.publish('crypto.update', sc.encode(JSON.stringify(message)));
    console.log('Published update event to NATS');
  } catch (error) {
    console.error('Error publishing update event:', error.message);
  }
};

module.exports = { connectNATS, publishUpdateEvent, StringCodec: sc };
// 2. Scheduler Implementation
Copy// worker-server/scheduler.js
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