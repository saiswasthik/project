import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '../../components/Home/Hero';
import TrendingProducts from '../../components/Home/TrendingProducts';
import FeaturedVendors from '../../components/Home/FeaturedVendors';
import './HomePage.css';

const categories = [
    'Electronics', 'Fashion', 'Home & Living', 'Audio',
    'Beauty', 'Health', 'Sports', 'Art', 'Groceries', 'Toys'
];

const HomePage = () => {
    return (
        <div className="home-page">
            <Hero />

            <section className="categories-strip">
                <div className="container">
                    <div className="cat-pills-container">
                        {categories.map((cat, index) => (
                            <Link
                                key={cat}
                                to={`/category/${cat}`}
                                className="cat-pill-link"
                            >
                                <motion.div
                                    className={`cat-pill`}
                                    whileHover={{ y: -2, backgroundColor: 'var(--primary)', color: 'white' }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {cat}
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <TrendingProducts />

            <section className="cta-banner">
                <div className="container">
                    <motion.div
                        className="cta-card"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="cta-card-content">
                            <motion.h2
                                className="cta-title"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                            >
                                Ready to scale your business?
                            </motion.h2>
                            <p className="cta-subtitle">
                                Join over 50,000 vendors selling to millions of customers worldwide.
                                Get the enterprise-grade infrastructure you deserve.
                            </p>
                            <div className="cta-actions">
                                <motion.button
                                    className="btn cta-btn-white"
                                    whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Get Started Now
                                </motion.button>
                                <motion.button
                                    className="btn cta-btn-outline"
                                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Talk to Sales
                                </motion.button>
                            </div>
                        </div>
                        <div className="cta-bg-shape"></div>
                        <div className="cta-bg-shape-2"></div>
                    </motion.div>
                </div>
            </section>

            <FeaturedVendors />
        </div>
    );
};

export default HomePage;
