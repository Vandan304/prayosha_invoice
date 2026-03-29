const mongoose = require('mongoose');

const invoiceSchema = mongoose.Schema(
    {
        invoiceNumber: {
            type: Number,
            required: true,
            unique: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        customerName: {
            type: String,
            required: true,
        },
        mobile: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        items: [{
            itemName: { type: String, required: true },
            goldPurity: { type: String, required: true },
            weight: { type: Number, required: true },
            makingCharge: { type: Number, required: true, default: 0 },
            goldPrice: { type: Number, required: true }
        }],
        goldRate: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            default: 0,
        },
        finalAmount: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
