import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingCart, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useVendors } from '../Shared/VendorContext';
import './DashboardSidebar.css';

const AdminSidebar = () => {
    const { vendors } = useVendors();

    // Count pending vendor requests
    const pendingCount = vendors.filter(v => v.status === 'Pending').length;

    return (
        <aside className="dashboard-sidebar admin-sidebar">
            <div className="sidebar-header">
                <div className="logo-icon small" style={{ background: '#111827' }}>V</div>
                <span>Admin Panel</span>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/admin" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <LayoutDashboard size={20} />
                    <span>Overview</span>
                </NavLink>

                <NavLink to="/admin/vendors" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                            <Users size={20} />
                            <span>Vendors</span>
                        </div>
                        {pendingCount > 0 && (
                            <span className="notification-pill-sidebar">{pendingCount}</span>
                        )}
                    </div>
                </NavLink>

                <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <ShoppingCart size={20} />
                    <span>Platform Orders</span>
                </NavLink>

                <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <ShieldCheck size={20} />
                    <span>Security</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <Link to="/" className="back-link">
                    <ArrowLeft size={18} />
                    <span>Exit Admin</span>
                </Link>
            </div>
        </aside>
    );
};

export default AdminSidebar;
