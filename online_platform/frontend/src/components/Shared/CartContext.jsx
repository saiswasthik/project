import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // Initial mock data to keep the UI populated as the user expects
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Tactile Mechanical Keyboard', price: 189.00, quantity: 1, vendorName: 'Alpha Electronics', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=200&auto=format&fit=crop' },
        { id: 5, name: 'Ultrawide Curved Monitor', price: 549.00, quantity: 1, vendorName: 'Alpha Electronics', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=200&auto=format&fit=crop' },
        { id: 2, name: 'Minimalist Glass Carafe', price: 45.00, quantity: 2, vendorName: 'PureDesign', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=200&auto=format&fit=crop' }
    ]);

    const addToCart = (product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id, delta) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        }));
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const groupedItems = cartItems.reduce((acc, item) => {
        const vendor = item.vendorName || 'General';
        if (!acc[vendor]) acc[vendor] = [];
        acc[vendor].push(item);
        return acc;
    }, {});

    const cartGroups = Object.keys(groupedItems).map(vendor => ({
        vendorName: vendor,
        items: groupedItems[vendor]
    }));

    const calculateSubtotal = () => {
        return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            cartCount,
            cartGroups,
            calculateSubtotal,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
