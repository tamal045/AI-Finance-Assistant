const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
// Port ko 5000 se badal kar 8080 kiya taaki Mac ka 403 error bypass ho sake
const PORT = 8080;

// 1. MIDDLEWARES (Pure open access ke sath)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// 2. ROUTES SETUP
const transactionRoutes = require(path.join(__dirname, 'routes', 'transactions'));
app.use('/api/transactions', transactionRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('AI Personal Finance Backend is Running Smoothly! 🔥');
});

// 3. MONGO_URI CONNECTION
const MONGO_URI = 'mongodb://127.0.0.1:27017/ai-finance-dashboard';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Database status: Connected Successfully to MongoDB! 🍃🚀'))
    .catch((err) => console.error('Database connection error ❌:', err));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is perfectly live on http://localhost:${PORT}`);
});