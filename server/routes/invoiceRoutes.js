const express = require('express');
const router = express.Router();
const {
    getInvoices,
    getLatestInvoice,
    getInvoice,
    createInvoice,
    deleteInvoice,
} = require('../controllers/invoiceController');


router.route('/').get(getInvoices).post(createInvoice);
router.route('/latest').get(getLatestInvoice);
router.route('/:id').get(getInvoice).delete(deleteInvoice);

module.exports = router;
