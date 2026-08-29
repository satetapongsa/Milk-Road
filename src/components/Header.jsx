import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useSearchParams, useNavigate } from 'react-router-dom';
import { Store, Search, ShoppingCart, User, Clock, ArrowUpRight, Filter, ChevronDown, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

export default function Header({ onOpenCart }) {
    const { totalItems } = useCart();
    const { products } = useProducts();
    const { currentUser, isLoggedIn, isAdmin, logout, openAuthModal } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    // Sync input with URL params
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
                    <img src="/images/logo.png" alt="StudyRoad Logo" style={{ height: '40px', borderRadius: '8px' }} />
                    <span style={{ marginLeft: '8px', fontWeight: 800, background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>StudyRoad</span>
                </Link>

                <div className="search-bar" ref={searchRef}>
                    <div className="search-input-wrap">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="ค้นหาคอร์สเรียน / สรุปชีทเรียน (แคลคูลัส, ฟิสิกส์, เคมี, ชีวะ)..."
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
                    <NavLink to="/my-library" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>📚 คลังหนังสือส่วนตัว</NavLink>
                    <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>รายการสั่งซื้อ</NavLink>
                    <NavLink to="/account" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>บัญชีผู้ใช้</NavLink>
                </nav>

                <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button className="icon-btn" id="cart-btn" onClick={onOpenCart}>
                        <ShoppingCart size={20} />
                        <span className={`badge ${totalItems > 0 ? 'bump' : ''}`} id="cart-count" key={totalItems}>
                            {totalItems}
                        </span>
                    </button>

                    {isLoggedIn ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', padding: '4px 10px', borderRadius: 20, border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 4 }}>
                                {isAdmin && <ShieldCheck size={14} color="#4f46e5" />}
                                {currentUser.full_name}
                                {isAdmin && <span style={{ background: '#eef2ff', color: '#4f46e5', fontSize: 10, padding: '1px 6px', borderRadius: 10 }}>Admin</span>}
                            </span>
                            <button
                                onClick={logout}
                                title="ออกจากระบบ"
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', padding: 2 }}
                            >
                                <LogOut size={15} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => openAuthModal('กรุณาเข้าสู่ระบบหรือสมัครสมาชิกก่อนเข้าชม/สั่งซื้อไฟล์สรุป')}
                            style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: 20,
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)'
                            }}
                        >
                            <LogIn size={15} /> เข้าสู่ระบบ / สมัครสมาชิก
                        </button>
                    )}
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
