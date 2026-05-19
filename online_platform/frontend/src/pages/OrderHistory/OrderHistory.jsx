import React, { useState } from 'react';
import { useOrders } from '../../components/Shared/OrderContext';
import { useToast } from '../../components/Shared/ToastContext';
import { Package, Truck, ChevronDown, ChevronUp, ExternalLink, HelpCircle } from 'lucide-react';
import './OrderHistory.css';

const OrderHistory = () => {
    const [expandedOrder, setExpandedOrder] = useState(null);
    const { orders } = useOrders();
    const { addToast } = useToast();

    const handleTrack = (e) => {
        e.stopPropagation();
        addToast('Tracking link sent to your email!', 'info');
    };

    const handleSupport = (e) => {
        e.stopPropagation();
        addToast('Support ticket created. We will contact you shortly.', 'success');
    };

    return (
        <div className="order-history-page py-20">
            <div className="container">
                <header className="flex items-center gap-4 mb-12">
                    <div className="icon-box bg-primary-light text-primary p-3 rounded-xl">
                        <Package size={32} />
                    </div>
                    <div>
                        <h1 className="section-title" style={{ textAlign: 'left', margin: 0 }}>My Orders</h1>
                        <p className="text-secondary">Track, manage, and review your platform purchases.</p>
                    </div>
                </header>

                <div className="orders-list grid gap-6">
                    {orders.length === 0 ? (
                        <div className="card p-20 text-center bg-main border-dashed">
                            <Package size={48} className="mx-auto mb-4 opacity-20" />
                            <h3>No orders yet</h3>
                            <p className="text-secondary mt-2">Your purchase history will appear here once you've completed a checkout.</p>
                        </div>
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className={`order-card card ${expandedOrder === order.id ? 'expanded' : ''}`}>
                                <div
                                    className="order-master-info p-6 flex items-center justify-between cursor-pointer"
                                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                >
                                    <div className="flex gap-12 items-center">
                                        <div>
                                            <span className="text-[10px] font-black text-muted block mb-1 tracking-widest uppercase">Order ID</span>
                                            <span className="font-bold text-primary">{order.id}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black text-muted block mb-1 tracking-widest uppercase">Date</span>
                                            <span className="font-semibold">{order.date}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black text-muted block mb-1 tracking-widest uppercase">Total</span>
                                            <span className="font-bold text-lg">${order.total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                        <div className="expand-icon text-muted">
                                            {expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                    </div>
                                </div>

                                {expandedOrder === order.id && (
                                    <div className="order-details-expanded p-8 bg-main">
                                        <h4 className="mb-6 flex items-center gap-2">
                                            <Truck size={18} className="text-primary" />
                                            Package Breakdown
                                        </h4>
                                        <div className="sub-orders-grid grid gap-6">
                                            {order.subOrders.map((sub, idx) => (
                                                <div key={idx} className="sub-order-card card p-6 bg-surface shadow-sm">
                                                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-main">
                                                        <div>
                                                            <span className="text-[10px] font-black text-muted block tracking-widest uppercase">Sold by</span>
                                                            <span className="font-bold text-lg">{sub.vendorName}</span>
                                                        </div>
                                                        <span className={`status-badge sm ${sub.status.toLowerCase()}`}>{sub.status}</span>
                                                    </div>
                                                    <div className="sub-order-items grid gap-3">
                                                        {sub.items.map((item, iIdx) => (
                                                            <div key={iIdx} className="flex justify-between text-sm">
                                                                <span className="text-secondary">{item.name} <span className="opacity-50">x{item.quantity}</span></span>
                                                                <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-8 pt-6 border-t border-main flex gap-3">
                                                        <button className="btn btn-primary btn-sm flex-1 justify-center gap-2" onClick={handleTrack}>
                                                            <ExternalLink size={14} /> Track Package
                                                        </button>
                                                        <button className="btn btn-outline btn-sm flex-1 justify-center gap-2" onClick={handleSupport}>
                                                            <HelpCircle size={14} /> Get Support
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;
