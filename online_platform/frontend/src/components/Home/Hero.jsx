import React from 'react';
import './Hero.css';
import heroBg from '../../assets/hero-bg.png';

const Hero = () => {
    return (
        <section className="hero">
            <div className="container flex items-center">
                <div className="hero-content">
                    <div className="badge">New Era of Commerce</div>
                    <h1 className="hero-title">
                        The World's Most <span className="text-gradient">Versatile</span> Marketplace.
                    </h1>
                    <p className="hero-subtitle">
                        Connect with thousands of premium vendors. Buy, sell, and scale your business with our enterprise-grade infrastructure.
                    </p>
                    <div className="hero-actions flex gap-4">
                        <button className="btn btn-primary btn-lg">Explore Marketplace</button>
                        <button className="btn btn-outline btn-lg">View Demo</button>
                    </div>
                    <div className="hero-stats flex gap-8">
                        <div className="stat-item">
                            <span className="stat-value">50k+</span>
                            <span className="stat-label">Active Vendors</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">$2B+</span>
                            <span className="stat-label">Total Volume</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">99.9%</span>
                            <span className="stat-label">Uptime</span>
                        </div>
                    </div>
                </div>
                <div className="hero-image">
                    <div className="image-wrapper">
                        <img src={heroBg} alt="Marketplace Dashboard" />
                        <div className="glass-card card-1">
                            <div className="card-dot"></div>
                            <span>Live Sales: $4,200</span>
                        </div>
                        <div className="glass-card card-2">
                            <div className="card-dot green"></div>
                            <span>New Vendor: Alpha Tech</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
