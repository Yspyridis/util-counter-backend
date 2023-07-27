const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes

// In-memory storage for the counter value
let count = 0;

app.use(express.static('frontend'));
app.use(express.json()); // Parse JSON request bodies

// Endpoint to get the current count value
app.get('/api/count', (req, res) => {
    fetch('https://util-counter-backend.vercel.app/api/count')
        .then(response => response.json())
        .then(data => {
            res.json({ count: data.count });
        })
        .catch(error => {
            console.error('Error fetching count:', error);
            res.status(500).json({ error: 'Failed to fetch count from the backend' });
        });
});


// Endpoint to update the count value
app.post('/api/count', (req, res) => {
    const { newCount } = req.body;
    if (typeof newCount === 'number' && newCount >= 0) {
        fetch('https://util-counter-backend.vercel.app/api/count', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newCount }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                res.json({ success: true });
            } else {
                res.status(500).json({ error: 'Failed to update count on the backend' });
            }
        })
        .catch(error => {
            console.error('Error updating count:', error);
            res.status(500).json({ error: 'Failed to update count on the backend' });
        });
    } else {
        res.status(400).json({ error: 'Invalid count value. Count must be a non-negative number.' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
