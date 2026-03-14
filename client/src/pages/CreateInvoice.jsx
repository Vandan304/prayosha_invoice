import React, { useState, useEffect, useRef } from 'react';
import { Save, Printer, RefreshCw, Download, FileText } from 'lucide-react';
import { createInvoice, getLatestInvoiceContext, getTodayGoldRate, saveTodayGoldRate } from '../services/api';
import generatePDF from '../utils/pdfGenerator';
import { useNavigate } from 'react-router-dom';

const CreateInvoice = () => {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [showGoldRateModal, setShowGoldRateModal] = useState(false);
    const [dailyGoldRate, setDailyGoldRate] = useState('');
    const [nextInvoiceNumber, setNextInvoiceNumber] = useState(1);
    
    const [formData, setFormData] = useState({
        customerName: '',
        mobile: '',
        address: '',
        itemName: '',
        goldPurity: '22k',
        weight: '',
        makingCharge: '',
        discount: '',
    });

    const [calculations, setCalculations] = useState({
        goldPrice: 0,
        finalAmount: 0
    });

    const inputs = useRef([]);

    useEffect(() => {
        const initData = async () => {
            try {
                // Fetch latest invoice number
                const invoiceRes = await getLatestInvoiceContext();
                if (invoiceRes && invoiceRes.nextInvoiceNumber) {
                    setNextInvoiceNumber(invoiceRes.nextInvoiceNumber);
                }

                // Check today's gold rate
                const rateRes = await getTodayGoldRate();
                if (rateRes && rateRes.goldRate) {
                    setDailyGoldRate(rateRes.goldRate);
                } else {
                    setShowGoldRateModal(true);
                }
            } catch (err) {
                console.error("Error initializing invoice data:", err);
            }
        };
        initData();
    }, []);

    useEffect(() => {
        calculateTotals(formData, dailyGoldRate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.weight, formData.makingCharge, formData.discount, dailyGoldRate]);

    const calculateTotals = (data, rate) => {
        const weight = parseFloat(data.weight) || 0;
        const currentRate = parseFloat(rate) || 0;
        const making = parseFloat(data.makingCharge) || 0;
        const discount = parseFloat(data.discount) || 0;

        // Formula based on user prompt logic & typical 10g Indian calculation
        // Assuming rate is per 10g. Formula: GoldPrice = (Weight * Rate * 96) / 1000
        // (which matches the requested format adjusting for weight)
        let goldPrice = (weight * currentRate * 96) / 1000;
        
        // If the user meant rate is per gram: goldPrice = weight * (currentRate * 96 / 100)
        // I'll compute it as: (weight * currentRate * 9.6) / 100 -> equivalent
        
        let finalAmount = goldPrice + making;
        if (discount > 0) {
            finalAmount -= discount;
        }

        setCalculations({ goldPrice, finalAmount });
    };

    const handleGoldRateSubmit = async (e) => {
        e.preventDefault();
        const inputRate = e.target.goldRateInput.value;
        if (inputRate && parseFloat(inputRate) > 0) {
            try {
                const res = await saveTodayGoldRate(parseFloat(inputRate));
                setDailyGoldRate(res.goldRate);
                setShowGoldRateModal(false);
            } catch (err) {
                alert("Failed to save gold rate.");
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const nextInput = inputs.current[index + 1];
            if (nextInput) {
                nextInput.focus();
            }
        }
    };

    const validateForm = () => {
        if (!formData.customerName || !formData.itemName || !formData.weight) {
            alert('Please fill all required fields (Name, Item, Weight)');
            return false;
        }
        if (!dailyGoldRate) {
            alert('Daily Gold Rate is missing. Please refresh and enter the rate.');
            return false;
        }
        return true;
    };

    const handleGeneratePDF = (e, action = 'download') => {
        e.preventDefault();
        if (!validateForm()) return;

        const invoiceData = { 
            ...formData, 
            ...calculations,
            invoiceNumber: nextInvoiceNumber,
            date: new Date().toISOString().split('T')[0],
            goldRate: dailyGoldRate 
        };
        
        generatePDF(invoiceData, action);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSaving(true);
        try {
            const finalData = { 
                ...formData, 
                ...calculations,
                goldRate: dailyGoldRate 
            };
            const response = await createInvoice(finalData);
            
            // Advance to next invoice ID
            setNextInvoiceNumber(prev => prev + 1);
            
            alert('Invoice saved successfully to database!');
            // Optional: navigate to history
            // navigate('/history');
            
            // Clear form
            setFormData({
                customerName: '',
                mobile: '',
                address: '',
                itemName: '',
                goldPurity: '22k',
                weight: '',
                makingCharge: '',
                discount: '',
            });
            inputs.current[0]?.focus();
        } catch (error) {
            console.error('Save failed', error);
            alert('Failed to save invoice. ' + (error.response?.data?.message || ''));
        } finally {
            setIsSaving(false);
        }
    };

    const inputClasses = "mt-1 block w-full px-4 py-3 sm:py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary shadow-sm text-base sm:text-sm";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen pb-32 sm:pb-8 relative">
            {/* Gold Rate Modal overlay */}
            {showGoldRateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Set Today's Gold Rate</h2>
                        <form onSubmit={handleGoldRateSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gold Rate (₹ per 10g)</label>
                                <input 
                                    type="number" 
                                    name="goldRateInput"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-lg" 
                                    placeholder="e.g. 70000"
                                    required 
                                    autoFocus
                                    inputMode="numeric"
                                />
                            </div>
                            <button type="submit" className="w-full bg-primary text-secondary font-bold py-3 rounded-lg text-lg">
                                Save Rate
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <FileText className="mr-2 text-primary" /> Create New Invoice
                </h1>
                {dailyGoldRate && (
                    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-mono font-semibold shadow-sm border border-yellow-200">
                        Rate: ₹{dailyGoldRate}/10g
                    </div>
                )}
            </div>

            <form className="space-y-6">
                {/* --- Section 1: Customer Info --- */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative">
                     <div className="absolute top-4 right-4 bg-gray-100 px-3 py-1 rounded text-sm font-semibold text-gray-500">
                         Invoice #{nextInvoiceNumber}
                     </div>
                     <h2 className="text-sm uppercase tracking-wider font-semibold text-gray-500 mb-4 border-b pb-2">Customer Details</h2>
                     <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className={labelClasses}>Customer Name *</label>
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                onKeyDown={(e) => handleKeyDown(e, 0)}
                                ref={el => inputs.current[0] = el}
                                className={inputClasses}
                                placeholder="Enter full name"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>Mobile Number</label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    onKeyDown={(e) => handleKeyDown(e, 1)}
                                    ref={el => inputs.current[1] = el}
                                    className={inputClasses}
                                    placeholder="Enter 10-digit number"
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Village / Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    onKeyDown={(e) => handleKeyDown(e, 2)}
                                    ref={el => inputs.current[2] = el}
                                    className={inputClasses}
                                    placeholder="City or village"
                                />
                            </div>
                        </div>
                     </div>
                </div>

                {/* --- Section 2: Jewellery Array/Details --- */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-primary">
                     <h2 className="text-sm uppercase tracking-wider font-semibold text-gray-500 mb-4 border-b pb-2">Jewellery Info</h2>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className={labelClasses}>Item Name *</label>
                            <input
                                type="text"
                                name="itemName"
                                value={formData.itemName}
                                onChange={handleChange}
                                onKeyDown={(e) => handleKeyDown(e, 3)}
                                ref={el => inputs.current[3] = el}
                                className={inputClasses}
                                placeholder="e.g. Gold Chain, Ring"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className={labelClasses}>Purity</label>
                            <select
                                name="goldPurity"
                                value={formData.goldPurity}
                                onChange={handleChange}
                                onKeyDown={(e) => handleKeyDown(e, 4)}
                                ref={el => inputs.current[4] = el}
                                className={inputClasses}
                            >
                                <option value="22k">22K</option>
                                <option value="24k">24K</option>
                                <option value="18k">18K</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className={labelClasses}>Weight (grams) *</label>
                            <input
                                type="number"
                                name="weight"
                                step="0.001"
                                value={formData.weight}
                                onChange={handleChange}
                                onKeyDown={(e) => handleKeyDown(e, 5)}
                                ref={el => inputs.current[5] = el}
                                className={inputClasses}
                                placeholder="e.g. 10.500"
                                required
                                inputMode="decimal"
                            />
                        </div>

                        <div>
                            <label className={labelClasses}>Making Charge</label>
                            <input
                                type="number"
                                name="makingCharge"
                                value={formData.makingCharge}
                                onChange={handleChange}
                                onKeyDown={(e) => handleKeyDown(e, 6)}
                                ref={el => inputs.current[6] = el}
                                className={inputClasses}
                                placeholder="Total making charge"
                                inputMode="numeric"
                            />
                        </div>
                        
                        <div>
                            <label className={labelClasses}>Discount (Optional)</label>
                            <input
                                type="number"
                                name="discount"
                                value={formData.discount}
                                onChange={handleChange}
                                className={inputClasses}
                                placeholder="Discount amount"
                                inputMode="numeric"
                            />
                        </div>
                     </div>
                </div>

                {/* --- Section 3: Live Calculation --- */}
                <div className="bg-primary/5 p-6 rounded-xl border-2 border-primary/20 shadow-inner mt-6">
                    <div className="space-y-3">
                        <div className="flex justify-between text-gray-600 text-lg">
                            <span>Gold Price:</span>
                            <span className="font-mono text-gray-900 font-medium">₹ {(calculations.goldPrice).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 text-lg border-b border-primary/20 pb-3">
                            <span>Making Charge:</span>
                            <span className="font-mono text-gray-900 font-medium">+ ₹ {(parseFloat(formData.makingCharge)||0).toLocaleString('en-IN')}</span>
                        </div>
                        {formData.discount && parseFloat(formData.discount) > 0 && (
                            <div className="flex justify-between text-gray-600 text-lg transition-all">
                                <span>Discount:</span>
                                <span className="font-mono text-red-500 font-medium">- ₹ {(parseFloat(formData.discount)).toLocaleString('en-IN')}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center text-primary text-2xl font-bold pt-3 bg-white p-4 rounded-lg shadow-sm border border-primary/10 mt-2">
                            <span>Final Amount:</span>
                            <span className="font-mono">₹ {Math.round(calculations.finalAmount).toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>

                {/* --- Action Buttons (Desktop and inline Mobile) --- */}
                <div className="hidden sm:flex gap-4 pt-6 justify-end border-t border-gray-200">
                    <button type="button" onClick={() => setFormData({customerName: '', mobile: '', address: '', itemName: '', goldPurity: '22k', weight: '', makingCharge: '', discount: ''})} className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 flex items-center">
                        <RefreshCw size={18} className="mr-2" /> Clear
                    </button>
                    <button type="button" onClick={handleSave} disabled={isSaving} className="px-6 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 flex items-center shadow-md">
                        <Save size={18} className="mr-2" /> {isSaving ? 'Saving...' : 'Save Data'}
                    </button>
                    <button type="button" onClick={(e) => handleGeneratePDF(e, 'print')} className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center shadow-md">
                        <Printer size={18} className="mr-2" /> Print PDF
                    </button>
                    <button type="button" onClick={(e) => handleGeneratePDF(e, 'download')} className="px-6 py-3 rounded-lg bg-primary text-secondary font-bold hover:bg-yellow-500 flex items-center shadow-md">
                        <Download size={18} className="mr-2" /> Download
                    </button>
                </div>

                {/* --- Sticky Action Buttons (Mobile) --- */}
                <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-8px_15px_-3px_rgba(0,0,0,0.1)] p-3 z-40 grid grid-cols-2 gap-2 pb-5">
                    <button type="button" onClick={(e) => handleGeneratePDF(e, 'print')} className="py-3 rounded-lg bg-blue-600 text-white font-medium flex justify-center items-center shadow-sm">
                        <Printer size={18} className="mr-1" /> Print
                    </button>
                    <button type="button" onClick={(e) => handleGeneratePDF(e, 'download')} className="py-3 rounded-lg bg-primary text-secondary font-bold flex justify-center items-center shadow-sm">
                        <Download size={18} className="mr-1" /> PDF
                    </button>
                    <button type="button" onClick={handleSave} disabled={isSaving} className="col-span-2 py-3 mt-1 rounded-lg border-2 border-green-600 bg-green-50 text-green-700 font-bold hover:bg-green-100 flex justify-center items-center">
                        <Save size={18} className="mr-2" /> {isSaving ? 'Saving...' : 'Save to DB'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateInvoice;
