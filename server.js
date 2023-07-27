const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS for the frontend domain (https://util-counter-three.vercel.app)
app.use(cors({
    origin: 'https://util-counter-three.vercel.app'
  }));

// In-memory storage for the counter value
let count = 0;

app.use(express.static('frontend'));
app.use(express.json()); // Parse JSON request bodies

// Endpoint to get the current count value
app.get('/api/count', (req, res) => {
    res.json({ count });
});

// Endpoint to update the count value
app.post('/api/count', (req, res) => {
    const { newCount } = req.body;
    if (typeof newCount === 'number' && newCount >= 0) {
        count = newCount;
        res.json({ success: true });
    } else {
        res.status(400).json({ error: 'Invalid count value. Count must be a non-negative number.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
