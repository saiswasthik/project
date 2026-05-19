import React from 'react';
import AdminSidebar from './AdminSidebar';
import './DashboardLayout.css';

const AdminLayout = ({ children }) => {
    return (
        <div className="dashboard-layout admin-theme">
            <AdminSidebar />
            <div className="dashboard-main">
                <header className="dashboard-topbar">
                    <div className="search-mini">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" placeholder="Search platform data..." />
                    </div>
                    <div className="topbar-actions flex items-center gap-6">
                        <div className="platform-status flex items-center gap-2">
                            <div className="status-dot green"></div>
                            <span className="text-xs font-semibold">Nodes: Healthy</span>
                        </div>
                        <div className="user-profile-mini flex items-center gap-2">
                            <div className="avatar" style={{ background: '#111827' }}>M</div>
                            <div className="user-info">
                                <span className="user-name">Main Admin</span>
                                <span className="user-role">Superuser</span>
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

export default AdminLayout;
