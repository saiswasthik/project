import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Lock, User, ArrowLeft, Building2, Mail, Sparkles, ChefHat } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './LoginPage.css'; // Reusing established premium styles

const RegistrationPage = () => {
    const [formData, setFormData] = useState({
        managerName: '',
        restaurantName: '',
        email: '',
        address: '',
        password: '',
        confirmPassword: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            const success = await register(
                formData.managerName,
                formData.restaurantName,
                formData.email,
                formData.address,
                formData.password
            );

            if (success) {
                showToast('Welcome to Banyan Kitchen! Restaurant registered.', 'success');
                navigate('/');
            } else {
                showToast('Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            showToast('An error occurred during registration.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-page-v5">
            <div className="login-overlay"></div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="login-container-v5"
                style={{ maxWidth: '640px' }}
            >
                <div className="login-card-v5" style={{ padding: '2.5rem' }}>
                    <div className="login-header-v5">
                        <Link to="/" className="back-link-v5">
                            <ArrowLeft size={18} />
                            <span>Back to Login</span>
                        </Link>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="login-logo-v5"
                        >
                            <Building2 size={32} />
                        </motion.div>
                        <h1>Launch Your Kitchen</h1>
                        <p className="subtitle">Join the elite network of Banyan Kitchen establishments</p>
                    </div>

                    <form className="login-form-v5 registration-grid" onSubmit={handleSubmit}>
                        <div className="login-input-group-v5">
                            <label>Manager Name</label>
                            <div className="input-wrapper-v5">
                                <User size={18} className="input-icon-v5" />
                                <input
                                    type="text"
                                    name="managerName"
                                    placeholder="Your full name"
                                    value={formData.managerName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="login-input-group-v5">
                            <label>Restaurant Name</label>
                            <div className="input-wrapper-v5">
                                <Utensils size={18} className="input-icon-v5" />
                                <input
                                    type="text"
                                    name="restaurantName"
                                    placeholder="Establishment Name"
                                    value={formData.restaurantName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="login-input-group-v5 email-field">
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

                        <div className="login-input-group-v5 address-field">
                            <label>Full Address</label>
                            <div className="input-wrapper-v5">
                                <Building2 size={18} className="input-icon-v5" />
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Street, City, ZIP"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="login-input-group-v5">
                            <label>Secure Password</label>
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

                        <div className="login-input-group-v5">
                            <label>Confirm Password</label>
                            <div className="input-wrapper-v5">
                                <Lock size={18} className="input-icon-v5" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="login-submit-v5 submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="spinner-v5"
                                />
                            ) : (
                                <span>Complete Registration</span>
                            )}
                        </motion.button>
                    </form>

                    <div className="login-footer-v5">
                        <div className="footer-tag">
                            <ChefHat size={14} />
                            <span>Executive Onboarding</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="bg-blob-v5 v1"></div>
            <div className="bg-blob-v5 v2"></div>
        </div>
    );
};

export default RegistrationPage;
