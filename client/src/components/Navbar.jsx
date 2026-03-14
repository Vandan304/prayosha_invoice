import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, FileText, PlusCircle, LayoutDashboard } from 'lucide-react';
import psm from '../assets/images/psm.png';
import msm from '../assets/images/msm.png';
import apm from '../assets/images/apm.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
        { name: 'Create Invoice', path: '/create-invoice', icon: <PlusCircle size={18} /> },
        { name: 'Invoice History', path: '/history', icon: <FileText size={18} /> },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-primary text-secondary shadow-md sticky top-0 z-50 no-print">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left: Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="font-bold text-xl tracking-wider text-secondary">
                                PRAYOSHA<br/><span className="text-sm font-medium">JEWELLERS</span>
                            </span>
                        </Link>
                    </div>

                    {/* Center: Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isActive(link.path)
                                        ? 'bg-secondary text-primary'
                                        : 'hover:bg-secondary/10'
                                }`}
                            >
                                {link.icon}
                                <span>{link.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Right: Spiritual Images & Logout (Desktop) */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="flex space-x-2">
                            <div className="flex space-x-[10px]">
                            <img src={psm} alt="Pramukh Swami Maharaj" className="navbar-avatar border border-primary/20 shadow-sm" />
                            <img src={msm} alt="Mahant Swami Maharaj" className="navbar-avatar border border-primary/20 shadow-sm" />
                            <img src={apm} alt="Akshar Purushottam Maharaj" className="navbar-avatar border border-primary/20 shadow-sm" />
                        </div>
                    </div>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md hover:bg-secondary/10 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white text-gray-800 shadow-xl border-b-2 border-primary absolute w-full left-0 z-40">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {/* Spiritual Images in Mobile */}
                        <div className="flex justify-center space-x-[10px] py-3 border-b border-gray-100">
                             <img src={psm} alt="Pramukh Swami Maharaj" className="navbar-avatar border border-primary/20 shadow-sm" />
                             <img src={msm} alt="Mahant Swami Maharaj" className="navbar-avatar border border-primary/20 shadow-sm" />
                             <img src={apm} alt="Akshar Purushottam Maharaj" className="navbar-avatar border border-primary/20 shadow-sm" />
                        </div>

                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center space-x-3 block px-3 py-3 rounded-md text-base font-medium ${
                                    isActive(link.path)
                                        ? 'bg-primary/10 text-primary border-l-4 border-primary'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {link.icon}
                                <span>{link.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
