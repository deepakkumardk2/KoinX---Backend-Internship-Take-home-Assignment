// api-server/models/crypto.js
const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    current_price: {
        type: Number,
        required: true
    },
    market_cap: {
        type: Number,
        required: true
    },
    price_change_percentage_24h: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Add index for efficient queries
cryptoSchema.index({ id: 1, timestamp: 1 });

module.exports = mongoose.model('Crypto', cryptoSchema);
