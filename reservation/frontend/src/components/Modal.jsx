import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children, footer, contentClassName }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="modal-overlay"
                    />
                    <div className="modal-wrapper">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="modal-container"
                        >
                            {title && (
                                <div className="modal-header">
                                    <div className="modal-title-wrapper">
                                        {title.main && <h3>{title.main}</h3>}
                                        {title.sub && <p>{title.sub}</p>}
                                    </div>
                                    <button onClick={onClose} className="modal-close-btn">
                                        <X size={20} />
                                    </button>
                                </div>
                            )}
                            {!title && (
                                <button onClick={onClose} className="modal-close-btn absolute-close">
                                    <X size={20} />
                                </button>
                            )}
                            <div className={`modal-content ${contentClassName || ''}`}>
                                {children}
                            </div>
                            {footer && (
                                <div className="modal-footer">
                                    {footer}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Modal;
