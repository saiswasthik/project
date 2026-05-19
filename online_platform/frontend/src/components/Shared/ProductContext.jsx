import React, { createContext, useContext, useState } from 'react';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([
        {
            id: 1,
            vendorId: 'V-001',
            name: 'Tactile Mechanical Keyboard',
            price: 189.00,
            inventory: 45,
            status: 'In Stock',
            category: 'Electronics',
            vendorName: 'Alpha Electronics',
            vendorLogo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=100&h=100&auto=format&fit=crop',
            image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 2,
            vendorId: 'V-002',
            name: 'Minimalist Glass Carafe',
            price: 45.00,
            inventory: 20,
            status: 'In Stock',
            category: 'Home & Living',
            vendorName: 'Luxe Home',
            vendorLogo: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=100&h=100&auto=format&fit=crop',
            image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 3,
            vendorId: 'V-003',
            name: 'Oversized Cashmere Sweater',
            price: 240.00,
            inventory: 15,
            status: 'In Stock',
            category: 'Fashion',
            vendorName: 'Urban Threads',
            vendorLogo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&h=100&auto=format&fit=crop',
            image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 4,
            vendorId: 'V-001',
            name: 'Studio Headphones Over-Ear',
            price: 299.00,
            inventory: 8,
            status: 'Low Stock',
            category: 'Audio',
            vendorName: 'Alpha Electronics',
            vendorLogo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=100&h=100&auto=format&fit=crop',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 5,
            vendorId: 'V-001',
            name: 'Ultrawide Curved Monitor',
            price: 549.00,
            inventory: 12,
            status: 'In Stock',
            category: 'Electronics',
            vendorName: 'Alpha Electronics',
            vendorLogo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=100&h=100&auto=format&fit=crop',
            image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 8,
            vendorId: 'V-004',
            name: 'Organic Matcha Ritual Set',
            price: 85.00,
            inventory: 30,
            status: 'In Stock',
            category: 'Health',
            vendorName: 'Pure Origins',
            vendorLogo: 'https://images.unsplash.com/photo-1550439062-609e1530227c?q=80&w=100&h=100&auto=format&fit=crop',
            image: 'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 9,
            vendorId: 'V-004',
            name: 'Natural Rosehip Facial Oil',
            price: 42.00,
            inventory: 50,
            status: 'In Stock',
            category: 'Beauty',
            vendorName: 'Pure Origins',
            vendorLogo: 'https://images.unsplash.com/photo-1550439062-609e1530227c?q=80&w=100&h=100&auto=format&fit=crop',
            image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 10,
            vendorId: 'V-005',
            name: 'Pro Series Tennis Racket',
            price: 210.00,
            inventory: 10,
            status: 'In Stock',
            category: 'Sports',
            vendorName: 'Elite Sports',
            vendorLogo: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=100&h=100&auto=format&fit=crop',
            image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 11,
            vendorId: 'V-006',
            name: 'Abstract Oil Canvas',
            price: 850.00,
            inventory: 1,
            status: 'Limited Edition',
            category: 'Art',
            vendorName: 'The Gallery',
            vendorLogo: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=100&h=100&auto=format&fit=crop',
            image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 12,
            vendorId: 'V-002',
            name: 'Artisanal Coffee Beans',
            price: 28.00,
            inventory: 100,
            status: 'In Stock',
            category: 'Groceries',
            vendorName: 'Luxe Home',
            vendorLogo: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=100&h=100&auto=format&fit=crop',
            image: 'https://images.unsplash.com/photo-1559056191-755029310f06?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 13,
            vendorId: 'V-003',
            name: 'Wooden Educational Blocks',
            price: 55.00,
            inventory: 40,
            status: 'In Stock',
            category: 'Toys',
            vendorName: 'Urban Threads',
            vendorLogo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&h=100&auto=format&fit=crop',
            image: 'https://images.unsplash.com/photo-1515488403649-70ad2750dae1?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 14,
            vendorId: 'V-001',
            name: 'Noise Cancelling Wireless Earbuds',
            price: 159.00,
            category: 'Audio',
            vendorName: 'Alpha Electronics',
            image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 15,
            vendorId: 'V-003',
            name: 'Minimalist Cotton Tote',
            price: 35.00,
            category: 'Fashion',
            vendorName: 'Urban Threads',
            image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 16,
            vendorId: 'V-002',
            name: 'Ceramic Table Lamp',
            price: 120.00,
            category: 'Home & Living',
            vendorName: 'Luxe Home',
            image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 17,
            vendorId: 'V-004',
            name: 'Hydrating Face Serum',
            price: 48.00,
            category: 'Beauty',
            vendorName: 'Pure Origins',
            image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 18,
            vendorId: 'V-004',
            name: 'Eco Yoga Mat',
            price: 75.00,
            category: 'Health',
            vendorName: 'Pure Origins',
            image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 19,
            vendorId: 'V-005',
            name: 'Recycled Rubber Dumbbells',
            price: 89.00,
            category: 'Sports',
            vendorName: 'Elite Sports',
            image: 'https://images.unsplash.com/photo-1583454110551-21f2fa200c8c?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 20,
            vendorId: 'V-006',
            name: 'Modern Sculpture Vase',
            price: 145.00,
            category: 'Art',
            vendorName: 'The Gallery',
            image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 21,
            vendorId: 'V-002',
            name: 'Organic Earl Grey Tea',
            price: 18.00,
            category: 'Groceries',
            vendorName: 'Luxe Home',
            image: 'https://images.unsplash.com/photo-1594631252845-29fc458695d7?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 22,
            vendorId: 'V-003',
            name: 'Handcrafted Wooden Train',
            price: 45.00,
            category: 'Toys',
            vendorName: 'Urban Threads',
            image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800&auto=format&fit=crop'
        }
    ]);

    const addProduct = (newProduct) => {
        setProducts(prev => [newProduct, ...prev]);
    };

    const deleteProduct = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const getProductsByVendor = (vendorId) => {
        return products.filter(p => p.vendorId === vendorId);
    };

    return (
        <ProductContext.Provider value={{
            products,
            addProduct,
            deleteProduct,
            getProductsByVendor
        }}>
            {children}
        </ProductContext.Provider>
    );
};
