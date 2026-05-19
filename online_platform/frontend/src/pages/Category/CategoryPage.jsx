import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../../components/Shared/ProductContext';
import ProductCard from '../../components/Shared/ProductCard';
import { Filter, Search, ChevronRight, SlidersHorizontal, Grid, List as ListIcon } from 'lucide-react';
import './CategoryPage.css';

const CategoryPage = () => {
    const { categoryName } = useParams();
    const { products } = useProducts();
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');

    const isAll = categoryName.toLowerCase() === 'all' || categoryName.toLowerCase() === 'all-collections';
    const normalizedCategory = isAll ? 'All Collections' : categoryName.replace(/-/g, ' ');

    const categoryProducts = isAll
        ? products
        : products.filter(p => p.category.toLowerCase() === normalizedCategory.toLowerCase());

    const filteredProducts = categoryProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div
            className="category-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <section className="category-hero">
                <div className="container">
                    <nav className="breadcrumb">
                        <Link to="/">Home</Link>
                        <ChevronRight size={14} />
                        <span>{normalizedCategory}</span>
                    </nav>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {normalizedCategory}
                    </motion.h1>
                    <p className="category-description">
                        Discover our curated collection of premium {normalizedCategory.toLowerCase()} products,
                        vetted for quality and excellence by our global network of professional vendors.
                    </p>
                </div>
                <div className="hero-bg-accent"></div>
            </section>

            <div className="container">
                <div className="category-toolbar">
                    <div className="toolbar-left">
                        <div className="search-filter">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder={`Search in ${normalizedCategory}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="toolbar-right">
                        <div className="results-count">
                            Showing <strong>{filteredProducts.length}</strong> products
                        </div>
                        <div className="divider-v"></div>
                        <div className="view-toggle">
                            <button
                                className={viewMode === 'grid' ? 'active' : ''}
                                onClick={() => setViewMode('grid')}
                                aria-label="Grid View"
                            >
                                <Grid size={20} />
                            </button>
                            <button
                                className={viewMode === 'list' ? 'active' : ''}
                                onClick={() => setViewMode('list')}
                                aria-label="List View"
                            >
                                <ListIcon size={20} />
                            </button>
                        </div>
                        <button className="btn btn-outline filter-btn">
                            <SlidersHorizontal size={18} />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="category-content-layout">
                    <aside className="category-sidebar">
                        <div className="sidebar-section">
                            <h4>Featured Vendors</h4>
                            <div className="vendor-list">
                                {Array.from(new Set(categoryProducts.map(p => p.vendorName))).map(vendor => (
                                    <label key={vendor} className="filter-checkbox">
                                        <input type="checkbox" />
                                        <span>{vendor}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="sidebar-section">
                            <h4>Price Range</h4>
                            <div className="price-inputs">
                                <input type="number" placeholder="Min" />
                                <span>-</span>
                                <input type="number" placeholder="Max" />
                            </div>
                        </div>

                        <div className="sidebar-section">
                            <h4>Availability</h4>
                            <label className="filter-checkbox">
                                <input type="checkbox" defaultChecked />
                                <span>In Stock</span>
                            </label>
                            <label className="filter-checkbox">
                                <input type="checkbox" />
                                <span>On Sale</span>
                            </label>
                        </div>
                    </aside>

                    <main className="product-display">
                        <AnimatePresence mode="wait">
                            {filteredProducts.length > 0 ? (
                                <motion.div
                                    key={viewMode}
                                    className={`products-${viewMode}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    {filteredProducts.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    className="no-results"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <div className="no-results-icon">
                                        <Search size={64} />
                                    </div>
                                    <h3>No products found</h3>
                                    <p>Try adjusting your search or filters to find what you're looking for.</p>
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => { setSearchQuery(''); }}
                                    >
                                        Clear Search
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </motion.div>
    );
};

export default CategoryPage;
