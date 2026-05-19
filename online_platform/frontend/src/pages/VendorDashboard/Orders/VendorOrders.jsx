import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVendors } from '../../../components/Shared/VendorContext';
import './VendorOrders.css';

const VendorOrders = () => {
    const { activeVendor } = useVendors();
    const navigate = useNavigate();

    useEffect(() => {
        if (!activeVendor) {
            navigate('/vendor-login');
        }
    }, [activeVendor, navigate]);

    const [orders, setOrders] = useState([
        { id: 'ORD-7721', customer: 'Jane Cooper', date: 'Oct 24, 2024', total: 189.00, status: 'Pending', items: 1 },
        { id: 'ORD-7722', customer: 'Wade Warren', date: 'Oct 23, 2024', total: 549.00, status: 'Shipped', items: 1 },
        { id: 'ORD-7723', customer: 'Esther Howard', date: 'Oct 22, 2024', total: 129.00, status: 'Delivered', items: 2 },
        { id: 'ORD-7724', customer: 'Cameron Williamson', date: 'Oct 21, 2024', total: 75.00, status: 'Pending', items: 1 },
        { id: 'ORD-7725', customer: 'Jenny Wilson', date: 'Oct 20, 2024', total: 189.00, status: 'Shipped', items: 1 },
    ]);

    if (!activeVendor) return null;

    const updateStatus = (id, newStatus) => {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    };

    return (
        <div className="vendor-orders">
            <div className="dashboard-header mb-8 flex justify-between items-end">
                <div>
                    <h1>Orders Management</h1>
                    <p className="text-secondary">Managing orders for: <span className="font-bold text-primary">{activeVendor.name}</span></p>
                </div>
                <div className="flex gap-3">
                    <button className="btn btn-outline">Export CVS</button>
                    <select className="btn btn-outline" style={{ paddingRight: '2rem' }}>
                        <option>All Statuses</option>
                        <option>Pending</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                    </select>
                </div>
            </div>

            <div className="card">
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td className="font-semibold text-primary">{order.id}</td>
                                <td>{order.customer}</td>
                                <td>{order.date}</td>
                                <td>{order.items}</td>
                                <td className="font-bold">${order.total.toFixed(2)}</td>
                                <td>
                                    <span className={`status-badge sm ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        {order.status === 'Pending' && (
                                            <button className="btn-action accept" onClick={() => updateStatus(order.id, 'Shipped')} title="Mark as Shipped">Ship</button>
                                        )}
                                        {order.status === 'Shipped' && (
                                            <button className="btn-action deliver" onClick={() => updateStatus(order.id, 'Delivered')} title="Mark as Delivered">Deliver</button>
                                        )}
                                        <button className="btn-action view" title="View Details">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VendorOrders;
