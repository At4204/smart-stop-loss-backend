// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Alpha Vantage API Key
const API_KEY = 'QK40O3YIC2MVZQMN'; // Your Alpha Vantage API key

// Endpoint to fetch live market price
app.get('/get-price', async (req, res) => {
    const { shareName } = req.query;

    if (!shareName) {
        return res.status(400).json({ error: 'Share name is required' });
    }

    try {
        // Fetch live price from Alpha Vantage API
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${shareName}.BO&apikey=${API_KEY}`;
        const response = await axios.get(url);

        console.log("API Response:", response.data); // Log the API response for debugging

        if (response.data['Global Quote']) {
            const price = response.data['Global Quote']['05. price'];
            res.json({ shareName, price });
        } else {
            // Log the error if the API response is invalid
            console.error("Invalid API response:", response.data);
            res.status(500).json({ error: 'Invalid API response', details: response.data });
        }
    } catch (error) {
        console.error('Error fetching price:', error);
        res.status(500).json({ error: 'Failed to fetch market price', details: error.message });
    }
});
