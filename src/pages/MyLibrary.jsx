import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Lock, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, ShoppingCart, Search, Layers } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../data/products';

export default function MyLibrary() {
    const navigate = useNavigate();
    const { products } = useProducts();
    const { currentUser, isLoggedIn, isAdmin, openAuthModal } = useAuth();
    const [filterCategory, setFilterCategory] = useState('all');

    // Retrieve user's order IDs from localStorage
    const savedReceipt = JSON.parse(localStorage.getItem('shopii_receipt') || 'null');
    const myOrderIds = JSON.parse(localStorage.getItem('my_order_ids') || '[]');

    // Collect all purchased product IDs
    const purchasedProductIds = new Set();
    if (savedReceipt && savedReceipt.items) {
        savedReceipt.items.forEach(item => purchasedProductIds.add(String(item.id)));
    }

    const filteredProducts = filterCategory === 'all' 
        ? products 
        : products.filter(p => p.category === filterCategory);

    return (
        <div className="container" style={{ padding: '40px 24px 80px 24px' }}>
            {/* Page Title Header */}
            <div style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
                borderRadius: '24px',
                padding: '36px 40px',
                color: 'white',
                marginBottom: '40px',
                boxShadow: '0 15px 35px -5px rgba(79, 70, 229, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 20
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '20px', display: 'flex' }}>
                        <BookOpen size={40} color="#ffffff" />
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: '#ffffff', textShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
                                📚 คลังไฟล์หนังสือส่วนตัว (My Digital Library)
                            </h1>
                            {isAdmin && (
                                <span style={{ background: '#fef08a', color: '#854d0e', fontSize: 11, padding: '4px 12px', borderRadius: 20, fontWeight: 800, border: '1px solid #fde047' }}>
                                    👑 Super Admin Full Access
                                </span>
                            )}
                        </div>
                        <p style={{ margin: 0, fontSize: 14, color: '#ffffff', opacity: 1, fontWeight: 500, lineHeight: 1.5 }}>
                            รวบรวมไฟล์สรุปและคอร์สเรียนทั้งหมดที่คุณครอบครองสิทธิ์เข้าอ่านถาวร อ่านในระบบเว็บได้ตลอด 24 ชั่วโมง
                        </p>
                    </div>
                </div>

                {!isLoggedIn && (
                    <button
                        onClick={() => openAuthModal('กรุณาสมัครสมาชิกหรือเข้าสู่ระบบเพื่อดูคลังหนังสือส่วนตัว')}
                        style={{
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            fontWeight: 800,
                            fontSize: 14,
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                    >
                        🔑 เข้าสู่ระบบเพื่อดูไฟล์ของคุณ
                    </button>
                )}
            </div>

            {/* Category Filter Bar */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 30, overflowX: 'auto', paddingBottom: 6 }}>
                {['all', 'ม.ปลาย (ม.4-6)', 'มหาวิทยาลัย', 'คอร์สเรียน + เอกสาร'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        style={{
                            background: filterCategory === cat ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#ffffff',
                            color: filterCategory === cat ? 'white' : '#475569',
                            border: '1px solid',
                            borderColor: filterCategory === cat ? '#4f46e5' : '#cbd5e1',
                            padding: '8px 20px',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: filterCategory === cat ? 700 : 500,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {cat === 'all' ? '✨ ทั้งหมดทุกวิชา' : cat}
                    </button>
                ))}
            </div>

            {/* Product Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
                {filteredProducts.map(product => {
                    const isUnlocked = isAdmin || purchasedProductIds.has(String(product.id));

                    return (
                        <div 
                            key={product.id}
                            style={{
                                background: '#ffffff',
                                borderRadius: '20px',
                                border: '1px solid #e2e8f0',
                                overflow: 'hidden',
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                            }}
                        >
                            {/* Card Image Header */}
                            <div style={{ position: 'relative', height: '180px', overflow: 'hidden', background: '#f1f5f9' }}>
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <span style={{
                                    position: 'absolute',
                                    top: 12,
                                    left: 12,
                                    background: isUnlocked ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(15, 23, 42, 0.8)',
                                    color: 'white',
                                    fontSize: 11,
                                    fontWeight: 700,
                                    padding: '4px 12px',
                                    borderRadius: 20,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 6
                                }}>
                                    {isUnlocked ? <CheckCircle2 size={13} /> : <Lock size={13} />}
                                    {isUnlocked ? 'ปลดล็อคแล้ว' : 'ยังไม่ได้สั่งซื้อ'}
                                </span>
                            </div>

                            {/* Card Details Body */}
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', marginBottom: 4 }}>
                                    {product.category}
                                </div>
                                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                                    {product.name}
                                </h3>
                                <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 20px 0', flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {product.description}
                                </p>

                                {/* Bottom Action Area */}
                                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16, marginTop: 'auto' }}>
                                    {isUnlocked ? (
                                        <Link
                                            to={`/reader/${product.id}`}
                                            style={{
                                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                                color: 'white',
                                                padding: '12px 18px',
                                                borderRadius: '12px',
                                                fontSize: 13,
                                                fontWeight: 800,
                                                textDecoration: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 8,
                                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                                            }}
                                        >
                                            📖 เปิดอ่านชีทสรุปในระบบ <ArrowRight size={16} />
                                        </Link>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                                            <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                                                {formatPrice(product.price)}
                                            </div>
                                            <Link
                                                to={`/product/${product.id}`}
                                                style={{
                                                    background: '#f1f5f9',
                                                    color: '#334155',
                                                    padding: '10px 16px',
                                                    borderRadius: '10px',
                                                    fontSize: 12,
                                                    fontWeight: 700,
                                                    textDecoration: 'none',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 6
                                                }}
                                            >
                                                <ShoppingCart size={14} /> สั่งซื้อเพื่อปลดล็อค
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
