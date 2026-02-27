import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, CONFIG } from '../data/products';
import { CheckCircle, Printer, ArrowLeft, Download, Truck } from 'lucide-react';

import { useParams } from 'react-router-dom';

export default function Receipt() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [receipt, setReceipt] = useState(null);

    useEffect(() => {
        if (id) {
            // Viewing from history
            const orders = JSON.parse(localStorage.getItem('shopii_orders') || '[]');
            const foundOrder = orders.find(o => o.id === id);
            if (foundOrder) {
                setReceipt(foundOrder);
            } else {
                navigate('/orders');
            }
        } else {
            // Viewing immediately after checkout
            const data = localStorage.getItem('shopii_receipt');
            if (data) {
                setReceipt(JSON.parse(data));
            } else {
                navigate('/');
            }
        }
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

    if (!receipt) return null;

    const { id: receiptId, date, customer, items, totals, paymentMethod } = receipt;

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
                            <div className="receipt-title">ใบเสร็จรับเงิน / Receipt</div>
                            <h2 style={{ marginTop: 16, marginBottom: 4, color: 'var(--primary)' }}>Milk Road</h2>
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
                                <span className="payment-badge">{paymentMethod}</span>
                            </div>
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
