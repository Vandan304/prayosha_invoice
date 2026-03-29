import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, FileText, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { getInvoices } from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        todayCount: 0,
        monthCount: 0,
        monthlyIncome: 0,
        totalInvoices: 0,
    });
    const [recentInvoices, setRecentInvoices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        try {
            const data = await getInvoices();
            
            // Calculate stats
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

            let todayCount = 0;
            let monthCount = 0;
            let monthlyIncome = 0;

            data.forEach(inv => {
                const invDate = new Date(inv.date);
                if (invDate >= today) todayCount++;
                if (invDate >= firstDayOfMonth) {
                    monthCount++;
                    monthlyIncome += (inv.finalAmount || 0);
                }
            });

            setStats({
                todayCount,
                monthCount,
                monthlyIncome,
                totalInvoices: data.length
            });

            // Get top 5 recent
            setRecentInvoices(data.slice(0, 5));
        } catch (err) {
            setError('Failed to load dashboard data. Ensure backend is running.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2 border-gray-200">Dashboard Overview</h1>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded flex items-center">
                    <AlertCircle className="text-red-500 mr-2" />
                    <span className="text-red-700">{error}</span>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
                    <div className="p-4 bg-blue-50 rounded-lg mr-4">
                        <TrendingUp className="text-blue-600" size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase">Invoices Today</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.todayCount}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
                    <div className="p-4 bg-green-50 rounded-lg mr-4">
                        <Calendar className="text-green-600" size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase">Invoices This Month</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.monthCount}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
                    <div className="p-4 bg-purple-50 rounded-lg mr-4">
                        <FileText className="text-purple-600" size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase">Total Invoices</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalInvoices}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
                    <div className="p-4 bg-yellow-50 rounded-lg mr-4">
                        <TrendingUp className="text-yellow-600" size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase">Monthly Income</p>
                        <p className="text-3xl font-bold text-gray-900">₹{Math.round(stats.monthlyIncome).toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                 <Link to="/create-invoice" className="flex items-center justify-center space-x-2 bg-primary text-secondary px-6 py-4 rounded-xl shadow-sm font-semibold hover:bg-yellow-500 transition-colors text-lg">
                    <PlusCircle size={24} />
                    <span>Create New Invoice</span>
                 </Link>
                 <Link to="/history" className="flex items-center justify-center space-x-2 bg-white text-gray-700 border-2 border-gray-200 px-6 py-4 rounded-xl shadow-sm font-semibold hover:bg-gray-50 transition-colors text-lg">
                    <FileText size={24} />
                    <span>View All Invoices</span>
                 </Link>
            </div>

            {/* Recent Invoices List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Invoices</h2>
                    <Link to="/history" className="text-sm text-primary font-medium hover:underline">View All</Link>
                </div>
                {recentInvoices.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {recentInvoices.map((invoice) => (
                                    <tr key={invoice._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.invoiceNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{invoice.customerName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(invoice.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">₹{invoice.finalAmount?.toLocaleString('en-IN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        <p>No invoices found. Create your first invoice!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
