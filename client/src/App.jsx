import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';

import Dashboard from './pages/Dashboard';
import CreateInvoice from './pages/CreateInvoice';
import InvoiceHistory from './pages/InvoiceHistory';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-invoice" element={<CreateInvoice />} />
            <Route path="/history" element={<InvoiceHistory />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
