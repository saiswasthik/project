import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useVendors } from '../Shared/VendorContext';
import { CheckCircle2, Star, Users, ArrowUpRight } from 'lucide-react';
import './FeaturedVendors.css';

const FeaturedVendors = () => {
    const { vendors } = useVendors();

    // Filter for only approved vendors to show in the public UI
    const approvedVendors = vendors.filter(v => v.status === 'Approved');

    return (
        <section className="featured-vendors py-20">
            <div className="container">
                <motion.div
                    className="flex flex-col items-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="badge" style={{ marginBottom: '1rem' }}>Trusted Partners</span>
                    <h2 className="section-title">Verified Vendors</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'center', maxWidth: '600px' }}>
                        Join thousands of professional sellers delivering excellence across the globe.
                    </p>
                </motion.div>

                <div className="vendors-grid">
                    {approvedVendors.map((vendor, index) => (
                        <motion.div
                            key={vendor.id}
                            className="vendor-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="verified-badge">
                                <CheckCircle2 size={14} /> Verified
                            </div>
                            <div className="vendor-banner">
                                <img src={vendor.banner} alt={vendor.name} />
                            </div>
                            <div className="vendor-header">
                                <div className="vendor-logo">
                                    <img src={vendor.logo} alt={vendor.name} />
                                </div>
                                <div className="vendor-meta">
                                    <h3>{vendor.name}</h3>
                                    <span className="vendor-cat">{vendor.category}</span>
                                </div>
                            </div>
                            <div className="vendor-card-body">
                                <p className="vendor-description">
                                    {vendor.description || `${vendor.name} is a leading provider of premium ${vendor.category.toLowerCase()} products, committed to quality and customer satisfaction since 2020.`}
                                </p>
                                <div className="vendor-stats">
                                    <div className="v-stat">
                                        <span className="v-label">Rating</span>
                                        <span className="v-value">
                                            <Star size={16} fill="var(--primary)" color="var(--primary)" />
                                            {vendor.rating || '4.9'}
                                        </span>
                                    </div>
                                    <div className="v-stat">
                                        <span className="v-label">Customers</span>
                                        <span className="v-value">
                                            <Users size={16} />
                                            {vendor.sales === '0' ? 'Launching' : `${vendor.sales}k+`}
                                        </span>
                                    </div>
                                    <Link to={`/vendor/${vendor.id}`} className="btn btn-primary btn-sm" style={{ padding: '0.625rem 1.25rem' }}>
                                        Visit Store <ArrowUpRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedVendors;
