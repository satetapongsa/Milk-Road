import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, CONFIG } from '../data/products';
import { CheckCircle, Printer, ArrowLeft, Download, Truck, Star, Edit3 } from 'lucide-react';
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
            html2canvas: { scale: 2 },
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
                order_id: receipt._dbId || receipt.id, // Ensure we send the DB UUID if available, fallback to text ID logic won't work cleanly unless db UUID. ordersApi returns _dbId.
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
                <div className="no-print" style={{ textAlign: 'center', marginBottom: 40 }}>
                    <CheckCircle size={64} color="var(--primary)" style={{ marginBottom: 16 }} />
                    <h1 style={{ fontSize: 32 }}>ขอบคุณสำหรับการสั่งซื้อ!</h1>
                    <p>เราได้รับคำสั่งซื้อของคุณเรียบร้อยแล้ว</p>
                </div>

                <div className="receipt-paper" id="invoice">
                    {/* Order Tracking UI */}
                    <div className="no-print" style={{ padding: '0 24px 40px 24px', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                            {/* Step 1 */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 80 }}>
                                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, border: '4px solid white' }}></div>
                                <span style={{ fontSize: 13, fontWeight: 600, color: '#f59e0b' }}>เตรียมจัดส่ง</span>
                            </div>

                            {/* Step 2 (Current) */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 80 }}>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: -32, left: '50%', transform: 'translateX(-50%)', color: '#f59e0b' }}>
                                        <Truck size={28} />
                                    </div>
                                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, border: '4px solid white', boxShadow: '0 0 0 4px rgba(245, 158, 11, 0.2)' }}></div>
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>กำลังขนส่ง</span>
                            </div>

                            {/* Step 3 */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 80 }}>
                                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, border: '4px solid white' }}></div>
                                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-light)' }}>จัดส่งเสร็จสิ้น</span>
                            </div>
                        </div>

                        {/* Progress Lines */}
                        <div style={{ position: 'absolute', top: 10, left: 64, right: 64, height: 4, display: 'flex', zIndex: 0 }}>
                            <div style={{ flex: 1, background: '#f59e0b' }}></div>
                            <div style={{ flex: 1, background: '#e2e8f0' }}></div>
                        </div>
                    </div>
                    <div className="receipt-header">
                        <div>
                            <div className="receipt-title" style={{ marginBottom: 16 }}>ใบเสร็จรับเงิน / Receipt</div>
                            <img src="/images/logo.png" alt="Milk Road" style={{ height: '50px', marginBottom: '16px' }} />
                            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>
                                123 Cyber Tower, Digital District<br />
                                Bangkok, 10110<br />
                                Tax ID: 0105551234567
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div className="meta-group">
                                <span className="meta-label">เลขที่คำสั่งซื้อ</span>
                                <span className="meta-value">{receiptId}</span>
                            </div>
                            <div className="meta-group">
                                <span className="meta-label">วันที่</span>
                                <span className="meta-value">{date}</span>
                            </div>
                        </div>
                    </div>

                    <div className="customer-info" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 32, paddingBottom: 32, borderBottom: '1px dashed var(--border)' }}>
                        <div>
                            <h4 style={{ fontSize: 14, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: 12 }}>ผู้ซื้อ / Bill To</h4>
                            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{customer.name}</div>
                            <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                                {customer.address}
                            </div>
                        </div>
                        <div>
                            <h4 style={{ fontSize: 14, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: 12 }}>ข้อมูลติดต่อ / Contact</h4>
                            <div style={{ fontSize: 14, marginBottom: 8 }}>
                                <span style={{ color: 'var(--text-light)', display: 'inline-block', width: 60 }}>โทร:</span>
                                {customer.phone}
                            </div>
                            <div style={{ fontSize: 14, marginBottom: 8 }}>
                                <span style={{ color: 'var(--text-light)', display: 'inline-block', width: 60 }}>อีเมล:</span>
                                {customer.email}
                            </div>
                            <div style={{ fontSize: 14 }}>
                                <span style={{ color: 'var(--text-light)', display: 'inline-block', width: 60 }}>ชำระโดย:</span>
                                <span className="payment-badge">
                                    {payment?.method || paymentMethod}
                                </span>
                            </div>
                            {payment?.referenceNo && (
                                <div style={{ fontSize: 14, marginTop: 8 }}>
                                    <span style={{ color: 'var(--text-light)', display: 'inline-block', width: 60 }}>อ้างอิง:</span>
                                    <span style={{ fontSize: 13, fontFamily: 'monospace' }}>{payment.referenceNo}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <table className="receipt-table">
                        <thead>
                            <tr>
                                <th style={{ width: '50%' }}>รายการสินค้า</th>
                                <th style={{ textAlign: 'center', width: '15%' }}>จำนวน</th>
                                <th style={{ textAlign: 'right', width: '15%' }}>ราคา/หน่วย</th>
                                <th style={{ textAlign: 'right', width: '20%' }}>รวม</th>
                            </tr>
                        </thead>
                        <tbody id="receipt-items">
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{item.name}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-light)' }}>รหัส: {item.id}</div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                    <td style={{ textAlign: 'right' }}>{formatPrice(item.price)}</td>
                                    <td style={{ textAlign: 'right' }}>{formatPrice(item.price * item.quantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'right', paddingTop: 24 }}>รวมเป็นเงิน</td>
                                <td style={{ textAlign: 'right', paddingTop: 24 }}>{formatPrice(totals.subtotal)}</td>
                            </tr>
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'right' }}>ค่าจัดส่ง</td>
                                <td style={{ textAlign: 'right' }}>{formatPrice(totals.shipping)}</td>
                            </tr>
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'right' }}>ภาษีมูลค่าเพิ่ม (7%)</td>
                                <td style={{ textAlign: 'right' }}>{formatPrice(totals.subtotal * CONFIG.vatRate)}</td>
                            </tr>
                            <tr style={{ fontSize: 20 }}>
                                <td colSpan="3" style={{ textAlign: 'right', fontWeight: 700, paddingTop: 16, color: 'var(--secondary)' }}>ยอดสุทธิ</td>
                                <td style={{ textAlign: 'right', fontWeight: 700, paddingTop: 16, color: 'var(--primary)' }}>{formatPrice(totals.total)}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="receipt-footer" style={{ marginTop: 60, textAlign: 'center', fontSize: 12, color: 'var(--text-light)' }}>
                        <p>ขอบคุณที่ใช้บริการ Milk Road</p>
                        <p>เอกสารนี้ออกโดยระบบอัตโนมัติ</p>
                    </div>
                </div>

                <div className="no-print" style={{ textAlign: 'center', marginTop: 40, display: 'flex', justifyContent: 'center', gap: 16 }}>
                    <button className="btn btn-outline" onClick={() => window.print()}>
                        <Printer size={18} /> พิมพ์ใบเสร็จ
                    </button>
                    <button className="btn btn-primary" onClick={handleDownloadPDF}>
                        <Download size={18} /> ดาวน์โหลด PDF
                    </button>
                    <button className="btn btn-outline" onClick={() => navigate('/')}>
                        <ArrowLeft size={18} /> กลับสู่หน้าหลัก
                    </button>
                </div>

                {/* --- รีวิวสินค้า (NO PRINT) --- */}
                <div className="no-print" style={{ marginTop: 60, borderTop: '1px solid var(--border)', paddingTop: 40 }}>
                    <h3 style={{ textAlign: 'center', marginBottom: 24, fontSize: 24 }}>รีวิวสินค้าที่คุณได้รับ ⭐️</h3>
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
                                                style={{ height: 36, fontSize: 14 }} 
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
                .meta-value { font-size: 16px; fontWeight: 600; }
                .payment-badge { 
                    background: #f1f5f9; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;
                }
                
                @media print {
                    .no-print { display: none !important; }
                    body { background: white; }
                    .container { max-width: 100%; padding: 0; margin: 0; }
                    .receipt-page-container { margin: 0; box-shadow: none; border: none; max-width: 100%; }
                    .receipt-paper { padding: 0; box-shadow: none; border-radius: 0; }
                    
                    /* Hide header/footer from Layout if possible, or use global print styles */
                    header, footer, .cart-sidebar, .cart-overlay { display: none !important; }
                }
            `}</style>
        </div>
    );
}
