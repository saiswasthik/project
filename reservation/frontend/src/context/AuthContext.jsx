import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in (persistence)
        const savedAuth = localStorage.getItem('isLoggedIn');
        const savedUserData = localStorage.getItem('userData');

        if (savedAuth === 'true' && savedUserData) {
            setIsAuthenticated(true);
            setUser(JSON.parse(savedUserData));
        }
        setLoading(false);
    }, []);

    const login = async (restaurantName, email, password) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    restaurant_name: restaurantName,
                    email,
                    password
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const userData = {
                    id: data.id,
                    name: data.name,
                    restaurantName: data.restaurant_name,
                    email: data.email,
                    address: data.address,
                    role: 'Administrator'
                };
                setIsAuthenticated(true);
                setUser(userData);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userData', JSON.stringify(userData));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const register = async (name, restaurantName, email, address, password) => {
        try {
            const response = await fetch(`${API_URL}/resturant`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    restaurant_name: restaurantName,
                    email,
                    address,
                    password
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const userData = {
                    id: data.id,
                    name: data.name,
                    restaurantName: data.restaurant_name,
                    email: data.email,
                    address: data.address,
                    role: 'Administrator'
                };
                setIsAuthenticated(true);
                setUser(userData);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userData', JSON.stringify(userData));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userData');
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
