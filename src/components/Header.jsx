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
                <Link to="/" className="logo" onClick={() => { setSearchParams({}); setSearchTerm(''); }} style={{ flexShrink: 0, marginRight: '12px' }}>
                    <img src="/images/logo.png" alt="StudyRoad Logo" style={{ height: '38px', borderRadius: '8px' }} />
                    <span style={{ marginLeft: '8px', fontWeight: 800, fontSize: '20px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>StudyRoad</span>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', padding: '4px 12px', borderRadius: 20, border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 4 }}>
                                {isAdmin && <ShieldCheck size={14} color="#4f46e5" />}
                                {currentUser?.full_name || currentUser?.email || 'สมาชิก StudyRoad'}
                                {isAdmin && <span style={{ background: '#eef2ff', color: '#4f46e5', fontSize: 10, padding: '1px 6px', borderRadius: 10 }}>Admin</span>}
                            </span>

                            <Link 
                                to="/my-library"
                                title="เปิดคลังหนังสือส่วนตัว"
                                style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: '#4f46e5',
                                    background: '#eef2ff',
                                    padding: '4px 10px',
                                    borderRadius: 14,
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    border: '1px solid #c7d2fe'
                                }}
                            >
                                <BookOpen size={13} /> คลังหนังสือส่วนตัว
                            </Link>

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
                            onClick={() => openAuthModal('เข้าสู่ระบบด้วยบัญชีผู้ใช้เพื่อความปลอดภัย')}
                            style={{
                                background: '#ffffff',
                                color: '#1f2937',
                                border: '1px solid #dadce0',
                                padding: '8px 18px',
                                borderRadius: '24px',
                                fontSize: '13px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                boxShadow: '0 1px 3px rgba(60,64,67,0.08), 0 1px 2px rgba(60,64,67,0.12)',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                fontFamily: 'Google Sans, Roboto, Inter, sans-serif'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#f8f9fa';
                                e.currentTarget.style.borderColor = '#d2e3fc';
                                e.currentTarget.style.boxShadow = '0 1px 4px rgba(60,64,67,0.15), 0 2px 6px rgba(60,64,67,0.12)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#ffffff';
                                e.currentTarget.style.borderColor = '#dadce0';
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(60,64,67,0.08), 0 1px 2px rgba(60,64,67,0.12)';
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                            <span>เข้าสู่ระบบด้วยบัญชีผู้ใช้</span>
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
