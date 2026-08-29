import { Link, useNavigate, useParams } from 'react-router-dom';
import { formatPrice, CONFIG } from '../data/products';
import { CheckCircle, Printer, ArrowLeft, Download, Truck, Star, Edit3, Palette, Lightbulb, BookOpen, ArrowRight } from 'lucide-react';
import { getOrderById, listOrders } from '../lib/ordersApi';
import { submitReview } from '../lib/reviewsApi';

import { useParams } from 'react-router-dom';

export default function Receipt() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [receipt, setReceipt] = useState(null);
    const [reviewedItems, setReviewedItems] = useState({});
    const [isReviewing, setIsReviewing] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    // Customizer States
    const [themeColor, setThemeColor] = useState('indigo'); // indigo, emerald, amber, rose, slate
    const [showLogo, setShowLogo] = useState(true);
    const [showDetails, setShowDetails] = useState(true);
    const [showStamp, setShowStamp] = useState(true);
    const [stampText, setStampText] = useState('PAID'); // PAID, APPROVED, RECEIVED
    const [customNote, setCustomNote] = useState('ขอบคุณที่ไว้วางใจเลือกซื้อคอร์สเรียนและสรุปชีทเรียนออนไลน์กับ StudyRoad');

    const themes = {
        indigo: { primary: '#4f46e5', light: '#eef2ff', text: '#312e81', border: '#c7d2fe', shadow: 'rgba(79, 70, 229, 0.1)' },
        emerald: { primary: '#059669', light: '#ecfdf5', text: '#064e3b', border: '#a7f3d0', shadow: 'rgba(5, 150, 105, 0.1)' },
        amber: { primary: '#d97706', light: '#fffbeb', text: '#78350f', border: '#fde68a', shadow: 'rgba(217, 119, 6, 0.1)' },
        rose: { primary: '#e11d48', light: '#fff1f2', text: '#4c0519', border: '#fecdd3', shadow: 'rgba(225, 29, 72, 0.1)' },
        slate: { primary: '#334155', light: '#f1f5f9', text: '#0f172a', border: '#cbd5e1', shadow: 'rgba(51, 65, 85, 0.1)' },
    };

    const currentTheme = themes[themeColor];

    useEffect(() => {
        const loadReceipt = async () => {
            if (id) {
                try {
                    const foundOrder = await getOrderById(id);
                    if (foundOrder) {
                        setReceipt(foundOrder);
                    } else {
                        navigate('/orders');
                    }
                } catch (error) {
                    console.error('Failed to load order:', error);
                    navigate('/orders');
                }
                return;
            }
            // Viewing immediately after checkout
            const data = localStorage.getItem('shopii_receipt');
            if (data) {
                setReceipt(JSON.parse(data));
                return;
            }

            try {
                const orders = await listOrders();
                if (orders.length > 0) {
                    setReceipt(orders[0]);
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error('Failed to load latest receipt:', error);
                navigate('/');
            }
        };

        loadReceipt();
    }, [navigate, id]);

    const handleDownloadPDF = async () => {
        const html2pdf = (await import('html2pdf.js')).default;
        const element = document.getElementById('invoice');
        const opt = {
            margin: 10,
            filename: `receipt-${receipt.id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    const handleOpenReview = (item) => {
        setIsReviewing(item.id);
        setRating(5);
        setComment('');
    };

    const handleSubmitReview = async (item) => {
        if (!rating || !comment.trim()) {
            alert('กรุณาให้คะแนนและพิมพ์ความคิดเห็น');
            return;
        }

        setIsSubmittingReview(true);
        try {
            await submitReview({
                order_id: receipt._dbId || receipt.id, 
                product_id: item.id,
                product_name: item.name,
                rating,
                comment,
            });

            setReviewedItems(prev => ({ ...prev, [item.id]: true }));
            setIsReviewing(null);
        } catch (error) {
            console.error(error);
            alert('บันทึกรีวิวไม่สำเร็จ');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    if (!receipt) return null;

    const { id: receiptId, date, customer, items, totals, payment, paymentMethod } = receipt;

    return (
        <div className="container">
            <div className="receipt-page-container">
                
                {/* Header Section */}
                <div className="no-print" style={{ textAlign: 'center', marginBottom: 24 }}>
                    <CheckCircle size={56} color={currentTheme.primary} style={{ marginBottom: 12 }} />
                    <h1 style={{ fontSize: 28, marginBottom: 8 }}>ขอบคุณสำหรับการสั่งซื้อ!</h1>
                    <p style={{ margin: 0 }}>เราได้รับคำสั่งซื้อของคุณเรียบร้อยแล้ว ระบบออกใบเสร็จรับเงินให้เรียบร้อยแล้ว</p>
                </div>

                {/* --- PROMINENT DRM READER ACCESS BANNER --- */}
                <div className="no-print" style={{
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    borderRadius: 16,
                    padding: '24px 32px',
                    marginBottom: 32,
                    boxShadow: '0 10px 25px rgba(5, 150, 105, 0.3)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 16
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: 12, borderRadius: 12, display: 'flex' }}>
                            <BookOpen size={32} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>
                                🎓 ชำระเงินสำเร็จแล้ว! สิทธิ์เข้าอ่านชีทสรุปในระบบพร้อมใช้งานแล้ว
                            </h3>
                            <p style={{ margin: '4px 0 0 0', fontSize: 14, opacity: 0.9 }}>
                                คุณสามารถเปิดอ่านชีทสรุปในระบบ DRM Reader แบบเต็มจอ ตีมสว่าง อ่านได้ตลอดชีพทันที
                            </p>
                        </div>
                    </div>
                    <Link
                        to={`/reader/${items && items[0] ? items[0].id : 1}`}
                        style={{
                            background: 'white',
                            color: '#047857',
                            padding: '14px 28px',
                            borderRadius: 10,
                            fontWeight: 800,
                            fontSize: 15,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            flexShrink: 0
                        }}
                    >
                        📖 เปิดอ่านชีทเรียนที่สั่งซื้อทันที <ArrowRight size={18} />
                    </Link>
                </div>

                {/* --- CUSTOMIZER PANEL --- */}
                <div className="no-print customizer-panel" style={{
                    background: 'white',
                    border: '1px solid var(--border)',
                    borderRadius: 14,
                    padding: 24,
                    marginBottom: 24,
                    boxShadow: 'var(--shadow-md)',
                }}>
                    <h3 style={{ fontSize: 16, display: 'inline-flex', alignItems: 'center', gap: 8, margin: '0 0 16px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: 10, width: '100%' }}>
                        <Palette size={18} color={currentTheme.primary} /> ตกแต่งรูปแบบใบเสร็จ / Slip Customizer
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                        {/* Theme Picker */}
                        <div>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-muted)' }}>
                                โทนสีใบเสร็จ (Themes)
                            </label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {Object.keys(themes).map(key => (
                                    <button
                                        key={key}
                                        onClick={() => setThemeColor(key)}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            background: themes[key].primary,
                                            border: themeColor === key ? '3px solid #000' : '2px solid white',
                                            boxShadow: '0 0 4px rgba(0,0,0,0.15)',
                                            cursor: 'pointer',
                                            transform: themeColor === key ? 'scale(1.1)' : 'scale(1)',
                                            transition: 'all 0.2s',
                                        }}
                                        title={key}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Visual Toggles */}
                        <div>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-muted)' }}>
                                การแสดงผลส่วนต่างๆ
                            </label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                                    <input type="checkbox" checked={showLogo} onChange={e => setShowLogo(e.target.checked)} />
                                    แสดงโลโก้แบรนด์
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                                    <input type="checkbox" checked={showDetails} onChange={e => setShowDetails(e.target.checked)} />
                                    แสดงข้อมูลติดต่อร้านค้า
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                                    <input type="checkbox" checked={showStamp} onChange={e => setShowStamp(e.target.checked)} />
                                    แสดงตรายางชำระเงิน
                                </label>
                            </div>
                        </div>

                        {/* Rubber Stamp Customizer */}
                        {showStamp && (
                            <div>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-muted)' }}>
                                    คำบนตรายางชำระเงิน
                                </label>
                                <select 
                                    value={stampText} 
                                    onChange={e => setStampText(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid var(--border)',
                                        borderRadius: 8,
                                        fontSize: 13,
                                        fontFamily: 'inherit',
                                        background: 'white'
                                    }}
                                >
                                    <option value="PAID">PAID (ชำระเงินแล้ว)</option>
                                    <option value="APPROVED">APPROVED (อนุมัติแล้ว)</option>
                                    <option value="RECEIVED">RECEIVED (ได้รับแล้ว)</option>
                                    <option value="VERIFIED">VERIFIED (ตรวจสอบแล้ว)</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Thank You Note Text Area */}
                    <div style={{ marginTop: 16 }}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-muted)' }}>
                            ข้อความขอบคุณท้ายใบเสร็จ (Custom Note)
                        </label>
                        <input
                            type="text"
                            value={customNote}
                            onChange={e => setCustomNote(e.target.value)}
                            placeholder="พิมพ์ข้อความขอบคุณท้ายบิลของคุณ..."
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                border: '1px solid var(--border)',
                                borderRadius: 8,
                                fontSize: 13,
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>
                </div>

                {/* --- RECEIPT PAPER (INVOICE CONTAINER) --- */}
                <div className="receipt-paper" id="invoice" style={{
                    borderColor: currentTheme.primary,
                    boxShadow: `0 10px 30px ${currentTheme.shadow}`,
                    overflow: 'hidden'
                }}>
                    
                    {/* --- Distressed Rubber Stamp Overlay --- */}
                    {showStamp && (
                        <div className="rubber-stamp-container" style={{
                            position: 'absolute',
                            top: 40,
                            right: 40,
                            border: `4px double ${currentTheme.primary}`,
                            color: currentTheme.primary,
                            padding: '6px 12px',
                            borderRadius: 6,
                            fontWeight: '900',
                            fontSize: 20,
                            fontFamily: '"Impact", "Arial Black", sans-serif',
                            letterSpacing: 2,
                            transform: 'rotate(-12deg) scale(1.1)',
                            opacity: 0.85,
                            textShadow: '0 0 1px rgba(0,0,0,0.05)',
                            pointerEvents: 'none',
                            background: `rgba(255, 255, 255, 0.95)`,
                            zIndex: 10,
                            boxShadow: `0 0 4px ${currentTheme.shadow}`,
                            textAlign: 'center',
                            lineHeight: 1.1
                        }}>
                            <div>{stampText}</div>
                            <div style={{ fontSize: 9, fontFamily: 'monospace', marginTop: 2, letterSpacing: 0, fontWeight: 600 }}>
                                {date}
                            </div>
                        </div>
                    )}

                    {/* Order Tracking UI */}
                    <div className="no-print" style={{ padding: '0 24px 40px 24px', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                            {/* Step 1 */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 80 }}>
                                <div style={{ width: 24, height: 24, borderRadius: '50%', background: currentTheme.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, border: '4px solid white' }}></div>
                                <span style={{ fontSize: 13, fontWeight: 600, color: currentTheme.primary }}>เตรียมจัดส่ง</span>
                            </div>

                            {/* Step 2 (Current) */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 80 }}>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: -32, left: '50%', transform: 'translateX(-50%)', color: currentTheme.primary }}>
                                        <Truck size={28} />
                                    </div>
                                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: currentTheme.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, border: '4px solid white', boxShadow: `0 0 0 4px ${currentTheme.border}` }}></div>
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 700, color: currentTheme.primary }}>กำลังขนส่ง</span>
                            </div>

                            {/* Step 3 */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 80 }}>
                                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, border: '4px solid white' }}></div>
                                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-light)' }}>จัดส่งเสร็จสิ้น</span>
                            </div>
                        </div>

                        {/* Progress Lines */}
                        <div style={{ position: 'absolute', top: 10, left: 64, right: 64, height: 4, display: 'flex', zIndex: 0 }}>
                            <div style={{ flex: 1, background: currentTheme.primary }}></div>
                            <div style={{ flex: 1, background: '#e2e8f0' }}></div>
                        </div>
                    </div>

                    {/* Receipt Invoice Header */}
                    <div className="receipt-header" style={{ borderBottomColor: currentTheme.primary }}>
                        <div>
                            <div className="receipt-title" style={{
                                borderColor: currentTheme.border,
                                color: currentTheme.primary,
                                background: currentTheme.light,
                                marginBottom: 16
                            }}>
                                ใบเสร็จรับเงิน / Receipt
                            </div>
                            {showLogo && (
                                <img src="/images/logo.png" alt="StudyRoad" style={{ height: '50px', marginBottom: '16px', borderRadius: '8px' }} />
                            )}
                            {showDetails && (
                                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                    <strong>บริษัท สตั๊ดดี้ โรด จำกัด (สำนักงานใหญ่)</strong><br />
                                    123 EdTech Tower, Digital District<br />
                                    Bangkok, 10110<br />
                                    Tax ID: 0105551234567<br />
                                    Tel: 02-123-4567 | Email: support@studyroad.com
                                </p>
                            )}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div className="meta-group">
                                <span className="meta-label">เลขที่ใบสั่งซื้อ</span>
                                <span className="meta-value" style={{ color: currentTheme.primary }}>{receiptId}</span>
                            </div>
                            <div className="meta-group">
                                <span className="meta-label">วันที่ออกบิล</span>
                                <span className="meta-value">{date}</span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info Section */}
                    <div className="customer-info" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 32, paddingBottom: 32, borderBottom: '1px dashed var(--border)' }}>
                        <div>
                            <h4 style={{ fontSize: 13, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: 10, fontWeight: 700, letterSpacing: 1 }}>ผู้ซื้อ / Bill To</h4>
                            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, color: currentTheme.text }}>{customer.name}</div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                                {customer.address}
                            </div>
                        </div>
                        <div>
                            <h4 style={{ fontSize: 13, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: 10, fontWeight: 700, letterSpacing: 1 }}>ข้อมูลบิล / Billing</h4>
                            <div style={{ fontSize: 13, marginBottom: 6 }}>
                                <span style={{ color: 'var(--text-light)', display: 'inline-block', width: 64 }}>โทร:</span>
                                <strong>{customer.phone}</strong>
                            </div>
                            <div style={{ fontSize: 13, marginBottom: 6 }}>
                                <span style={{ color: 'var(--text-light)', display: 'inline-block', width: 64 }}>อีเมล:</span>
                                {customer.email || '-'}
                            </div>
                            <div style={{ fontSize: 13, marginBottom: 6 }}>
                                <span style={{ color: 'var(--text-light)', display: 'inline-block', width: 64 }}>ช่องทาง:</span>
                                <span className="payment-badge" style={{
                                    background: currentTheme.light,
                                    color: currentTheme.text,
                                    fontWeight: 600,
                                    border: `1px solid ${currentTheme.border}`
                                }}>
                                    {payment?.method || paymentMethod}
                                </span>
                            </div>
                            {payment?.referenceNo && (
                                <div style={{ fontSize: 13 }}>
                                    <span style={{ color: 'var(--text-light)', display: 'inline-block', width: 64 }}>อ้างอิง:</span>
                                    <span style={{ fontSize: 12, fontFamily: 'monospace', background: '#f8fafc', padding: '2px 6px', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                                        {payment.referenceNo}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Receipt Items Table */}
                    <table className="receipt-table">
                        <thead>
                            <tr>
                                <th style={{ width: '50%', borderBottomColor: currentTheme.primary }}>รายการสินค้า</th>
                                <th style={{ textAlign: 'center', width: '15%', borderBottomColor: currentTheme.primary }}>จำนวน</th>
                                <th style={{ textAlign: 'right', width: '15%', borderBottomColor: currentTheme.primary }}>ราคา/หน่วย</th>
                                <th style={{ textAlign: 'right', width: '20%', borderBottomColor: currentTheme.primary }}>รวมเงิน (บาท)</th>
                            </tr>
                        </thead>
                        <tbody id="receipt-items">
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.name}</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                                            <span>รหัส: {item.id}</span>
                                            <Link 
                                                to={`/reader/${item.id}`}
                                                style={{ color: '#047857', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, background: '#dcfce7', padding: '2px 8px', borderRadius: 4, border: '1px solid #a7f3d0' }}
                                            >
                                                📖 เปิดอ่านชีทสรุปในระบบ (DRM Protected)
                                            </Link>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.quantity}</td>
                                    <td style={{ textAlign: 'right' }}>{formatPrice(item.price)}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'right', paddingTop: 20 }}>รวมเป็นเงิน</td>
                                <td style={{ textAlign: 'right', fontWeight: 600, paddingTop: 20 }}>{formatPrice(totals.subtotal)}</td>
                            </tr>
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'right' }}>ค่าจัดส่ง</td>
                                <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatPrice(totals.shipping)}</td>
                            </tr>
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'right' }}>ภาษีมูลค่าเพิ่ม (VAT 7%)</td>
                                <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatPrice(totals.subtotal * CONFIG.vatRate)}</td>
                            </tr>
                            <tr style={{ fontSize: 18 }}>
                                <td colSpan="3" style={{ textAlign: 'right', fontWeight: 700, paddingTop: 16 }}>ยอดเงินสุทธิ</td>
                                <td style={{ textAlign: 'right', fontWeight: 800, paddingTop: 16, color: currentTheme.primary }}>
                                    {formatPrice(totals.total)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    {/* Thank You / Custom Note Area */}
                    {customNote && (
                        <div style={{
                            background: currentTheme.light,
                            borderLeft: `4px solid ${currentTheme.primary}`,
                            padding: '12px 16px',
                            borderRadius: '0 8px 8px 0',
                            marginTop: 32,
                            fontSize: 13,
                            color: currentTheme.text,
                            lineHeight: 1.5,
                            textAlign: 'left'
                        }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, verticalAlign: 'middle' }}><Lightbulb size={15} /> <strong>ข้อความพิเศษ:</strong></span> {customNote}
                        </div>
                    )}

                    {/* Receipt Footer */}
                    <div className="receipt-footer" style={{ marginTop: 48, textAlign: 'center', fontSize: 12, color: 'var(--text-light)' }}>
                        <p style={{ margin: '0 0 4px 0' }}>ขอบคุณที่สนับสนุนคอร์สเรียนและสรุปชีทเรียนออนไลน์ StudyRoad</p>
                        <p style={{ margin: 0 }}>เอกสารนี้ได้รับการลงทะเบียนและออกผ่านระบบอิเล็กทรอนิกส์โดยสมบูรณ์</p>
                    </div>
                </div>

                {/* Print / Download Button Group */}
                <div className="no-print" style={{ textAlign: 'center', marginTop: 32, display: 'flex', justifyContent: 'center', gap: 16 }}>
                    <button className="btn btn-outline" onClick={() => window.print()} style={{ height: 44 }}>
                        <Printer size={18} /> พิมพ์เอกสาร
                    </button>
                    <button className="btn btn-primary" onClick={handleDownloadPDF} style={{ background: currentTheme.primary, color: 'white', height: 44 }}>
                        <Download size={18} /> ดาวน์โหลด PDF
                    </button>
                    <button className="btn btn-outline" onClick={() => navigate('/')} style={{ height: 44 }}>
                        <ArrowLeft size={18} /> กลับสู่หน้าหลัก
                    </button>
                </div>

                {/* --- รีวิวสินค้า (NO PRINT) --- */}
                <div className="no-print" style={{ marginTop: 48, borderTop: '1px solid var(--border)', paddingTop: 32 }}>
                    <h3 style={{ textAlign: 'center', marginBottom: 20, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>ให้คะแนนและรีวิวสินค้าที่คุณได้รับ <Star size={22} color="#f59e0b" fill="#f59e0b" style={{ display: 'inline-block' }} /></h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600, margin: '0 auto' }}>
                        {items?.map(item => (
                            <div key={item.id} style={{ border: '1px solid var(--border)', padding: 16, borderRadius: 12, background: 'white' }}>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                    <img src={item.image} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} alt={item.name} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>จำนวน {item.quantity} ชิ้น</div>
                                    </div>

                                    {!reviewedItems[item.id] && isReviewing !== item.id && (
                                        <button 
                                            className="btn btn-outline" 
                                            style={{ fontSize: 13, height: 32, padding: '0 12px' }}
                                            onClick={() => handleOpenReview(item)}
                                        >
                                            <Edit3 size={14} style={{ marginRight: 6 }} /> เขียนรีวิว
                                        </button>
                                    )}
                                    {reviewedItems[item.id] && (
                                        <div style={{ color: '#10b981', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <CheckCircle size={16} /> รีวิวแล้ว
                                        </div>
                                    )}
                                </div>

                                {isReviewing === item.id && (
                                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px dashed var(--border)' }}>
                                        <div style={{ marginBottom: 12 }}>
                                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>ให้คะแนนสินค้า (1-5 ดาว)</label>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button 
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                                    >
                                                        <Star size={28} color={star <= rating ? '#f59e0b' : '#e2e8f0'} fill={star <= rating ? '#f59e0b' : 'none'} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div style={{ marginBottom: 16 }}>
                                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>ความคิดเห็นของคุณ</label>
                                            <textarea 
                                                value={comment}
                                                onChange={e => setComment(e.target.value)}
                                                placeholder="บอกให้เรารู้ว่าคุณชอบสินค้านี้อย่างไร..."
                                                style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 8, padding: 12, resize: 'vertical', minHeight: 80, fontFamily: 'inherit', fontSize: 14 }}
                                            ></textarea>
                                        </div>
                                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                                            <button className="btn btn-outline" style={{ height: 36, fontSize: 14 }} onClick={() => setIsReviewing(null)}>ยกเลิก</button>
                                            <button 
                                                className="btn btn-primary" 
                                                style={{ height: 36, fontSize: 14, background: currentTheme.primary }} 
                                                disabled={isSubmittingReview}
                                                onClick={() => handleSubmitReview(item)}
                                            >
                                                {isSubmittingReview ? 'กำลังบันทึก...' : 'บันทึกรีวิว'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .meta-group { margin-bottom: 8px; }
                .meta-label { display: block; font-size: 12px; color: var(--text-light); }
                .meta-value { font-size: 16px; font-weight: 600; }
                .payment-badge { 
                    padding: 2px 8px; border-radius: 4px; font-size: 12px;
                }
                
                @media print {
                    .no-print, .customizer-panel { display: none !important; }
                    body { background: white; }
                    .container { max-width: 100%; padding: 0; margin: 0; }
                    .receipt-page-container { margin: 0; box-shadow: none; border: none; max-width: 100%; }
                    .receipt-paper { padding: 0 !important; box-shadow: none !important; border: none !important; border-radius: 0; }
                    .rubber-stamp-container { border: 4px double ${currentTheme.primary} !important; color: ${currentTheme.primary} !important; background: transparent !important; }
                    
                    header, footer, .cart-sidebar, .cart-overlay { display: none !important; }
                }
            `}</style>
        </div>
    );
}
