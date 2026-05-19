import React, { createContext, useContext, useState } from 'react';

const VendorContext = createContext();

export const useVendors = () => useContext(VendorContext);

export const VendorProvider = ({ children }) => {
    // Current "Logged In" Vendor
    const [activeVendor, setActiveVendor] = useState(null);

    // Shared list of vendors
    const [vendors, setVendors] = useState([
        {
            id: 'V-001',
            name: 'Alpha Electronics',
            category: 'Tech & Gadgets',
            dateApplied: 'Jan 15, 2026',
            status: 'Approved',
            doc: 'Verified',
            rating: 4.9,
            sales: '12k+',
            revenue: '$45,280.00',
            orders: '1,240',
            banner: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop',
            logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=100&h=100&auto=format&fit=crop'
        },
        {
            id: 'V-002',
            name: 'Luxe Home',
            category: 'Interior Design',
            dateApplied: 'Jan 10, 2026',
            status: 'Approved',
            doc: 'Verified',
            rating: 4.8,
            sales: '8k+',
            revenue: '$28,150.00',
            orders: '760',
            banner: 'https://images.unsplash.com/photo-1616489953149-7ec947aff8d7?q=80&w=600&auto=format&fit=crop',
            logo: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=100&h=100&auto=format&fit=crop'
        },
        {
            id: 'V-003',
            name: 'Urban Threads',
            category: 'Fashion',
            dateApplied: 'Jan 12, 2026',
            status: 'Approved',
            doc: 'Verified',
            rating: 4.7,
            sales: '25k+',
            revenue: '$112,000.00',
            orders: '3,100',
            banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop',
            logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&h=100&auto=format&fit=crop'
        },
        {
            id: 'V-004',
            name: 'Eco Gear',
            category: 'Outdoor',
            dateApplied: 'Feb 05, 2026',
            status: 'Pending',
            doc: 'Tax_Review.pdf',
            rating: 0.0,
            sales: '0',
            revenue: '$0.00',
            orders: '0',
            banner: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop',
            logo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=100&h=100&auto=format&fit=crop'
        }
    ]);

    const addVendorRequest = (newRequest) => {
        setVendors(prev => {
            // Generate a truly unique ID based on the latest state
            const lastId = prev.length > 0 ? Math.max(...prev.map(v => parseInt(v.id.split('-')[1]))) : 0;
            const nextId = `V-${String(lastId + 1).padStart(3, '0')}`;

            const requestWithData = {
                ...newRequest,
                id: nextId,
                dateApplied: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: 'Pending',
                doc: 'Tax_Review.pdf',
                rating: 0.0,
                sales: '0',
                revenue: '$0.00',
                orders: '0',
                banner: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop',
                logo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=100&h=100&auto=format&fit=crop'
            };
            return [requestWithData, ...prev];
        });
    };

    const updateVendorStatus = (id, newStatus) => {
        setVendors(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
    };

    const loginAsVendor = (vendorId) => {
        const vendor = vendors.find(v => v.id === vendorId);
        if (vendor && vendor.status === 'Approved') {
            setActiveVendor(vendor);
            return true;
        }
        return false;
    };

    const logoutVendor = () => setActiveVendor(null);

    return (
        <VendorContext.Provider value={{
            vendors,
            activeVendor,
            addVendorRequest,
            updateVendorStatus,
            loginAsVendor,
            logoutVendor
        }}>
            {children}
        </VendorContext.Provider>
    );
};
