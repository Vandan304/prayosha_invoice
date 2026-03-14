const express = require('express');
const router = express.Router();
const {
    getTodayGoldRate,
    saveGoldRate,
} = require('../controllers/goldRateController');

router.route('/today').get(getTodayGoldRate);
router.route('/').post(saveGoldRate);

module.exports = router;
