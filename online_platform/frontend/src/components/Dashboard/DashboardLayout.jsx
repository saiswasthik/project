import React from 'react';
import DashboardSidebar from './DashboardSidebar';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
    return (
        <div className="dashboard-layout">
            <DashboardSidebar />
            <div className="dashboard-main">
                <header className="dashboard-topbar">
                    <div className="search-mini">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" placeholder="Search orders, products..." />
                    </div>
                    <div className="topbar-actions flex items-center gap-6">
                        <div className="notification-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        </div>
                        <div className="user-profile-mini flex items-center gap-2">
                            <div className="avatar">A</div>
                            <div className="user-info">
                                <span className="user-name">Alpha Shop</span>
                                <span className="user-role">Administrator</span>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="dashboard-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
