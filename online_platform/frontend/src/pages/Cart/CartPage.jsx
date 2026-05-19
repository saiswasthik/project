import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Store, Minus, Plus, ChevronRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../components/Shared/CartContext';
import './CartPage.css';

const CartPage = () => {
    const { cartGroups, updateQuantity, removeFromCart, calculateSubtotal } = useCart();

    const subtotal = calculateSubtotal();
    const platformFee = subtotal > 0 ? 5.00 : 0;
    const total = subtotal + platformFee;

    return (
        <motion.div
            className="cart-page py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container">
                <header className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-soft rounded-2xl text-primary">
                            <ShoppingCart size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight" style={{ margin: 0 }}>Shopping Bag</h1>
                            <p className="text-muted mt-1">Review and finalize your order from multiple vendors.</p>
                        </div>
                    </div>
                    <Link to="/" className="view-all-link">
                        Continue Shopping <ChevronRight size={20} />
                    </Link>
                </header>

                <div className="cart-layout">
                    <div className="cart-items-section">
                        <AnimatePresence mode="popLayout">
                            {cartGroups.length === 0 ? (
                                <motion.div
                                    key="empty"
                                    className="empty-cart text-center py-24 card"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <div className="empty-icon mb-6 opacity-10">
                                        <ShoppingCart size={120} style={{ margin: '0 auto' }} />
                                    </div>
                                    <h2 className="text-2xl font-bold">Your cart is empty</h2>
                                    <p className="text-secondary mt-2 mb-8">Looks like you haven't added anything to your cart yet.</p>
                                    <Link to="/" className="btn btn-primary btn-lg">Explore Marketplace</Link>
                                </motion.div>
                            ) : (
                                cartGroups.map((group) => (
                                    <motion.div
                                        key={group.vendorName}
                                        className="vendor-cart-group"
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                    >
                                        <div className="vendor-header-bar">
                                            <Store size={18} className="text-primary" />
                                            <h3>{group.vendorName}</h3>
                                            <span className="badge ml-2" style={{ fontSize: '0.65rem' }}>{group.items.length} items</span>
                                        </div>
                                        <div className="cart-items">
                                            {group.items.map((item) => (
                                                <motion.div
                                                    key={item.id}
                                                    className="cart-item"
                                                    layout
                                                    exit={{ opacity: 0, x: -50 }}
                                                >
                                                    <div className="item-img">
                                                        <img src={item.image} alt={item.name} />
                                                    </div>
                                                    <div className="item-details flex-1">
                                                        <h4>{item.name}</h4>
                                                        <span className="item-price">${item.price.toFixed(2)}</span>
                                                    </div>
                                                    <div className="item-controls flex items-center gap-8">
                                                        <div className="quantity-toggle">
                                                            <button onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity"><Minus size={16} /></button>
                                                            <span>{item.quantity}</span>
                                                            <button onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity"><Plus size={16} /></button>
                                                        </div>
                                                        <div className="item-total-price">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </div>
                                                        <button className="remove-btn p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors" onClick={() => removeFromCart(item.id)}>
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="cart-summary-section">
                        <motion.div
                            className="summary-card"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h3>Order Summary</h3>
                            <div className="space-y-4">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Platform Fees</span>
                                    <span>${platformFee.toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping Estimate</span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                                <div className="summary-divider"></div>
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span className="text-primary">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <Link to="/checkout" className={`btn btn-checkout ${cartGroups.length === 0 ? 'disabled' : ''}`}>
                                Proceed to Checkout
                            </Link>

                            <div className="mt-8 pt-8 border-t flex flex-col items-center gap-4">
                                <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                                    <ShieldCheck size={18} /> Secure Transaction
                                </div>
                                <p className="text-center text-xs text-muted leading-relaxed">
                                    By proceeding to payment, you agree to our terms of service and privacy policy.
                                    Your data is encrypted and protected.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CartPage;
