import React, { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([
        {
            id: "ORD-92834",
            date: "Jan 24, 2026",
            total: 833.00,
            status: "Delivered",
            subOrders: [
                {
                    vendorName: "Alpha Electronics",
                    items: [
                        { name: "Tactile Mechanical Keyboard", quantity: 1, price: 189.00 },
                        { name: "Ultrawide Curved Monitor", quantity: 1, price: 549.00 }
                    ],
                    status: "Delivered"
                },
                {
                    vendorName: "Luxe Home",
                    items: [
                        { name: "Minimalist Glass Carafe", quantity: 2, price: 45.00 }
                    ],
                    status: "Delivered"
                }
            ]
        }
    ]);

    const addOrder = (cartGroups, total) => {
        const newOrder = {
            id: `ORD-${Math.floor(Math.random() * 90000) + 10000}`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            total: total,
            status: "Processing",
            subOrders: cartGroups.map(group => ({
                vendorName: group.vendorName,
                items: group.items.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                status: "Processing"
            }))
        };
        setOrders(prev => [newOrder, ...prev]);
    };

    return (
        <OrderContext.Provider value={{ orders, addOrder }}>
            {children}
        </OrderContext.Provider>
    );
};
