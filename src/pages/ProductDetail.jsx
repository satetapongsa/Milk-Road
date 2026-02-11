import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products, formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Plus, Minus, ShoppingCart, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        const found = products.find(p => p.id === parseInt(id));
        setProduct(found);
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddToCart = () => {
        addToCart({ ...product, quantity });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    if (!product) return <div className="container" style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="container">
            <div style={{ padding: '40px 24px' }}>
                <Link to="/" className="btn btn-outline" style={{ display: 'inline-flex', marginBottom: 24, border: 'none', paddingLeft: 0 }}>
                    <ArrowLeft size={20} /> กลับไปหน้าสินค้า
                </Link>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 60, alignItems: 'start' }} className="product-detail-grid">
                    {/* Image Section */}
                    <div>
                        <div style={{
                            background: '#f1f5f9',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            aspectRatio: '1/1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <img
                                src={product.image}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
                            />
                        </div>
                    </div>

                    {/* Info Section */}
                    <div>
                        <div style={{
                            display: 'inline-block',
                            background: '#eef2ff',
                            color: 'var(--primary)',
                            padding: '4px 12px',
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 600,
                            marginBottom: 16,
                            textTransform: 'uppercase'
                        }}>
                            {product.category}
                        </div>

                        <h1 style={{ fontSize: 32, lineHeight: 1.2, marginBottom: 16 }}>{product.name}</h1>

                        <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--primary)', marginBottom: 24 }}>
                            {formatPrice(product.price)}
                        </div>

                        <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--text-muted)', marginBottom: 32 }}>
                            {product.description}
                        </p>

                        {/* Specs */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
                            {product.specs && product.specs.map((spec, i) => (
                                <div key={i} style={{
                                    background: '#f8fafc',
                                    padding: '8px 12px',
                                    borderRadius: 8,
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: 'var(--secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8
                                }}>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }}></div>
                                    {spec}
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div style={{
                            padding: 24,
                            border: '1px solid var(--border)',
                            borderRadius: 16,
                            marginBottom: 32
                        }}>
                            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                                <div className="qty-control" style={{ padding: 8, gap: 16 }}>
                                    <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} /></button>
                                    <span style={{ fontSize: 16, fontWeight: 600, minWidth: 24, textAlign: 'center' }}>{quantity}</span>
                                    <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}><Plus size={16} /></button>
                                </div>
                                <button
                                    className={`btn btn-block ${isAdded ? 'btn-success' : 'btn-primary'}`}
                                    onClick={handleAddToCart}
                                    style={{ flexGrow: 1, backgroundColor: isAdded ? '#10b981' : undefined, border: isAdded ? 'none' : undefined }}
                                >
                                    {isAdded ? (
                                        <>
                                            <Check size={20} /> เพิ่มเรียบร้อยแล้ว
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart size={20} /> เพิ่มใส่ตะกร้า
                                        </>
                                    )}
                                </button>
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--text-light)', textAlign: 'center' }}>
                                จัดส่งฟรีทั่วประเทศ เมื่อมียอดสั่งซื้อครบ 5,000 บาท
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, textAlign: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                <ShieldCheck size={24} color="var(--primary)" />
                                <span style={{ fontSize: 12, fontWeight: 500 }}>รับประกันศูนย์ 1 ปี</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                <Truck size={24} color="var(--primary)" />
                                <span style={{ fontSize: 12, fontWeight: 500 }}>ส่งด่วน 1-3 วัน</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                <RotateCcw size={24} color="var(--primary)" />
                                <span style={{ fontSize: 12, fontWeight: 500 }}>เปลี่ยนคืนใน 7 วัน</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @media (max-width: 900px) {
                    .product-detail-grid {
                        grid-template-columns: 1fr !important;
                        gap: 32px !important;
                    }
                }
            `}</style>
        </div>
    );
}
