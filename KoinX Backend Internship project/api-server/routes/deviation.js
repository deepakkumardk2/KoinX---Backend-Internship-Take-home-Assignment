// api-server/routes/deviation.js
const express = require('express');
const router = express.Router();
const { calculateStandardDeviation } = require('../services/cryptoService');

router.get('/', async (req, res) => {
    try {
        const { coin } = req.query;

        if (!coin) {
            return res.status(400).json({ error: 'Coin parameter is required' });
        }

        // Validate if coin is one of the supported ones
        const supportedCoins = ['bitcoin', 'ethereum', 'matic-network'];
        if (!supportedCoins.includes(coin.toLowerCase())) {
            return res.status(400).json({
                error: 'Invalid coin. Supported coins are: bitcoin, ethereum, matic-network'
            });
        }

        const deviation = await calculateStandardDeviation(coin.toLowerCase());

        if (deviation === null) {
            return res.status(404).json({ error: `No data found for ${coin}` });
        }

        return res.json({ deviation });
    } catch (error) {
        console.error(`Error in /deviation endpoint: ${error.message}`);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
