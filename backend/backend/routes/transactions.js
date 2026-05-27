const express = require('express');
const router = express.Router();

// Temporary local array to store data in memory
let localTransactions = [
    { id: 1, title: 'Salary', amount: 50000, category: 'Salary', type: 'income', date: new Date() },
    { id: 2, title: 'Food', amount: 12450, category: 'Food', type: 'expense', date: new Date() }
];

// 1. GET Route: Saare transactions frontend ko bhejna
router.get('/all', (req, res) => {
    res.status(200).json({ success: true, data: localTransactions });
});

// 2. POST Route: Naya transaction add karna
router.post('/add', (req, res) => {
    const { title, amount, category, type } = req.body;
    const newTransaction = {
        id: localTransactions.length + 1,
        title,
        amount: Number(amount),
        category,
        type,
        date: new Date()
    };
    localTransactions.unshift(newTransaction); // Naya transaction upar dikhane ke liye
    res.status(201).json({ success: true, message: 'Transaction added to memory!', data: newTransaction });
});

module.exports = router;