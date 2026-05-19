import React, { useState } from 'react';
import '../../OrderHistory/OrderHistory.css';
import '../../VendorDashboard/Orders/VendorOrders.css';

const AdminOrderMonitoring = () => {
    const [expandedOrder, setExpandedOrder] = useState(null);

    const orders = [
        {
            id: "ORD-92834",
            customer: "John Doe",
            date: "Oct 24, 2024",
            total: 833.00,
            status: "Processing",
            subOrders: [
                { vendor: "Alpha Electronics", status: "Shipped", amount: 738.00 },
                { vendor: "PureDesign", status: "Pending", amount: 45.00 }
            ]
        },
        {
            id: "ORD-92711",
            customer: "Jane Smith",
            date: "Oct 22, 2024",
            total: 125.00,
            status: "Completed",
            subOrders: [
                { vendor: "WoodWorks", status: "Delivered", amount: 125.00 }
            ]
        }
    ];

    return (
        <div className="admin-orders">
            <div className="dashboard-header mb-8">
                <h1>Platform Order Monitor</h1>
                <p className="text-secondary">Track every transaction and sub-order status across the ecosystem.</p>
            </div>

            <div className="card overflow-hidden">
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Grand Total</th>
                            <th>Overall Status</th>
                            <th>Vendors</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <React.Fragment key={order.id}>
                                <tr className={expandedOrder === order.id ? 'active-row' : ''}>
                                    <td className="font-semibold">{order.id}</td>
                                    <td>{order.customer}</td>
                                    <td>{order.date}</td>
                                    <td className="font-bold">${order.total.toFixed(2)}</td>
                                    <td><span className={`status-badge sm ${order.status.toLowerCase()}`}>{order.status}</span></td>
                                    <td>{order.subOrders.length} Sellers</td>
                                    <td>
                                        <button
                                            className="btn btn-outline btn-sm"
                                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                        >
                                            {expandedOrder === order.id ? 'Hide Details' : 'Monitor Details'}
                                        </button>
                                    </td>
                                </tr>
                                {expandedOrder === order.id && (
                                    <tr>
                                        <td colSpan="7" className="p-0">
                                            <div className="expanded-admin-order p-8 bg-main">
                                                <h4 className="mb-4">Sub-Order Details</h4>
                                                <div className="sub-order-grid grid gap-4">
                                                    {order.subOrders.map((sub, idx) => (
                                                        <div key={idx} className="sub-order-ticket card p-4 flex justify-between items-center bg-surface">
                                                            <div className="flex gap-8">
                                                                <div>
                                                                    <span className="text-xs text-muted block">VENDOR</span>
                                                                    <span className="font-semibold">{sub.vendor}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs text-muted block">AMOUNT</span>
                                                                    <span className="font-semibold">${sub.amount.toFixed(2)}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <span className={`status-badge sm ${sub.status.toLowerCase()}`}>{sub.status}</span>
                                                                <button className="text-primary text-xs font-semibold">Contact Seller</button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrderMonitoring;
