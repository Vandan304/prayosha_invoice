const Invoice = require('../models/Invoice');

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Public (Will implement admin later if required)
const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().sort({ createdAt: -1 });
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get latest invoice number
// @route   GET /api/invoices/latest
// @access  Public
const getLatestInvoice = async (req, res) => {
    try {
        const lastInvoice = await Invoice.findOne().sort({ invoiceNumber: -1 });
        const nextId = lastInvoice && lastInvoice.invoiceNumber ? Number(lastInvoice.invoiceNumber) + 1 : 1;
        res.status(200).json({ nextInvoiceNumber: nextId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Public
const getInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new invoice
// @route   POST /api/invoices
// @access  Public
const createInvoice = async (req, res) => {
    try {
        const {
            customerName,
            mobile,
            address,
            itemName,
            goldPurity,
            weight,
            goldRate,
            makingCharge,
            discount,
            goldPrice,
            finalAmount,
        } = req.body;

        // Auto generation of Invoice Number
        const lastInvoice = await Invoice.findOne().sort({ invoiceNumber: -1 });
        const newInvoiceNumber = lastInvoice && lastInvoice.invoiceNumber ? Number(lastInvoice.invoiceNumber) + 1 : 1;
        
        // Auto generation of Date
        const today = new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD'

        const invoice = await Invoice.create({
            invoiceNumber: newInvoiceNumber,
            date: today,
            customerName,
            mobile,
            address,
            itemName,
            goldPurity,
            weight,
            goldRate,
            makingCharge,
            discount,
            goldPrice,
            finalAmount,
        });

        res.status(201).json(invoice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Public
const deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        await invoice.deleteOne();
        res.status(200).json({ id: req.params.id, message: 'Invoice deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getInvoices,
    getLatestInvoice,
    getInvoice,
    createInvoice,
    deleteInvoice,
};
