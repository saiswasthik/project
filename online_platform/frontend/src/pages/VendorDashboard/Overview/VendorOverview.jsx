import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVendors } from '../../../components/Shared/VendorContext';
import './VendorOverview.css';

const VendorOverview = () => {
    const { activeVendor } = useVendors();
    const navigate = useNavigate();

    useEffect(() => {
        if (!activeVendor) {
            navigate('/vendor-login');
        }
    }, [activeVendor, navigate]);

    if (!activeVendor) return null;

    const stats = [
        { label: 'Total Revenue', value: activeVendor.revenue, icon: '💰', change: '+12.5%', isPositive: true },
        { label: 'Total Orders', value: activeVendor.orders, icon: '📦', change: '+8.2%', isPositive: true },
        { label: 'Pending Orders', value: '14', icon: '⏳', change: '-2', isPositive: false },
        { label: 'Store Rating', value: `${activeVendor.rating}/5`, icon: '⭐', change: '+0.1', isPositive: true },
    ];

    return (
        <div className="vendor-overview">
            <div className="dashboard-header mb-8">
                <h1>Dashboard Overview</h1>
                <p className="text-secondary">Welcome back, {activeVendor.name}. Here's what's happening today.</p>
            </div>

            <div className="stats-grid grid gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="stat-card card p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="stat-icon-wrapper">{stat.icon}</div>
                            <span className={`stat-change ${stat.isPositive ? 'positive' : 'negative'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <div className="stat-info">
                            <span className="stat-label block text-muted mb-1">{stat.label}</span>
                            <span className="stat-value block font-bold text-2xl">{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid grid gap-8 mt-12" style={{ gridTemplateColumns: '2fr 1fr' }}>
                <div className="recent-orders card">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="m-0">Recent Orders</h3>
                        <button className="text-primary font-semibold text-sm">View All</button>
                    </div>
                    <div className="p-0">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Status</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <tr key={i}>
                                        <td className="font-semibold">#ORD-00{i}</td>
                                        <td>Customer Name</td>
                                        <td><span className="status-badge sm delivered">Delivered</span></td>
                                        <td>$189.00</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="top-products card">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="m-0">Top Products</h3>
                    </div>
                    <div className="p-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="top-product-item flex gap-4 mb-6">
                                <div className="product-mini-img">
                                    <img src={activeVendor.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                </div>
                                <div className="flex-1">
                                    <span className="font-semibold block text-sm">Bestseller Item {i}</span>
                                    <span className="text-muted text-xs">240 Sales</span>
                                </div>
                                <span className="font-bold text-sm">$189.00</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorOverview;
