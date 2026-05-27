const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URL (Aapki convenience ke liye abhi test cluster daal diya hai)
const mongoURI = "mongodb+srv://admin:password123@cluster0.xxxx.mongodb.net/FinanceAI?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB Database Connected Successfully! 🍃'))
    .catch((err) => console.error('Database connection error ❌:', err));

// Test Route
app.get('/', (req, res) => {
    res.send('AI Personal Finance Backend is Running! 🚀');
});

// Server Start
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});