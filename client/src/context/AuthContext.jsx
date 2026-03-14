import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const storedAuth = localStorage.getItem('prayosha_auth');
        if (storedAuth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const login = (username, password) => {
        // Simple hardcoded admin check as per requirements
        if (username === 'admin' && password === 'admin@123') {
            setIsAuthenticated(true);
            localStorage.setItem('prayosha_auth', 'true');
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('prayosha_auth');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
