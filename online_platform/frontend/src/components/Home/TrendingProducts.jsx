import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../Shared/ProductCard';
import Skeleton from '../Shared/Skeleton';
import { useProducts } from '../Shared/ProductContext';
import './TrendingProducts.css';

const TrendingProducts = () => {
    const { products } = useProducts();

    // Show only first 4 products for "Trending"
    const trendingList = (products || []).slice(0, 4);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    if (!trendingList || trendingList.length === 0) return null;

    return (
        <section className="trending-products py-20">
            <div className="container">
                <div className="section-header">
                    <div>
                        <span className="badge" style={{ marginBottom: '1rem', background: 'var(--primary-soft)', color: 'var(--primary)' }}>Curated for you</span>
                        <h2 className="section-title">Trending Now</h2>
                    </div>
                    <Link to="/category/all" className="view-all-link">
                        View All Collections <ArrowRight size={20} />
                    </Link>
                </div>

                <motion.div
                    className="products-grid"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {trendingList.map(product => (
                        <motion.div key={product.id} variants={itemVariants}>
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default TrendingProducts;
