import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import '../styles/index.css';

const Login = () => {
    const [email, setEmail] = useState('demo@claimsure.ai');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Invalid login credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Left Side: Information Panel */}
            <div className="login-info-panel">
                <div className="login-info-content">
                    {/* Brand Heading */}
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
                        Streamline Your <br />
                        Claims Processing
                    </h1>

                    <p className="login-subheadline">
                        Leverage AI-assisted validation to reduce processing time by 60% while maintaining regulatory compliance.
                    </p>

                    <ul className="login-features">
                        {[
                            "AI-Powered Claim Validation",
                            "Real-time Document Processing",
                            "HIPAA Compliant Security",
                            "Automated Fraud Detection"
                        ].map((feature, idx) => (
                            <li key={idx} className="login-feature-item">
                                <CheckCircle2 size={20} className="login-feature-icon" strokeWidth={1.5} />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="login-trusted">
                        <p>Trusted by 500+ insurance providers worldwide</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Panel */}
            <div className="login-form-panel">
                <div className="login-form-wrapper">
                    {/* Login Card */}
                    <div className="login-card">
                        {/* Form Header */}
                        <div className="login-lock-icon-wrapper">
                            <Lock size={28} className="login-lock-icon" />
                        </div>
                        <h2 className="login-card-title">Welcome Back</h2>
                        <p className="login-card-subtitle">Sign in to access your claims dashboard</p>

                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div className="error-message p-3 rounded mb-4" style={{ backgroundColor: '#fef2f2', color: '#dc2626', fontSize: '13px', border: '1px solid #fee2e2', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Shield size={16} />
                                    {error}
                                </div>
                            )}

                            <div className="login-input-group">
                                <label className="login-label">Email Address</label>
                                <div className="login-input-wrapper">
                                    <Mail className="login-input-icon" size={18} />
                                    <input
                                        type="email"
                                        className="login-input"
                                        placeholder="analyst@insurancecc.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                        className="login-input"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        style={{ fontFamily: 'monospace' }}
                                    />
                                </div>
                            </div>

                            <div className="login-options">
                                <label className="login-remember">
                                    <input type="checkbox" className="login-checkbox" />
                                    <span>Remember me</span>
                                </label>
                                <button type="button" className="login-forgot">Forgot password?</button>
                            </div>

                            <button
                                type="submit"
                                className="login-submit-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight size={18} strokeWidth={2.5} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="login-footer-info">
                            <p className="login-legal-text">
                                By signing in, you agree to our <button className="login-legal-btn">Terms of Service</button> and <button className="login-legal-btn">Privacy Policy</button>
                            </p>

                            <div className="login-badges">
                                <ShieldCheck size={14} style={{ opacity: 0.7 }} />
                                <span>256-bit SSL Encryption • HIPAA Compliant</span>
                            </div>
                        </div>
                    </div>

                    <div className="login-contact-text">
                        <p>
                            Don't have an account? <Link to="/signup" className="login-contact-btn">Create a new account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
