import React from 'react';
import { Link } from 'react-router-dom';
import { useVendors } from '../../../components/Shared/VendorContext';
import '../../VendorDashboard/Overview/VendorOverview.css';

const AdminOverview = () => {
    const { vendors } = useVendors();
    const approvedCount = vendors.filter(v => v.status === 'Approved').length;
    const pendingCount = vendors.filter(v => v.status === 'Pending').length;

    const stats = [
        { label: 'Platform Revenue', value: '$1.2M', icon: '📈', change: '+24%', isPositive: true },
        { label: 'Total Vendors', value: 420 + approvedCount, icon: '🏪', change: approvedCount > 0 ? `+${approvedCount}` : '0', isPositive: true },
        { label: 'Pending Requests', value: pendingCount, icon: '⏳', change: 'Live', isPositive: true },
        { label: 'Daily Orders', value: '840', icon: '📦', change: '+5%', isPositive: true },
    ];

    return (
        <div className="admin-overview">
            <div className="dashboard-header mb-8">
                <h1>Platform Overview</h1>
                <p className="text-secondary">Global metrics and system performance across the marketplace.</p>
            </div>

            <div className="stats-grid grid gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="stat-card card p-6" style={{ borderLeftColor: '#111827' }}>
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

            <div className="dashboard-grid grid gap-8 mt-12" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="system-health card p-6">
                    <h3>System Health</h3>
                    <div className="health-metrics mt-6 grid gap-4">
                        <div className="health-item flex justify-between">
                            <span>API Latency</span>
                            <span className="font-semibold text-green-600">42ms</span>
                        </div>
                        <div className="health-item flex justify-between">
                            <span>Database Load</span>
                            <span className="font-semibold text-yellow-600">34%</span>
                        </div>
                        <div className="health-item flex justify-between">
                            <span>Storage Usage</span>
                            <span className="font-semibold">62.4 TB</span>
                        </div>
                    </div>
                </div>
                <div className="quick-actions card p-6">
                    <h3>Administrative Actions</h3>
                    <div className="grid gap-4 mt-6">
                        <Link to="/admin/vendors" className="btn btn-primary justify-center">Review Vendor Requests</Link>
                        <button className="btn btn-outline justify-center">Generate Financial Report</button>
                        <button className="btn btn-outline justify-center">Platform Security Audit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
