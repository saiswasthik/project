import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../components/Shared/CartContext';
import { useOrders } from '../../components/Shared/OrderContext';
import { useToast } from '../../components/Shared/ToastContext';
import { CheckCircle, CreditCard, Lock, ArrowLeft, ShieldCheck, Mail } from 'lucide-react';
import './CheckoutPage.css';

const CheckoutPage = () => {
    const { cartGroups, calculateSubtotal, cartItems, clearCart } = useCart();
    const { addOrder } = useOrders();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const subtotal = calculateSubtotal();
    const platformFee = subtotal > 0 ? 5.00 : 0;
    const total = subtotal + platformFee;

    const handlePayment = () => {
        if (cartItems.length === 0) return;

        setIsProcessing(true);

        // Simulate payment processing delay
        setTimeout(() => {
            addOrder(cartGroups, total);
            clearCart();
            setIsProcessing(false);
            setIsSuccess(true);
            addToast('Payment successful!', 'success');
        }, 2500);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1, duration: 0.6 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    if (isSuccess) {
        return (
            <div className="checkout-page py-40">
                <div className="container overflow-hidden">
                    <motion.div
                        className="success-container mx-auto max-w-2xl text-center"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", damping: 12 }}
                    >
                        <motion.div
                            className="success-icon-bg"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                        >
                            <CheckCircle size={100} className="text-white" />
                        </motion.div>

                        <motion.h1
                            className="text-5xl font-black mt-8 mb-4 tracking-tight"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Order Placed!
                        </motion.h1>

                        <motion.p
                            className="text-secondary text-xl mb-12"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Your transaction was successful. We've sent a detailed receipt to your email.
                        </motion.p>

                        <motion.div
                            className="order-receipt-card card p-10 mb-12 text-left"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-xs font-black tracking-widest text-muted uppercase">Amount Paid</span>
                                <span className="text-sm font-bold text-green-600">TRANSACTION COMPLETED</span>
                            </div>
                            <div className="text-4xl font-black text-primary mb-6">${total.toFixed(2)}</div>
                            <div className="flex items-center gap-3 text-muted text-sm border-t border-main pt-6">
                                <Mail size={16} /> Confirmation sent to user@example.com
                            </div>
                        </motion.div>

                        <motion.div
                            className="flex gap-4 justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>Continue Shopping</button>
                            <button className="btn btn-outline btn-lg" onClick={() => navigate('/orders')}>View My Orders</button>
                        </motion.div>
                    </motion.div>
                </div>
                <div className="confetti-placeholder"></div>
            </div>
        );
    }

    return (
        <div className="checkout-page py-20">
            <div className="container">
                <div className="flex items-center gap-4 mb-10">
                    <button onClick={() => navigate('/cart')} className="btn-back">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="section-title" style={{ textAlign: 'left', margin: 0 }}>Secure Checkout</h1>
                </div>

                <div className="checkout-grid flex gap-12">
                    <div className="checkout-forms" style={{ flex: 1 }}>
                        <section className="checkout-section mb-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="step-num-small">1</div>
                                <h3 style={{ margin: 0 }}>Shipping Address</h3>
                            </div>
                            <div className="address-options grid gap-4">
                                <div className="address-card card selected">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="address-tag">Home</span>
                                            <p className="mt-2 font-semibold">John Doe</p>
                                            <p className="text-secondary text-sm">123 Market St, Suite 456<br />San Francisco, CA 94103</p>
                                        </div>
                                        <div className="radio-circle"></div>
                                    </div>
                                </div>
                                <button className="btn btn-outline btn-lg w-full">+ Add New Address</button>
                            </div>
                        </section>

                        <section className="checkout-section mb-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="step-num-small">2</div>
                                <h3 style={{ margin: 0 }}>Payment Method</h3>
                            </div>
                            <div className="payment-options grid gap-4">
                                <div className="payment-card card selected">
                                    <div className="flex items-center gap-4">
                                        <div className="card-brand"><CreditCard size={20} /></div>
                                        <div>
                                            <p className="font-semibold">•••• •••• •••• 4242</p>
                                            <p className="text-secondary text-sm">Visa Card - Expires 12/26</p>
                                        </div>
                                        <div className="radio-circle ml-auto"></div>
                                    </div>
                                </div>
                                <div className="payment-card card">
                                    <div className="flex items-center gap-4">
                                        <div className="card-brand">P</div>
                                        <p className="font-semibold">john.doe@example.com</p>
                                        <div className="radio-circle ml-auto"></div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="order-summary-sidebar" style={{ width: '420px' }}>
                        <div className="summary-card card p-8">
                            <h3 className="mb-6 flex items-center gap-2">
                                <Lock size={18} className="text-muted" />
                                Order Summary
                            </h3>

                            {cartGroups.length === 0 ? (
                                <p className="text-center text-muted py-4">No items to checkout</p>
                            ) : (
                                <div className="summary-items-list max-h-60 overflow-y-auto mb-6 pr-2">
                                    {cartGroups.map(group => (
                                        <div key={group.vendorName} className="summary-group mb-6">
                                            <div className="summary-vendor-header flex items-center justify-between mb-3 border-b border-main pb-2">
                                                <h4 className="text-xs uppercase tracking-wider text-muted font-extrabold">{group.vendorName}</h4>
                                                <span className="text-xs font-bold text-primary">{group.items.length} Items</span>
                                            </div>
                                            {group.items.map(item => (
                                                <div key={item.id} className="summary-item flex justify-between text-sm mb-2">
                                                    <span className="text-secondary">{item.name} <span className="text-xs opacity-50">x{item.quantity}</span></span>
                                                    <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="summary-divider my-6" style={{ height: '1px', background: 'var(--border-color)' }}></div>

                            <div className="final-pricing grid gap-4">
                                <div className="flex justify-between">
                                    <span className="text-secondary">Subtotal</span>
                                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-secondary">Platform Fee</span>
                                    <span className="font-semibold">${platformFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-secondary">Shipping</span>
                                    <span className="text-green-600 font-bold">FREE</span>
                                </div>
                                <div className="flex justify-between total mt-4 pt-4 border-t border-main">
                                    <span className="text-lg font-bold">Total Amount</span>
                                    <span className="text-2xl font-black text-primary">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                className={`btn btn-primary btn-lg w-full mt-8 justify-center py-5 ${cartGroups.length === 0 || isProcessing ? 'disabled' : ''}`}
                                onClick={handlePayment}
                                disabled={cartItems.length === 0 || isProcessing}
                            >
                                {isProcessing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="spinner-small"></div> Processing...
                                    </div>
                                ) : (
                                    `Confirm & Pay $${total.toFixed(2)}`
                                )}
                            </button>

                            <div className="flex items-center justify-center gap-2 mt-6 opacity-40">
                                <Lock size={12} />
                                <span className="text-[10px] font-bold tracking-widest uppercase">Encrypted Connection</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
