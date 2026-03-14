const mongoose = require('mongoose');

const goldRateSchema = mongoose.Schema(
    {
        date: {
            type: String, // Store as YYYY-MM-DD
            required: true,
            unique: true,
        },
        goldRate: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('GoldRate', goldRateSchema);
