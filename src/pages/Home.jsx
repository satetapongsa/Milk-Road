import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, ShoppingCart, XCircle, Loader, AlertTriangle } from 'lucide-react';
import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

export default function Home() {
    const [searchParams] = useSearchParams();
    const { addToCart } = useCart();
    const { products, isLoading, error } = useProducts();

    // Search Filtering
    const searchTerm = searchParams.get('q')?.toLowerCase() || '';
    const categoryParam = searchParams.get('category') || '';

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryParam ? p.category === categoryParam : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <>
            <section className="hero" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)', color: '#ffffff', padding: '60px 0' }}>
                <div className="container hero-content" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'center' }}>
                    <div>
                        <span style={{ background: 'rgba(255,255,255,0.15)', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, color: '#93c5fd', display: 'inline-block', marginBottom: '16px' }}>
                            🎓 StudyRoad Digital Learning Hub
                        </span>
                        <h1 style={{ fontSize: '2.5rem', lineHeight: 1.2, fontWeight: 800, marginBottom: '16px' }}>
                            เรียนอย่างมั่นใจ สรุปชีทตรงประเด็น<br />
                            <span style={{ background: 'linear-gradient(135deg, #a5b4fc, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                แคลคูลัส ฟิสิกส์ เคมี ชีวะ
                            </span>
                        </h1>
                        <p style={{ fontSize: '1.05rem', color: '#e0e7ff', marginBottom: '24px', lineHeight: 1.6 }}>
                            สรุปชีท PDF ความละเอียดสูงอ่านง่าย พร้อมคอร์สเรียนวิดีโอความคมชัด HD จากทีมอาจารย์สาย STEM ดาวน์โหลดอ่านได้ทันที เข้าเรียนได้ตลอดชีพ
                        </p>
                        <a href="#products" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', padding: '12px 28px', fontSize: '1rem' }}>
                            เลือกคอร์ส & ชีทสรุป <ArrowRight size={18} />
                        </a>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <img 
                            src="/images/hero_banner.jpg" 
                            alt="StudyRoad Learning Platform" 
                            style={{ width: '100%', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)' }} 
                        />
                    </div>
                </div>
            </section>

            <section className="section" id="products">
                <div className="container">
                    <div className="section-header">
                        <h2>คอร์สเรียน & สรุปชีทบทเรียนทั้งหมด</h2>
                    </div>

                    <div className="products-grid" id="products-container">
                        {isLoading ? (
                            <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                <Loader className="spin" size={18} style={{ animation: 'spin 1s linear infinite' }} /> กำลังโหลดสินค้าจากระบบร้านค้า...
                            </p>
                        ) : error ? (
                            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                <AlertTriangle size={18} /> เกิดข้อผิดพลาดในการโหลดสินค้า: {error}
                            </p>
                        ) : filteredProducts.length === 0 ? (
                            <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>ไม่พบสินค้าที่ค้นหา</p>
                        ) : (
                            filteredProducts.map(product => (
                                <div className="product-card" key={product.id}>
                                    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                        <div style={{ position: 'relative', paddingTop: '100%', overflow: 'hidden' }}>
                                            <img
                                                src={product.image}
                                                className="product-img"
                                                loading="lazy"
                                                alt={product.name}
                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                        <div className="product-info">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                                <span className="product-category">{product.category}</span>
                                                {product.stock_quantity <= 0 && (
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#dc2626', background: '#fee2e2', padding: '2px 6px', borderRadius: 4 }}>
                                                        <XCircle size={10} /> หมด
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="product-title">{product.name}</h3>
                                            <div className="product-price">{formatPrice(product.price)}</div>
                                        </div>
                                    </Link>
                                    <div style={{ padding: '0 24px 24px 24px', marginTop: 'auto' }}>
                                        {product.stock_quantity <= 0 ? (
                                            <button 
                                                className="add-to-cart-btn" 
                                                disabled
                                                style={{ 
                                                    background: '#e2e8f0', 
                                                    color: '#94a3b8', 
                                                    cursor: 'not-allowed',
                                                    border: 'none',
                                                    boxShadow: 'none',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 6
                                                }}
                                            >
                                                สินค้าหมดชั่วคราว
                                            </button>
                                        ) : (
                                            <button className="add-to-cart-btn" onClick={(e) => {
                                                e.preventDefault();
                                                addToCart(product);
                                            }}>
                                                <ShoppingCart size={18} /> เพิ่มลงตะกร้า
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
