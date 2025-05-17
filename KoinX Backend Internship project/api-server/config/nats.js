// api-server/config/nats.js
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

        // Subscribe to "update" events
        const subscription = nc.subscribe('crypto.update');

        // Export the subscription to be used in cryptoService
        return { nc, subscription };
    } catch (error) {
        console.error(`Error connecting to NATS: ${error.message}`);
        process.exit(1);
    }
};

module.exports = { connectNATS, StringCodec: sc };
