import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useVendors } from '../Shared/VendorContext';
import { LayoutGrid, ShoppingCart, Package, Settings, LogOut, ArrowLeft } from 'lucide-react';
import './DashboardSidebar.css';

const DashboardSidebar = () => {
    const { activeVendor, logoutVendor } = useVendors();

    return (
        <aside className="dashboard-sidebar">
            <div className="sidebar-header">
                <div className="logo-icon small">V</div>
                <span>Vendor Hub</span>
            </div>

            {activeVendor && (
                <div className="active-store-profile p-4 mb-4 mx-4">
                    <div className="flex items-center gap-3">
                        <img src={activeVendor.logo} alt="" className="w-10 h-10 rounded-lg object-cover bg-main" />
                        <div className="overflow-hidden">
                            <p className="font-bold text-sm truncate">{activeVendor.name}</p>
                            <p className="text-xs text-secondary truncate">{activeVendor.category}</p>
                        </div>
                    </div>
                </div>
            )}

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <LayoutGrid size={20} />
                    Overview
                </NavLink>
                <NavLink to="/dashboard/orders" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <ShoppingCart size={20} />
                    Orders
                </NavLink>
                <NavLink to="/dashboard/products" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <Package size={20} />
                    Products
                </NavLink>
                <NavLink to="/dashboard/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <Settings size={20} />
                    Settings
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button onClick={logoutVendor} className="nav-item w-full text-left mb-2 text-red-500 hover:bg-red-50">
                    <LogOut size={20} />
                    Logout Store
                </button>
                <Link to="/" className="back-link">
                    <ArrowLeft size={18} />
                    Back to Marketplace
                </Link>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
