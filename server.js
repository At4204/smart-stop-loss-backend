const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const API_KEY = process.env.QK40O3YIC2MVZQMN; // Your Alpha Vantage API key

app.get('/get-price', async (req, res) => {
    const { shareName } = req.query;

    if (!shareName) {
        return res.status(400).json({ error: 'Share name is required' });
    }

    try {
        const response = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${shareName}.BSE&apikey=${API_KEY}`);
        const price = response.data['Global Quote']['05. price'];
        res.json({ shareName, price });
    } catch (error) {
        console.error('Error fetching price:', error);
        res.status(500).json({ error: 'Failed to fetch market price' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Endpoint to fetch live market price
app.get('/get-price', async (req, res) => {
    const { shareName } = req.query;

    if (!shareName) {
        return res.status(400).json({ error: 'Share name is required' });
    }

    try {
        // Fetch live price from AngelOne API
        const response = await axios.get('https://apiconnect.angelbroking.com/rest/secure/angelbroking/market/v1/quote', {
            headers: {
                'X-PrivateKey': API_KEY,
                'X-ClientID': CLIENT_ID,
            },
            params: {
                exch: 'NSE', // Exchange (NSE for National Stock Exchange)
                symbol: shareName, // Share symbol (e.g., RELIANCE, TCS)
            },
        });

        const price = response.data.data[0].lastPrice;
        res.json({ shareName, price });
    } catch (error) {
        console.error('Error fetching price:', error);
        res.status(500).json({ error: 'Failed to fetch market price' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
