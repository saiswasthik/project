import { Link } from 'react-router-dom';
import { useToast } from './ToastContext';
import { useCart } from './CartContext';
import { ShoppingBag } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToast } = useToast();
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        // Convert price to number just in case it's a string
        const productToAdd = {
            ...product,
            price: typeof product.price === 'string' ? parseFloat(product.price) : product.price
        };
        addToCart(productToAdd);
        addToast(`${product.name} added to cart!`, 'success');
    };

    return (
        <div className="product-card card">
            <div className="product-image">
                <img src={product.image} alt={product.name} />
                <div className="product-badge">{product.category}</div>
            </div>
            <div className="product-info">
                <Link to={`/vendor/${product.vendorId || 'V-001'}`} className="vendor-info">
                    <img src={product.vendorLogo} alt={product.vendorName} className="vendor-mini-logo" />
                    <span className="vendor-tag-label">{product.vendorName}</span>
                </Link>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-footer flex items-center justify-between">
                    <div className="product-price">
                        <span className="currency">$</span>
                        <span className="amount">{product.price}</span>
                    </div>
                    <button className="add-to-cart-btn" title="Add to Cart" onClick={handleAddToCart}>
                        <ShoppingBag size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
