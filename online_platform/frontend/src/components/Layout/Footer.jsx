import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram, Linkedin, Mail, Send, ExternalLink } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link to="/" className="logo flex items-center gap-2 mb-6">
                            <div className="logo-icon">V</div>
                            <span className="logo-text">Ventra</span>
                        </Link>
                        <p className="footer-desc">
                            Building the next generation of commerce. Empowering vendors to reach global audiences with enterprise-grade infrastructure.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-icon" aria-label="Twitter"><Twitter size={20} /></a>
                            <a href="#" className="social-icon" aria-label="Facebook"><Facebook size={20} /></a>
                            <a href="#" className="social-icon" aria-label="Instagram"><Instagram size={20} /></a>
                            <a href="#" className="social-icon" aria-label="LinkedIn"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <h4>Platform</h4>
                        <ul>
                            <li><a href="#">Marketplace</a></li>
                            <li><a href="#">Featured Vendors</a></li>
                            <li><a href="#">Trending Products</a></li>
                            <li><a href="#">Customer Stories</a></li>
                            <li><a href="#">Mobile App</a></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Solutions</h4>
                        <ul>
                            <li><Link to="/sell">Sell on Ventra</Link></li>
                            <li><a href="#">Vendor Portal</a></li>
                            <li><a href="#">Enterprise Solutions</a></li>
                            <li><a href="#">Logistics Partners</a></li>
                            <li><a href="#">API Documentation <ExternalLink size={12} style={{ display: 'inline', marginLeft: '4px' }} /></a></li>
                        </ul>
                    </div>

                    <div className="footer-newsletter">
                        <h4>Newsletter</h4>
                        <p className="newsletter-desc">Subscribe to get the latest updates on new vendors and exclusive drops.</p>
                        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Your email address" required />
                            <button className="btn btn-primary" style={{ padding: '0 1.25rem' }}>
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom flex items-center justify-between">
                    <p>&copy; 2024 Ventra Marketplace Inc. Designed for the future of trade.</p>
                    <div className="footer-bottom-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Cookie Settings</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
