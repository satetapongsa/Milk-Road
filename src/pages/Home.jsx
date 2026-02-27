import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { products, formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';

export default function Home() {
    const [searchParams] = useSearchParams();
    const { addToCart } = useCart();

    // Search Filtering
    const searchTerm = searchParams.get('q')?.toLowerCase() || '';
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
    );

    return (
        <>
            <section className="hero">
                <div className="container hero-content">
                    <h1>ยกระดับประสบการณ์<br />การช้อปปิ้งออนไลน์</h1>
                    <p>ระบบจัดการร้านค้ามาตรฐานสากล ตอบโจทย์ทุกความต้องการของธุรกิจคุณ ด้วยดีไซน์ที่ทันสมัยและใช้งานง่าย</p>
                    <a href="#products" className="btn btn-primary">ช้อปเลย <ArrowRight size={18} /></a>
                </div>
            </section>

            <section className="section" id="products">
                <div className="container">
                    <div className="section-header">
                        <h2>สินค้าแนะนำ</h2>
                        <a href="#" className="view-all">ดูทั้งหมด <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /></a>
                    </div>

                    <div className="products-grid" id="products-container">
                        {filteredProducts.length === 0 ? (
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
                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                                            />
                                        </div>
                                        <div className="product-info">
                                            <div className="product-category">{product.category}</div>
                                            <h3 className="product-title">{product.name}</h3>
                                            <div className="product-price">{formatPrice(product.price)}</div>
                                        </div>
                                    </Link>
                                    <div style={{ padding: '0 24px 24px 24px', marginTop: 'auto' }}>
                                        <button className="add-to-cart-btn" onClick={(e) => {
                                            e.preventDefault();
                                            addToCart(product);
                                        }}>
                                            <ShoppingCart size={18} /> เพิ่มลงตะกร้า
                                        </button>
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
