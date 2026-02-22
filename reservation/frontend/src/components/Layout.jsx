import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Utensils, Calendar, Plus, Table2, Settings as SettingsIcon, Moon, Sun, LogOut, ChevronDown, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
    const { theme, toggleTheme } = useTheme();
    const { logout, user } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsProfileOpen(false);
        logout();
    };

    return (
        <div className="app-container-vertical">
            <nav className="top-nav">
                <div className="nav-left">
                    <div className="logo">
                        <Utensils size={24} className="logo-icon" />
                        <span className="logo-text">Banyan Kitchen</span>
                    </div>
                    <div className="nav-links">
                        <NavLink to="/reservations" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <Calendar size={18} />
                            <span>Reservations</span>
                        </NavLink>
                        <NavLink to="/new-reservation" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <Plus size={18} />
                            <span>New Reservation</span>
                        </NavLink>
                        <NavLink to="/tables" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <Table2 size={18} />
                            <span>Tables</span>
                        </NavLink>
                        <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <SettingsIcon size={18} />
                            <span>Settings</span>
                        </NavLink>
                    </div>
                </div>
                <div className="nav-right">
                    <button className="theme-toggle" onClick={toggleTheme}>
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>
                    <div className="user-profile-container" ref={dropdownRef}>
                        <div className="user-profile" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                            <div className="avatar">
                                {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'SM'}
                            </div>
                            <div className="user-info">
                                <span className="user-name">{user?.restaurantName || 'Staff Member'}</span>
                                <ChevronDown size={14} className={`chevron ${isProfileOpen ? 'rotate' : ''}`} />
                            </div>
                        </div>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="profile-dropdown"
                                >
                                    <div className="dropdown-header">
                                        <div className="large-avatar">
                                            {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'SM'}
                                        </div>
                                        <div className="header-details">
                                            <span className="name">{user?.name || user?.restaurantName}</span>
                                            <span className="role">{user?.restaurantName}</span>
                                            <span className="email-hint">{user?.email}</span>
                                        </div>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    {/* <button className="dropdown-item">
                                        <User size={16} />
                                        <span>My Profile</span>
                                    </button> */}
                                    <button className="dropdown-item logout" onClick={handleLogout}>
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </nav>
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
