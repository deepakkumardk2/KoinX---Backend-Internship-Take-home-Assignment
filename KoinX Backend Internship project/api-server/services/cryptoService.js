// api-server/services/cryptoService.js
const axios = require('axios');
const Crypto = require('../models/crypto');

// Function to fetch and store cryptocurrency data from CoinGecko API
const storeCryptoStats = async () => {
    try {
        console.log('Fetching cryptocurrency data from CoinGecko');

        // Fetch data for the specified coins
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: 'usd',
                ids: 'bitcoin,ethereum,matic-network',
                price_change_percentage: '24h',
                sparkline: false,
                per_page: 3,
            },
        });

        const cryptoData = response.data;
        const timestamp = new Date();

        // Store data in MongoDB
        for (const coin of cryptoData) {
            await Crypto.create({
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol,
                current_price: coin.current_price,
                market_cap: coin.market_cap,
                price_change_percentage_24h: coin.price_change_percentage_24h || 0,
                timestamp
            });
            console.log(`Data stored for ${coin.name}`);
        }

        return true;
    } catch (error) {
        console.error('Error storing crypto stats:', error.message);
        return false;
    }
};

// Function to get latest stats for a specific coin
const getLatestStats = async (coin) => {
    try {
        const latestCrypto = await Crypto.findOne({ id: coin })
            .sort({ timestamp: -1 })
            .select('current_price market_cap price_change_percentage_24h')
            .lean();

        if (!latestCrypto) {
            return null;
        }

        return {
            price: latestCrypto.current_price,
            marketCap: latestCrypto.market_cap,
            "24hChange": latestCrypto.price_change_percentage_24h
        };
    } catch (error) {
        console.error('Error getting latest stats:', error.message);
        throw error;
    }
};

// Function to calculate standard deviation of a coin's price
const calculateStandardDeviation = async (coin) => {
    try {
        // Get the last 100 records for the specified coin
        const records = await Crypto.find({ id: coin })
            .sort({ timestamp: -1 })
            .limit(100)
            .select('current_price')
            .lean();

        if (records.length === 0) {
            return null;
        }

        const prices = records.map(record => record.current_price);

        // Calculate mean
        const sum = prices.reduce((acc, price) => acc + price, 0);
        const mean = sum / prices.length;

        // Calculate sum of squared differences from mean
        const squaredDifferencesSum = prices.reduce((acc, price) => {
            const difference = price - mean;
            return acc + (difference * difference);
        }, 0);

        // Calculate variance and standard deviation
        const variance = squaredDifferencesSum / prices.length;
        const deviation = Math.sqrt(variance);

        return parseFloat(deviation.toFixed(2));
    } catch (error) {
        console.error('Error calculating standard deviation:', error.message);
        throw error;
    }
};

module.exports = {
    storeCryptoStats,
    getLatestStats,
    calculateStandardDeviation
};
