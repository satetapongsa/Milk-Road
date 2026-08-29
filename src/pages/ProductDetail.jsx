import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Plus, Minus, ShoppingCart, Check, ShieldCheck, Truck, RotateCcw, FlaskConical, Factory, CalendarDays, CalendarX, ClipboardList, XCircle, AlertTriangle } from 'lucide-react';
import PDFReaderViewer from '../components/PDFReaderViewer';

export default function ProductDetail() {
    const { id } = useParams();
    const { getProductById, isLoading, error } = useProducts();
    const product = getProductById(id);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { isLoggedIn, openAuthModal } = useAuth();
    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddToCart = () => {
        if (!isLoggedIn) {
            openAuthModal('กรุณาสมัครสมาชิกหรือเข้าสู่ระบบก่อนสั่งซื้อชีทสรุปในระบบ');
            return;
        }
        addToCart({ ...product, quantity });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    if (isLoading) return <div className="container" style={{ padding: 40, textAlign: 'center' }}>กำลังโหลดข้อมูลสินค้า...</div>;
    if (error) return <div className="container" style={{ padding: 40, textAlign: 'center', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><AlertTriangle size={20} /> เกิดข้อผิดพลาดในการโหลดสินค้า</div>;
    if (!product) return <div className="container" style={{ padding: 40, textAlign: 'center' }}>ไม่พบสินค้านี้ในระบบ</div>;

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
                            justifyContent: 'center',
                            marginBottom: '16px'
                        }}>
                            <img
                                src={product.images && product.images.length > 0 ? product.images[0] : product.image}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                id="main-product-image"
                            />
                        </div>
                        {/* Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                                {product.images.map((img, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '12px',
                                            background: '#f1f5f9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            border: '2px solid transparent', // Default border
                                            flexShrink: 0
                                        }}
                                        onClick={(e) => {
                                            document.getElementById('main-product-image').src = img;
                                            // Reset borders
                                            const thumbnails = document.querySelectorAll('.product-thumbnail');
                                            thumbnails.forEach(t => t.style.borderColor = 'transparent');
                                            // Highlight clicked
                                            e.currentTarget.style.borderColor = 'var(--primary)';
                                        }}
                                        className="product-thumbnail"
                                    >
                                        <img
                                            src={img}
                                            alt={`${product.name} thumbnail ${index + 1}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
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
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
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

                        {/* Deep Specs Block */}
                        <div style={{
                            background: '#f8fafc',
                            borderRadius: 16,
                            padding: 20,
                            border: '1px solid var(--border)',
                            marginBottom: 32,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 16
                        }}>
                            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a', borderBottom: '1px solid var(--border)', paddingBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <ClipboardList size={18} color="var(--primary)" /> ข้อมูลรายละเอียดผลิตภัณฑ์
                            </h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {product.ingredients && (
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                        <div style={{ background: '#e0f2fe', color: '#0284c7', padding: 8, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FlaskConical size={18} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>ผู้สอน / ผู้จัดทำ (Instructor / Author)</div>
                                            <div style={{ fontSize: 13, color: '#1e293b', fontWeight: 600 }}>{product.ingredients}</div>
                                        </div>
                                    </div>
                                )}

                                {product.origin && (
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                        <div style={{ background: '#fef3c7', color: '#d97706', padding: 8, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Factory size={18} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>รูปแบบการส่งมอบ (Delivery Format)</div>
                                            <div style={{ fontSize: 13, color: '#1e293b', fontWeight: 600 }}>{product.origin}</div>
                                        </div>
                                    </div>
                                )}

                                {(product.mfg_date || product.exp_date) && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, borderTop: '1px dashed var(--border)', paddingTop: 12 }}>
                                        {product.mfg_date && (
                                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                                <div style={{ background: '#eef2ff', color: '#4f46e5', padding: 8, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <CalendarDays size={18} />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>วันที่อัปเดต (Last Updated)</div>
                                                    <div style={{ fontSize: 13, color: '#1e293b', fontWeight: 600 }}>{product.mfg_date}</div>
                                                </div>
                                            </div>
                                        )}
                                        {product.exp_date && (
                                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                                <div style={{ background: '#fee2e2', color: '#dc2626', padding: 8, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <CalendarX size={18} />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>สิทธิ์การเข้าถึง (Access Level)</div>
                                                    <div style={{ fontSize: 13, color: '#1e293b', fontWeight: 600 }}>{product.exp_date}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{
                            padding: 24,
                            border: '1px solid var(--border)',
                            borderRadius: 16,
                            marginBottom: 32,
                            background: product.stock_quantity <= 0 ? '#f8fafc' : 'white'
                        }}>
                            {product.stock_quantity <= 0 ? (
                                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                                    <div style={{ color: '#dc2626', fontWeight: 700, fontSize: 16, marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                        <XCircle size={20} /> ขออภัย รายการนี้ปิดรับสมัครชั่วคราว
                                    </div>
                                    <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
                                        คุณสามารถติดต่อแอดมินเพื่อสอบถามการเปิดรอบเรียนถัดไปได้ครับ
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                                        <div className="qty-control" style={{ padding: 8, gap: 16 }}>
                                            <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} /></button>
                                            <span style={{ fontSize: 16, fontWeight: 600, minWidth: 24, textAlign: 'center' }}>{quantity}</span>
                                            <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}><Plus size={16} /></button>
                                        </div>
                                        <button
                                            className={`btn btn-block ${isAdded ? 'btn-success' : 'btn-primary'}`}
                                            onClick={handleAddToCart}
                                            style={{ flexGrow: 1, backgroundColor: isAdded ? '#4f46e5' : undefined, border: isAdded ? 'none' : undefined }}
                                        >
                                            {isAdded ? (
                                                <>
                                                    <Check size={20} /> เพิ่มใส่ตะกร้าเรียบร้อย
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingCart size={20} /> สั่งซื้อคอร์ส / ดาวน์โหลด PDF
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <div style={{ fontSize: 13, color: 'var(--text-light)', textAlign: 'center', marginBottom: 12 }}>
                                        ⚡ รับสิทธิ์เข้าถึงไฟล์ PDF & วิดีโอบทเรียนทันทีหลังชำระเงินสำเร็จ
                                    </div>
                                     <div style={{ textAlign: 'center', paddingTop: 8, borderTop: '1px dashed #cbd5e1' }}>
                                         <Link 
                                             to={`/reader/${product.id}`} 
                                             className="btn btn-outline"
                                             style={{ 
                                                 display: 'inline-flex', 
                                                 alignItems: 'center', 
                                                 gap: 8, 
                                                 color: '#4f46e5', 
                                                 borderColor: '#6366f1', 
                                                 background: '#eef2ff',
                                                 fontSize: 13,
                                                 fontWeight: 700,
                                                 padding: '8px 16px',
                                                 textDecoration: 'none',
                                                 borderRadius: 8
                                             }}
                                         >
                                             📖 เปิดอ่านชีทเรียนในระบบ (DRM Light Reader)
                                         </Link>
                                     </div>
                                </>
                            )}
                        </div>

                        {/* Trust Badges */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, textAlign: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                <ShieldCheck size={24} color="var(--primary)" />
                                <span style={{ fontSize: 12, fontWeight: 500 }}>เนื้อหาตรงหลักสูตร 100%</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                <Truck size={24} color="var(--primary)" />
                                <span style={{ fontSize: 12, fontWeight: 500 }}>ส่งมอบไฟล์ดิจิทัลทันที</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                <RotateCcw size={24} color="var(--primary)" />
                                <span style={{ fontSize: 12, fontWeight: 500 }}>เข้าเรียนได้ตลอดชีพ</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Blurred Sample Teaser Card Section (Rounded & Styled matching site theme) */}
                <div style={{
                    background: '#ffffff',
                    borderRadius: '24px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
                    marginTop: '48px',
                    padding: '32px',
                    overflow: 'hidden'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ background: '#eef2ff', color: '#4f46e5', padding: '10px', borderRadius: '12px', display: 'flex' }}>
                                <FlaskConical size={22} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    📖 ตัวอย่างหน้าปกและเนื้อหาทดลองอ่าน (Sample Teaser Preview)
                                    <span style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontSize: 11, padding: '2px 10px', borderRadius: 12, fontWeight: 700 }}>
                                        {product?.price === 0 ? '🎁 เล่มแรกทดลองอ่านฟรี 5 หน้าแรก' : 'ดูฟรี 3 หน้าแรก'}
                                    </span>
                                </h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#64748b' }}>
                                    เห็นตัวอย่างหน้าปก สารบัญ และเค้าโครงบทเรียนก่อนตัดสินใจสั่งซื้อ
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 3 Pages Grid (Page 1 Crisp, Pages 2 & 3 Blurred with Lock Overlay) */}
                    <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
                        
                        {/* Page 1: Cover (Crisp Preview) */}
                        <div style={{
                            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                            borderRadius: '16px',
                            border: '1px solid #cbd5e1',
                            padding: '24px',
                            minHeight: '340px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            position: 'relative'
                        }}>
                            <span style={{ position: 'absolute', top: 12, right: 12, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>
                                หน้า 1 (หน้าปก)
                            </span>
                            <div style={{ borderBottom: '2px solid #6366f1', paddingBottom: 12 }}>
                                <img src="/images/logo.png" alt="Logo" style={{ height: 28, borderRadius: 4, marginBottom: 8 }} />
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase' }}>STUDYROAD HIGH-YIELD NOTES</div>
                                <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
                                    {product?.name}
                                </div>
                            </div>
                            <div style={{ margin: '16px 0', fontSize: 12, color: '#334155', lineHeight: 1.6 }}>
                                📌 สรุปเข้ม 5 บทใหญ่ อัปแน่นเตรียมสอบ A-Level<br />
                                📌 แผนภาพกระบวนการ & ตารางเปรียบเทียบ<br />
                                📌 เก็งจุดเน้นออกสอบย้อนหลัง 5 ปี
                            </div>
                            <div style={{ fontSize: 10, color: '#94a3b8', borderTop: '1px solid #e2e8f0', paddingTop: 8, textAlign: 'center' }}>
                                © บริษัท สตั๊ดดี้ โรด จำกัด • สงวนลิขสิทธิ์
                            </div>
                        </div>

                        {/* Page 2: Table of Contents (Blurred Preview) */}
                        <div style={{
                            background: '#ffffff',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            padding: '24px',
                            minHeight: '340px',
                            filter: 'blur(5px)',
                            userSelect: 'none',
                            opacity: 0.6
                        }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5' }}>หน้า 2 (สารบัญ)</span>
                            <h4 style={{ fontSize: 14, fontWeight: 800, marginTop: 8 }}>สารบัญเนื้อหาบทเรียนชีววิทยา</h4>
                            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
                                <div style={{ background: '#f1f5f9', padding: 8, borderRadius: 6 }}>1. เซลล์และการลำเลียงสาร ......... หน้า 1</div>
                                <div style={{ background: '#f1f5f9', padding: 8, borderRadius: 6 }}>2. การหายใจระดับเซลล์ .......... หน้า 25</div>
                                <div style={{ background: '#f1f5f9', padding: 8, borderRadius: 6 }}>3. พันธุศาสตร์ & เทคโนโลยี DNA .. หน้า 55</div>
                                <div style={{ background: '#f1f5f9', padding: 8, borderRadius: 6 }}>4. สรีรวิทยาของมนุษย์ ............ หน้า 85</div>
                                <div style={{ background: '#f1f5f9', padding: 8, borderRadius: 6 }}>5. นิเวศวิทยา & วิวัฒนาการ ......... หน้า 120</div>
                            </div>
                        </div>

                        {/* Page 3: Sample Content (Blurred Preview) */}
                        <div style={{
                            background: '#ffffff',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            padding: '24px',
                            minHeight: '340px',
                            filter: 'blur(6px)',
                            userSelect: 'none',
                            opacity: 0.6
                        }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5' }}>หน้า 3 (ตัวอย่างบทที่ 1)</span>
                            <h4 style={{ fontSize: 14, fontWeight: 800, marginTop: 8 }}>1.1 โครงสร้างเซลล์และหน้าที่ของออร์แกเนลล์</h4>
                            <p style={{ fontSize: 11, color: '#475569', marginTop: 8 }}>
                                นิวเคลียส มีเยื่อหุ้ม 2 ชั้น เก็บรหัสพันธุกรรม ไมโตคอนเดรีย สร้าง ATP ผ่านกระบวนการ Krebs cycle...
                            </p>
                            <div style={{ height: 80, background: '#e2e8f0', borderRadius: 8, marginTop: 12 }}></div>
                        </div>

                        {/* Glassmorphism Lock Overlay across Blurred Pages */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: 'calc(66.6% + 10px)',
                            height: '100%',
                            background: 'rgba(15, 23, 42, 0.85)',
                            backdropFilter: 'blur(6px)',
                            borderRadius: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '30px',
                            textAlign: 'center',
                            color: 'white',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                            zIndex: 10
                        }}>
                            <div style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: 14, borderRadius: '50%', marginBottom: 12, border: '1px solid rgba(99, 102, 241, 0.4)' }}>
                                <ShieldCheck size={36} />
                            </div>
                            <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 6px 0', color: '#f8fafc' }}>
                                🔒 ต้องซื้อสินค้าก่อนเท่านั้นถึงจะเปิดอ่านได้
                            </h3>
                            <p style={{ fontSize: 13, color: '#cbd5e1', maxWidth: 380, margin: '0 0 18px 0', lineHeight: 1.5 }}>
                                ปลดล็อคเนื้อหาฉบับเต็ม 150 หน้า พร้อมเข้าอ่านผ่านคลังหนังสือส่วนตัวได้ตลอดชีพ
                            </p>
                            <button
                                onClick={handleAddToCart}
                                style={{
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 28px',
                                    borderRadius: '12px',
                                    fontWeight: 800,
                                    fontSize: 14,
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8
                                }}
                            >
                                <ShoppingCart size={18} /> สั่งซื้อเพื่อปลดล็อคทันที (฿{product?.price})
                            </button>
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
