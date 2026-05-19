import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useVendors } from '../../components/Shared/VendorContext';
import { useProducts } from '../../components/Shared/ProductContext';
import ProductCard from '../../components/Shared/ProductCard';
import { Star, ShoppingBag, Info, MessageCircle, Heart, Search, Filter } from 'lucide-react';
import './VendorStore.css';

const VendorStore = () => {
    const { id } = useParams();
    const { vendors } = useVendors();
    const { getProductsByVendor } = useProducts();
    const [activeTab, setActiveTab] = useState('products');
    const [searchQuery, setSearchQuery] = useState('');

    // Find the current vendor from global state
    const vendor = vendors.find(v => v.id === id || v.id === String(id));

    // Handle case where vendor isn't found
    if (!vendor) {
        return (
            <motion.div
                className="container py-40 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <h2 className="text-4xl font-bold mb-4">Store Not Found</h2>
                <p className="text-secondary mb-8">The vendor store you are looking for does not exist or has been removed.</p>
                <Link to="/" className="btn btn-primary">Back to Marketplace</Link>
            </motion.div>
        );
    }

    // Get products for this specific vendor
    const allStoreProducts = getProductsByVendor(vendor.id);

    // Filter by search query
    const storeProducts = allStoreProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div
            className="vendor-store"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="store-banner">
                <motion.img
                    src={vendor.banner}
                    alt={vendor.name}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                />
                <div className="banner-overlay"></div>
            </div>

            <div className="container">
                <motion.div
                    className="store-header-card"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] }}
                >
                    <div className="flex items-start gap-8 flex-wrap">
                        <motion.div
                            className="store-logo-large"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <img src={vendor.logo} alt={vendor.name} />
                        </motion.div>

                        <div className="store-title-info">
                            <h1 className="text-gradient">{vendor.name}</h1>
                            <div className="store-meta-items">
                                <div className="meta-item">
                                    <span className="badge">{vendor.category}</span>
                                </div>
                                <div className="divider"></div>
                                <div className="meta-item">
                                    <Star size={18} fill="currentColor" />
                                    <span>{vendor.rating || '4.9'} (1.2k+ reviews)</span>
                                </div>
                                <div className="divider"></div>
                                <div className="meta-item">
                                    <ShoppingBag size={18} />
                                    <span>{vendor.sales === '0' ? 'Launching' : `${vendor.sales}k+`} Sales</span>
                                </div>
                            </div>
                        </div>

                        <div className="store-actions flex gap-4 ml-auto self-center">
                            <button className="btn btn-outline" style={{ gap: '0.5rem' }}>
                                <Heart size={18} /> Favorite
                            </button>
                            <button className="btn btn-primary" style={{ gap: '0.5rem' }}>
                                <MessageCircle size={18} /> Message Store
                            </button>
                        </div>
                    </div>

                    <div className="store-description mt-8">
                        <p>{vendor.description || `Welcome to ${vendor.name}! We specialize in premium ${vendor.category.toLowerCase()} products designed for the contemporary lifestyle. Every item is handpicked to ensure the highest standards of quality and design.`}</p>
                    </div>

                    <div className="store-tabs">
                        <div
                            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
                            onClick={() => setActiveTab('products')}
                        >
                            Products
                        </div>
                        <div
                            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
                            onClick={() => setActiveTab('about')}
                        >
                            About & Reviews
                        </div>
                    </div>
                </motion.div>

                <div className="store-grid-container">
                    <AnimatePresence mode="wait">
                        {activeTab === 'products' ? (
                            <motion.div
                                key="products"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="store-content-header">
                                    <h2 className="section-title" style={{ fontSize: '1.75rem' }}>
                                        Collections <span className="text-muted text-lg font-normal">({storeProducts.length})</span>
                                    </h2>
                                    <div className="flex gap-3">
                                        <div className="search-bar" style={{ margin: 0, maxWidth: '250px' }}>
                                            <Search className="search-icon-fixed" size={16} />
                                            <input
                                                type="text"
                                                placeholder="Search in store..."
                                                style={{ padding: '0.625rem 1rem 0.625rem 2.75rem' }}
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <button className="btn btn-outline" style={{ padding: '0.625rem 1rem' }}>
                                            <Filter size={18} />
                                        </button>
                                    </div>
                                </div>

                                {storeProducts.length === 0 ? (
                                    <div className="card p-20 text-center bg-main border-dashed">
                                        <div className="flex justify-center mb-4 text-muted">
                                            <ShoppingBag size={48} />
                                        </div>
                                        <p className="text-secondary text-lg">This vendor hasn't listed any products yet.</p>
                                        <p className="text-muted mt-2">Check back later or message the vendor for updates.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                        {storeProducts.map((product, idx) => (
                                            <motion.div
                                                key={product.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.05 }}
                                            >
                                                <ProductCard product={product} />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="about"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="py-12"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="card p-8">
                                        <h3 className="flex items-center gap-2 mb-6">
                                            <Info size={20} className="text-primary" /> Store Information
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between border-bottom pb-3">
                                                <span className="text-muted">Member Since</span>
                                                <span className="font-bold">January 2022</span>
                                            </div>
                                            <div className="flex justify-between border-bottom pb-3">
                                                <span className="text-muted">Location</span>
                                                <span className="font-bold">San Francisco, CA</span>
                                            </div>
                                            <div className="flex justify-between border-bottom pb-3">
                                                <span className="text-muted">Avg. Response Time</span>
                                                <span className="font-bold">Under 2 hours</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted">Standard Shipping</span>
                                                <span className="font-bold">3-5 Business Days</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card p-8">
                                        <h3 className="flex items-center gap-2 mb-6">
                                            <Star size={20} className="text-primary" /> Recent Feedback
                                        </h3>
                                        <div className="space-y-6">
                                            {[1, 2].map(i => (
                                                <div key={i} className="feedback-item">
                                                    <div className="flex justify-between mb-2">
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill="var(--primary)" color="var(--primary)" />)}
                                                        </div>
                                                        <span className="text-xs text-muted">2 days ago</span>
                                                    </div>
                                                    <p className="text-sm">"Amazing quality and super fast shipping! Highly recommend this store for anyone looking for genuine products."</p>
                                                    <div className="mt-2 text-xs font-bold">— Customer #{i}482</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default VendorStore;
