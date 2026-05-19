import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../Shared/ThemeContext';
import { useCart } from '../Shared/CartContext';
import { useVendors } from '../Shared/VendorContext';
import { useProducts } from '../Shared/ProductContext';
import { Sun, Moon, ShoppingBag, User, Search, MoreVertical, LayoutDashboard, ShieldCheck, Store, ChevronDown } from 'lucide-react';

const categories = [
  'Electronics', 'Fashion', 'Home & Living', 'Audio',
  'Beauty', 'Health', 'Sports', 'Art', 'Groceries', 'Toys'
];
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const { vendors, activeVendor, logoutVendor } = useVendors();
  const { products } = useProducts();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const catRef = useRef(null);
  const searchRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Count pending vendor requests
  const pendingVendors = vendors.filter(v => v.status === 'Pending').length;

  const handleLogout = () => {
    logoutVendor();
    navigate('/');
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.vendorName.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setSearchResults(filtered);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > 20);
    };

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (catRef.current && !catRef.current.contains(event.target)) {
        setIsCatOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container flex items-center justify-between">
        <Link to="/" className="logo flex items-center gap-2">
          <div className="logo-icon">V</div>
          <span className="logo-text">Ventra</span>
        </Link>

        <div className="search-bar-container" ref={searchRef}>
          <div className="search-bar">
            <Search className="search-icon-fixed" size={18} />
            <input
              type="text"
              placeholder="Search products, vendors..."
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
            />
          </div>
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                className="search-results-dropdown card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                {searchResults.length > 0 ? (
                  <div className="results-list">
                    <div className="results-group-label">Products & Stores</div>
                    {searchResults.map(p => (
                      <Link
                        key={p.id}
                        to={`/vendor/${p.vendorId}`}
                        className="search-result-item"
                        onClick={() => setIsSearchOpen(false)}
                      >
                        <img src={p.image} alt="" className="item-thumb" />
                        <div className="item-info">
                          <span className="name">{p.name}</span>
                          <span className="vendor">{p.vendorName}</span>
                        </div>
                        <span className="price">${p.price}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="no-results-lite">No matches found</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="nav-links flex items-center gap-8">
          <Link to="/" className="nav-link">Marketplace</Link>
          <div className="cat-dropdown-wrapper" ref={catRef}>
            <button
              className={`nav-link cat-trigger ${isCatOpen ? 'active' : ''}`}
              onClick={() => setIsCatOpen(!isCatOpen)}
            >
              Categories <ChevronDown size={14} className={`chevron ${isCatOpen ? 'rotate' : ''}`} />
            </button>
            {isCatOpen && (
              <div className="cat-dropdown card">
                {categories.map(cat => (
                  <Link
                    key={cat}
                    to={`/category/${cat}`}
                    className="cat-dropdown-item"
                    onClick={() => setIsCatOpen(false)}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/orders" className="nav-link">My Orders</Link>
        </nav>

        <div className="nav-actions flex items-center gap-4">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle Dark/Light Mode">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <Link to="/cart" className="cart-icon-wrapper">
            <ShoppingBag size={22} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>

          <div className="profile-btn">
            <User size={22} />
          </div>

          <div className="portal-menu-container" ref={menuRef}>
            <button
              className={`portal-trigger ${isMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              title="Portals & Management"
              style={{ position: 'relative' }}
            >
              <MoreVertical size={24} />
              {pendingVendors > 0 && (
                <span className="admin-dot-indicator"></span>
              )}
            </button>

            {isMenuOpen && (
              <div className="portal-dropdown card">
                <div className="dropdown-header">
                  <span>Portals & Access</span>
                </div>
                <div className="dropdown-links">
                  <Link to="/admin" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                    <div className="item-icon admin" style={{ position: 'relative' }}>
                      <ShieldCheck size={18} />
                      {pendingVendors > 0 && (
                        <span className="count-badge-mini">{pendingVendors}</span>
                      )}
                    </div>
                    <div className="item-text">
                      <span className="title">Admin Portal</span>
                      <span className="desc">Platform management</span>
                    </div>
                  </Link>
                  <Link to="/sell" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                    <div className="item-icon sell"><Store size={18} /></div>
                    <div className="item-text">
                      <span className="title">Become a Vendor</span>
                      <span className="desc">Register your store</span>
                    </div>
                  </Link>
                  <Link to="/vendor-login" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                    <div className="item-icon login"><LayoutDashboard size={18} /></div>
                    <div className="item-text">
                      <span className="title">Vendor Login</span>
                      <span className="desc">Manage your existing store</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
