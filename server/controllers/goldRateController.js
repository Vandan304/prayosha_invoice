const GoldRate = require('../models/GoldRate');

// @desc    Get today's gold rate
// @route   GET /api/goldrate/today
const getTodayGoldRate = async (req, res) => {
    try {
        const today = new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD' in local time
        const rate = await GoldRate.findOne({ date: today });
        res.status(200).json(rate || null); // return null if not found
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Save today's gold rate
// @route   POST /api/goldrate
const saveGoldRate = async (req, res) => {
    try {
        const { goldRate } = req.body;
        const today = new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD'
        
        // Upsert gold rate for today
        const rate = await GoldRate.findOneAndUpdate(
            { date: today },
            { date: today, goldRate },
            { new: true, upsert: true }
        );

        res.status(201).json(rate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getTodayGoldRate,
    saveGoldRate,
};
