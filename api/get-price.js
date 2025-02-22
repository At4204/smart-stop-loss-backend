const axios = require('axios');

module.exports = async (req, res) => {
    const { shareName } = req.query;
    if (!shareName) {
        return res.status(400).json({ error: "Share name is required." });
    }

    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${shareName}&apikey=BNM260I70G1WZTDL`;

    try {
        const response = await axios.get(url, { timeout: 10000 }); // 10-second timeout
        const data = response.data;

        if (data["Error Message"]) {
            return res.status(500).json({ error: data["Error Message"] });
        }

        if (data["Global Quote"] && data["Global Quote"]["05. price"]) {
            const price = parseFloat(data["Global Quote"]["05. price"]);
            return res.json({ price, shareName });
        } else {
            return res.status(404).json({ error: "No data found for the given symbol." });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};