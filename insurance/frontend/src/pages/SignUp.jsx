import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, Loader2, CheckCircle2, User, Building } from 'lucide-react';
import '../styles/index.css';

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        company: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Left Side: Information Panel */}
            <div className="login-info-panel">
                <div className="login-info-content">
                    <div className="login-brand">
                        <div className="login-brand-icon">
                            <Shield size={28} className="text-white" />
                        </div>
                        <div>
                            <div className="login-brand-text">ClaimSure AI</div>
                            <div className="login-brand-sub">Insurance Intelligence Platform</div>
                        </div>
                    </div>

                    <h1 className="login-headline">
                        Start Validating <br />
                        with Confidence
                    </h1>

                    <p className="login-subheadline">
                        Join 500+ insurance providers and reduce your processing operational costs with our state-of-the-art AI validation engine.
                    </p>

                    <ul className="login-features">
                        {[
                            "Instant Account Setup",
                            "Team Collaboration Features",
                            "Developer API Access",
                            "24/7 Enterprise Support"
                        ].map((feature, idx) => (
                            <li key={idx} className="login-feature-item">
                                <CheckCircle2 size={20} className="login-feature-icon" strokeWidth={1.5} />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="login-trusted">
                        <p>Enterprise Grade Security • HIPAA Compliant</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Signup Panel */}
            <div className="login-form-panel">
                <div className="login-form-wrapper">
                    <div className="login-card">
                        <div className="login-lock-icon-wrapper">
                            <User size={28} className="login-lock-icon" />
                        </div>
                        <h2 className="login-card-title">Create Account</h2>
                        <p className="login-card-subtitle">Get started with your free analyst trial</p>

                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div className="error-message p-3 rounded mb-4" style={{ backgroundColor: '#fef2f2', color: '#dc2626', fontSize: '13px', border: '1px solid #fee2e2', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Shield size={16} />
                                    {error}
                                </div>
                            )}

                            <div className="login-input-group">
                                <label className="login-label">Full Name</label>
                                <div className="login-input-wrapper">
                                    <User className="login-input-icon" size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        className="login-input"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="login-input-group">
                                <label className="login-label">Work Email</label>
                                <div className="login-input-wrapper">
                                    <Mail className="login-input-icon" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        className="login-input"
                                        placeholder="analyst@company.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="login-input-group">
                                <label className="login-label">Company Name</label>
                                <div className="login-input-wrapper">
                                    <Building className="login-input-icon" size={18} />
                                    <input
                                        type="text"
                                        name="company"
                                        className="login-input"
                                        placeholder="Acme Insurance"
                                        value={formData.company}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="login-input-group">
                                <label className="login-label">Password</label>
                                <div className="login-input-wrapper">
                                    <Lock className="login-input-icon" size={18} />
                                    <input
                                        type="password"
                                        name="password"
                                        className="login-input"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="login-submit-btn"
                                disabled={isLoading}
                                style={{ marginTop: '1rem' }}
                            >
                                {isLoading ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <ArrowRight size={18} strokeWidth={2.5} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="login-footer-info">
                            <p className="login-legal-text" style={{ fontSize: '11px' }}>
                                Account creation subject to <button className="login-legal-btn">Terms of Service</button>. Role assigned as 'Claims Analyst' by default for trial.
                            </p>
                        </div>
                    </div>

                    <div className="login-contact-text">
                        <p>
                            Already have an account? <Link to="/login" className="login-contact-btn">Sign in here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
