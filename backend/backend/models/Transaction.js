const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Food', 'Salary', 'Rent', 'Entertainment', 'Utilities', 'Others'] // Fixed categories
    },
    type: {
        type: String,
        required: true,
        enum: ['income', 'expense'] // Sirf do hi type ho sakte hain
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);