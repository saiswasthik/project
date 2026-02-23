import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Lock, ArrowRight, ChefHat, Sparkles, Mail, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './LoginPage.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        restaurantName: '',
        email: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const { showToast } = useToast();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // API call simulation
        await new Promise(resolve => setTimeout(resolve, 800));

        const success = await login(formData.restaurantName, formData.email, formData.password);
        if (success) {
            showToast(`Welcome back to ${formData.restaurantName}!`, 'success');
        } else {
            showToast('Invalid credentials Password', 'error');
        }

        setIsSubmitting(false);
    };

    return (
        <div className="login-page-v5">
            <div className="login-overlay"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="login-container-v5"
            >
                <div className="login-card-v5">
                    <div className="login-header-v5">
                        <motion.div
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                            className="login-logo-v5"
                        >
                            <Utensils size={32} />
                        </motion.div>
                        <h1>Banyan Kitchen</h1>
                        <p className="subtitle">Executive Administrative Login</p>
                    </div>

                    <form className="login-form-v5" onSubmit={handleSubmit}>
                        <div className="login-input-group-v5">
                            <label>Restaurant Name</label>
                            <div className="input-wrapper-v5">
                                <Building2 size={18} className="input-icon-v5" />
                                <input
                                    type="text"
                                    name="restaurantName"
                                    placeholder="e.g. Banyan Central"
                                    value={formData.restaurantName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="login-input-group-v5">
                            <label>Professional Email</label>
                            <div className="input-wrapper-v5">
                                <Mail size={18} className="input-icon-v5" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="admin@restaurant.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="login-input-group-v5">
                            <label>Password</label>
                            <div className="input-wrapper-v5">
                                <Lock size={18} className="input-icon-v5" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="login-submit-v5"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="spinner-v5"
                                />
                            ) : (
                                <>
                                    <span>Enter Dashboard</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </motion.button>

                        <div className="register-hint-v5">
                            <span>New to the network?</span>
                            <Link to="/register">Register your restaurant</Link>
                        </div>
                    </form>

                    <div className="login-footer-v5">
                        <div className="footer-tag">
                            <ChefHat size={14} />
                            <span>Staff Only Portal</span>
                        </div>
                        <p>© 2026 Banyan Kitchen Management</p>
                    </div>
                </div>

                <div className="login-decoration-v5">
                    <div className="deco-item-v5">
                        <Sparkles size={20} />
                        <div className="deco-text-v5">
                            <strong>Premium Experience</strong>
                            <span>Secure encrypted kitchen management</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Background elements for depth */}
            <div className="bg-blob-v5 v1"></div>
            <div className="bg-blob-v5 v2"></div>
            <div className="bg-blob-v5 v3"></div>
        </div>
    );
};

export default LoginPage;
