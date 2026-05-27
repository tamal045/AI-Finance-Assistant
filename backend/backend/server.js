const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. CORS CONFIGURATION (Sabse pehle aur poora open)
app.use(cors({
    origin: '*', // Sabhi ko allow karo
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// 2. BODY PARSER
app.use(express.json());

// 3. ROUTES
const transactionRoutes = require('./routes/transactions');
app.use('/api/transactions', transactionRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('AI Personal Finance Backend is Running Smoothly! 🚀');
});

app.listen(5000, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Database status: Running in local memory mode! 🍃`);
});