import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVendors } from '../../../components/Shared/VendorContext';
import { useProducts } from '../../../components/Shared/ProductContext';
import { useToast } from '../../../components/Shared/ToastContext';
import { Plus, Trash2, Edit3, X, Image as ImageIcon, Check } from 'lucide-react';
import './VendorProducts.css';

const VendorProducts = () => {
    const { activeVendor } = useVendors();
    const { products, addProduct, deleteProduct } = useProducts();
    const { addToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (!activeVendor) {
            navigate('/vendor-login');
        }
    }, [activeVendor, navigate]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        inventory: '',
        category: 'Electronics'
    });

    if (!activeVendor) return null;

    // Filter products for the active vendor
    const vendorProducts = products.filter(p => p.vendorId === activeVendor.id);

    const handleAddProduct = (e) => {
        e.preventDefault();

        if (!newProduct.name || !newProduct.price || !newProduct.inventory) {
            addToast('Please fill in all fields', 'error');
            return;
        }

        const productToAdd = {
            id: Date.now(),
            vendorId: activeVendor.id,
            vendorName: activeVendor.name,
            vendorLogo: activeVendor.logo,
            name: newProduct.name,
            price: parseFloat(newProduct.price),
            inventory: parseInt(newProduct.inventory),
            category: newProduct.category,
            status: parseInt(newProduct.inventory) > 10 ? 'In Stock' : (parseInt(newProduct.inventory) > 0 ? 'Low Stock' : 'Out of Stock'),
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop' // Default placeholder
        };

        addProduct(productToAdd);
        setIsModalOpen(false);
        setNewProduct({ name: '', price: '', inventory: '', category: 'Electronics' });
        addToast('Product added successfully!', 'success');
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
            addToast('Product removed from marketplace.', 'info');
        }
    };

    return (
        <div className="vendor-products">
            <div className="dashboard-header mb-8 flex justify-between items-end">
                <div>
                    <h1>Store Management</h1>
                    <p className="text-secondary">Managing items for: <span className="font-bold text-primary">{activeVendor.name}</span></p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} />
                    Add New Product
                </button>
            </div>

            <div className="card">
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Inventory</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendorProducts.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-20 text-muted">
                                    No products found. Start by adding one!
                                </td>
                            </tr>
                        ) : (
                            vendorProducts.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <div className="flex items-center gap-4">
                                            <div className="product-mini-img-wrapper">
                                                <img src={product.image} alt={product.name} className="product-mini-img" />
                                            </div>
                                            <span className="font-semibold">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="font-bold">${product.price.toFixed(2)}</td>
                                    <td>{product.inventory} Units</td>
                                    <td>
                                        <span className={`status-badge sm ${product.status.replace(/ /g, '-').toLowerCase()}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button className="btn-action view" title="Edit Product">
                                                <Edit3 size={16} />
                                            </button>
                                            <button className="btn-action" style={{ background: '#fee2e2', color: '#ef4444' }} onClick={() => handleDelete(product.id)} title="Delete Product">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Product Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content card slide-up">
                        <div className="modal-header">
                            <h3>Add New Product</h3>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleAddProduct} className="p-8">
                            <div className="form-group mb-6">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g. Wireless Headset"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-2 gap-6 mb-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
                                <div className="form-group">
                                    <label>Price ($)</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        placeholder="0.00"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Inventory (Stock)</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        placeholder="0"
                                        value={newProduct.inventory}
                                        onChange={(e) => setNewProduct({ ...newProduct, inventory: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group mb-8">
                                <label>Category</label>
                                <select
                                    className="input-field"
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                >
                                    <option>Electronics</option>
                                    <option>Fashion</option>
                                    <option>Home & Living</option>
                                    <option>Audio</option>
                                </select>
                            </div>

                            <div className="image-upload-preview mb-8 border-dashed card p-10 text-center">
                                <ImageIcon size={32} className="mx-auto mb-4 text-muted" />
                                <p className="text-sm text-secondary">Product images will be auto-generated in this demo</p>
                            </div>

                            <div className="flex gap-4">
                                <button type="button" className="btn btn-outline flex-1" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary flex-1">
                                    <Check size={18} /> Add Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorProducts;
