import React from 'react';
import { motion } from 'framer-motion';
import './RestaurantLoader.css';

const RestaurantLoader = ({ message = "Setting your table..." }) => {
    return (
        <div className="restaurant-loader-container">
            <div className="loader-visual">
                {/* Custom SVG Restaurant Animation */}
                <motion.svg
                    width="100"
                    height="80"
                    viewBox="0 0 100 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* The Plate */}
                    <motion.ellipse
                        cx="50"
                        cy="65"
                        rx="40"
                        ry="10"
                        fill="#E5E7EB"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    />

                    {/* The Cloche (Food Cover) */}
                    <motion.path
                        d="M20 60C20 40 33.4315 25 50 25C66.5685 25 80 40 80 60H20Z"
                        fill="#F97316"
                        animate={{
                            y: [0, -15, 0],
                            rotate: [0, -2, 2, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Cloche Handle */}
                    <motion.circle
                        cx="50"
                        cy="22"
                        r="4"
                        fill="#EA580C"
                        animate={{
                            y: [0, -15, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Steam Lines */}
                    {[0, 1, 2].map((i) => (
                        <motion.path
                            key={i}
                            d={`M${40 + i * 10} 20C${40 + i * 10} 15 ${45 + i * 10} 15 ${45 + i * 10} 10`}
                            stroke="#F97316"
                            strokeWidth="2"
                            strokeLinecap="round"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                                opacity: [0, 0.6, 0],
                                y: [-5, -20]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.4,
                                ease: "easeOut"
                            }}
                        />
                    ))}
                </motion.svg>
            </div>

            <motion.div
                className="loader-text"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                {message}
            </motion.div>
        </div>
    );
};

export default RestaurantLoader;
