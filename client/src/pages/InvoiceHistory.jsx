import React, { useState, useEffect } from 'react';
import { getInvoices, deleteInvoice } from '../services/api';
import generatePDF from '../utils/pdfGenerator';
import { Search, Download, Trash2, Calendar as CalendarIcon, FileText } from 'lucide-react';

const InvoiceHistory = () => {
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    useEffect(() => {
        fetchInvoices();
    }, []);

    useEffect(() => {
        filterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, dateFilter, invoices]);

    const fetchInvoices = async () => {
        try {
            const data = await getInvoices();
            setInvoices(data);
            setFilteredInvoices(data);
        } catch (error) {
            console.error('Failed to fetch invoices:', error);
            alert('Could not load invoice history.');
        } finally {
            setIsLoading(false);
        }
    };

    const filterData = () => {
        let filtered = invoices;

        if (searchTerm) {
            filtered = filtered.filter(inv => 
                inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(inv.invoiceNumber).toLowerCase().includes(searchTerm.toLowerCase()) ||
                (inv.mobile && String(inv.mobile).includes(searchTerm))
            );
        }

        if (dateFilter) {
            // Match exactly the YYYY-MM-DD string prefix
            filtered = filtered.filter(inv => inv.date.startsWith(dateFilter));
        }

        setFilteredInvoices(filtered);
    };

    const handleDelete = async (id, number) => {
        if (window.confirm(`Are you sure you want to delete Invoice ${number}?`)) {
            try {
                await deleteInvoice(id);
                setInvoices(prev => prev.filter(inv => inv._id !== id));
            } catch (error) {
                console.error('Delete failed', error);
                alert('Failed to delete invoice.');
            }
        }
    };

    const handleDownload = (invoice) => {
        generatePDF(invoice, 'download');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full bg-gray-50 flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="mr-2 text-primary" /> Invoice History
            </h1>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by customer, invoice #, mobile..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-base sm:text-sm"
                    />
                </div>
                <div className="w-full sm:w-auto relative">
                     <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                     <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-base sm:text-sm"
                     />
                </div>
                {(searchTerm || dateFilter) && (
                    <button 
                        onClick={() => { setSearchTerm(''); setDateFilter(''); }}
                        className="text-sm text-gray-500 underline py-2 sm:py-0 text-center"
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            {/* History Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col min-h-0">
                <div className="overflow-x-auto flex-1 h-[60vh]">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm shadow-gray-200/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredInvoices.length > 0 ? (
                                filteredInvoices.map((invoice) => (
                                    <tr key={invoice._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{invoice.invoiceNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(invoice.date).toLocaleDateString('en-GB')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{invoice.customerName}</div>
                                            {invoice.mobile && <div className="text-xs text-gray-500">{invoice.mobile}</div>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right text-primary">₹{Math.round(invoice.finalAmount).toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                            <div className="flex justify-center space-x-3">
                                                <button 
                                                    onClick={() => handleDownload(invoice)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                    title="Download PDF"
                                                >
                                                    <Download size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(invoice._id, invoice.invoiceNumber)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Delete Invoice"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No invoices found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="bg-gray-50 border-t border-gray-100 px-6 py-3 flex justify-between items-center text-sm text-gray-500">
                    <span>Showing {filteredInvoices.length} invoices</span>
                </div>
            </div>
        </div>
    );
};

export default InvoiceHistory;
