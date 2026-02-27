import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useSearchParams, useNavigate } from 'react-router-dom';
import { Store, Search, ShoppingCart, User, Clock, ArrowUpRight, Filter, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

export default function Header({ onOpenCart }) {
    const { totalItems } = useCart();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    // Sync input with URL params
    useEffect(() => {
        setSearchTerm(searchParams.get('q') || '');
    }, [searchParams]);

    // Close suggestions when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchTerm(val);

        // Update URL immediately for live search filtering on Home page
        setSearchParams(prev => {
            if (val) prev.set('q', val);
            else prev.delete('q');
            return prev;
        });

        // Generate suggestions algorithm
        if (val.length > 0) {
            const lowerVal = val.toLowerCase();
            const matches = products
                .filter(p =>
                    p.name.toLowerCase().includes(lowerVal) ||
                    p.category.toLowerCase().includes(lowerVal)
                )
                .slice(0, 5); // Limit to top 5 results
            setSuggestions(matches);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (productName) => {
        setSearchTerm(productName);
        setSearchParams(prev => {
            prev.set('q', productName);
            return prev;
        });
        setShowSuggestions(false);
        const currentCategory = searchParams.get('category') || '';
        if (currentCategory) {
            navigate('/?q=' + encodeURIComponent(productName) + '&category=' + encodeURIComponent(currentCategory));
        } else {
            navigate('/?q=' + encodeURIComponent(productName));
        }
    };

    return (
        <header className="header">
            <div className="container header-container">
                <Link to="/" className="logo" onClick={() => { setSearchParams({}); setSearchTerm(''); }}>
                    <img src="/images/logo.png" alt="Milk Road Logo" style={{ height: '40px' }} />
                    <span style={{ marginLeft: '8px' }}>Milk Road</span>
                </Link>

                <div className="search-bar" ref={searchRef}>
                    <div className="search-input-wrap">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="ค้นหาสินค้า..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onFocus={() => { if (searchTerm) setShowSuggestions(true); }}
                            autoComplete="off"
                        />
                    </div>
                    <div className="search-category-wrap">
                        <Filter className="filter-icon" />
                        <select
                            value={searchParams.get('category') || ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSearchParams(prev => {
                                    if (val) prev.set('category', val);
                                    else prev.delete('category');
                                    return prev;
                                });
                            }}
                        >
                            <option value="">ทุกหมวดหมู่</option>
                            {Array.from(new Set(products.map(p => p.category))).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <ChevronDown className="chevron-icon" />
                    </div>

                    {showSuggestions && suggestions.length > 0 && (
                        <div className="search-dropdown">
                            {suggestions.map((product) => (
                                <div
                                    key={product.id}
                                    className="search-suggestion-item"
                                    onClick={() => handleSuggestionClick(product.name)}
                                >
                                    <Search size={14} className="suggestion-icon" />
                                    <div className="suggestion-content">
                                        <span dangerouslySetInnerHTML={{
                                            __html: product.name.replace(
                                                new RegExp(`(${searchTerm})`, 'gi'),
                                                '<b>$1</b>'
                                            )
                                        }} />
                                        <small className="suggestion-cat">ใขหมวด: {product.category}</small>
                                    </div>
                                    <ArrowUpRight size={14} className="jump-icon" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <nav className="nav-menu">
                    <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>หน้าแรก</NavLink>
                    <a href="/#products" className="nav-link">สินค้า</a>
                    <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>รายการสั่งซื้อ</NavLink>
                    <NavLink to="/account" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>บัญชีผู้ใช้</NavLink>
                </nav>

                <div className="header-actions">
                    <button className="icon-btn" id="cart-btn" onClick={onOpenCart}>
                        <ShoppingCart size={20} />
                        <span className={`badge ${totalItems > 0 ? 'bump' : ''}`} id="cart-count" key={totalItems}>
                            {totalItems}
                        </span>
                    </button>
                    <Link to="/account" className="icon-btn">
                        <User size={20} />
                    </Link>
                </div>
            </div>

            <style>{`
                .search-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    margin-top: 8px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                    z-index: 1005;
                    overflow: hidden;
                    animation: slideDown 0.2s ease-out;
                }
                
                .search-suggestion-item {
                    padding: 12px 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    transition: all 0.15s;
                    border-bottom: 1px solid #f1f5f9;
                }
                
                .search-suggestion-item:last-child {
                    border-bottom: none;
                }
                
                .search-suggestion-item:hover {
                    background-color: #f8fafc;
                }
                
                .suggestion-icon {
                    color: var(--text-light);
                }
                
                .suggestion-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    font-size: 14px;
                    color: var(--text-main);
                }
                
                .suggestion-content b {
                    color: var(--primary);
                }
                
                .suggestion-cat {
                    font-size: 11px;
                    color: var(--text-light);
                }
                
                .jump-icon {
                    color: var(--text-light);
                    opacity: 0;
                    transform: translateX(-5px);
                    transition: all 0.2s;
                }
                
                .search-suggestion-item:hover .jump-icon {
                    opacity: 1;
                    transform: translateX(0);
                }
            `}</style>
        </header>
    );
}
