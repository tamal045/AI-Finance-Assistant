const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// 1. Mongoose Schema Configuration
const TransactionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    date: { type: Date, default: Date.now }
});

// Model register karo (Agar pehle se bana hai toh wahi use karega)
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);

// 2. GET API: Database se saara data nikalne ke liye
router.get('/', async (req, res) => {
    try {
        const data = await Transaction.find().sort({ date: -1 });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: "Database se data nikalne me dikkat aayi!" });
    }
});

// 3. POST API: Real Database me entry save karne ke liye
router.post('/', async (req, res) => {
    try {
        const { title, amount, category, type } = req.body;

        const newTransaction = new Transaction({
            title,
            amount,
            category,
            type
        });

        const savedData = await newTransaction.save();
        res.status(201).json(savedData); // Frontend ko success response bhejo
    } catch (err) {
        res.status(400).json({ error: "Database me save karte waqt error aaya!" });
    }
});

module.exports = router;