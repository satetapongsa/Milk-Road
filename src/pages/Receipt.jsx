import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { formatPrice, CONFIG } from '../data/products';
import { CheckCircle, Printer, ArrowLeft, Download, BookOpen, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { getOrderById, listOrders } from '../lib/ordersApi';

export default function Receipt() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [receipt, setReceipt] = useState(null);

    useEffect(() => {
        const loadReceipt = async () => {
            if (id) {
                try {
                    const foundOrder = await getOrderById(id);
                    if (foundOrder) {
                        setReceipt(foundOrder);
                    } else {
                        navigate('/account');
                    }
                } catch (error) {
                    console.error('Failed to load order:', error);
                    navigate('/account');
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
            margin: [10, 10, 10, 10],
            filename: `receipt-${receipt.id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    if (!receipt) return null;

    const { id: receiptId, date, customer, items, totals, payment, paymentMethod } = receipt;
    const firstItem = items && items[0];

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 16px' }}>
            <div style={{ maxWidth: '820px', margin: '0 auto' }}>
                
                {/* --- HEADER: SUCCESS NOTICE --- */}
                <div className="no-print" style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{
                        width: 64,
                        height: 64,
                        background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                        color: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px auto',
                        boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)'
                    }}>
                        <CheckCircle size={36} />
                    </div>
                    <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0' }}>
                        ชำระเงินและบันทึกคำสั่งซื้อสำเร็จ!
                    </h1>
                    <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>
                        ระบบได้ออกใบเสร็จรับเงินอิเล็กทรอนิกส์และเปิดสิทธิ์การเข้าอ่านตำราเรียนให้คุณเรียบร้อยแล้ว
                    </p>
                </div>

                {/* --- ACTION BAR: READ TEXTBOOK & DOWNLOAD RECEIPT --- */}
                <div className="no-print" style={{
                    background: 'white',
                    borderRadius: 16,
                    padding: '20px 24px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 16,
                    marginBottom: 24
                }}>
                    <Link
                        to={`/reader/${firstItem ? firstItem.id : 1}`}
                        style={{
                            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: 10,
                            fontWeight: 800,
                            fontSize: 14,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)'
                        }}
                    >
                        <BookOpen size={18} /> เปิดอ่านตำราเรียนทันที <ArrowRight size={16} />
                    </Link>

                    <div style={{ display: 'flex', gap: 10 }}>
                        <button 
                            onClick={handleDownloadPDF}
                            style={{
                                background: '#ffffff',
                                border: '1px solid #3b82f6',
                                color: '#1d4ed8',
                                padding: '12px 20px',
                                borderRadius: 10,
                                fontSize: 14,
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                boxShadow: '0 2px 6px rgba(59, 130, 246, 0.15)'
                            }}
                        >
                            <Download size={16} /> ดาวน์โหลด PDF
                        </button>

                        <button 
                            onClick={() => window.print()}
                            style={{
                                background: '#f8fafc',
                                border: '1px solid #cbd5e1',
                                color: '#475569',
                                padding: '12px 18px',
                                borderRadius: 10,
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6
                            }}
                        >
                            <Printer size={16} /> พิมพ์บิล
                        </button>

                        <button 
                            onClick={() => navigate('/')}
                            style={{
                                background: '#ffffff',
                                border: '1px solid #cbd5e1',
                                color: '#475569',
                                padding: '12px 18px',
                                borderRadius: 10,
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6
                            }}
                        >
                            <ArrowLeft size={16} /> หน้าแรก
                        </button>
                    </div>
                </div>

                {/* --- CLEAN PROFESSIONAL INVOICE PAPER --- */}
                <div id="invoice" style={{
                    background: '#ffffff',
                    borderRadius: 16,
                    padding: '48px 52px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                    position: 'relative'
                }}>
                    
                    {/* Invoice Top Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #3b82f6', paddingBottom: 24, marginBottom: 28 }}>
                        <div>
                            <img src="/images/logo.png" alt="StudyRoad" style={{ height: 42, marginBottom: 12, borderRadius: 6 }} />
                            <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                                <strong style={{ color: '#0f172a', fontSize: 14 }}>บริษัท สตั๊ดดี้ โรด จำกัด (StudyRoad Co., Ltd.)</strong><br />
                                123 EdTech Tower, Digital Learning Center, Bangkok 10110<br />
                                เลขประจำตัวผู้เสียภาษี: 0105551234567 | อีเมล: contact@studyroad.com
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 800, display: 'inline-block', marginBottom: 10 }}>
                                ใบเสร็จรับเงิน / RECEIPT
                            </div>
                            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>
                                เลขที่เอกสาร: <strong style={{ color: '#0f172a', fontFamily: 'monospace', fontSize: 15 }}>{receiptId}</strong>
                            </div>
                            <div style={{ fontSize: 13, color: '#64748b' }}>
                                วันที่ออกเอกสาร: <strong style={{ color: '#0f172a' }}>{date}</strong>
                            </div>
                        </div>
                    </div>

                    {/* Customer & Billing Info Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, background: '#f8fafc', padding: '20px 24px', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 28 }}>
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
                                ข้อมูลลูกค้า (Customer Details)
                            </div>
                            <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                                {customer?.name || 'ลูกค้าทั่วไป'}
                            </div>
                            <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                                📞 เบอร์ติดต่อ: {customer?.phone || '-'}<br />
                                ✉️ อีเมล: {customer?.email || '-'}
                            </div>
                        </div>

                        <div>
                            <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
                                ข้อมูลการชำระเงิน (Payment Details)
                            </div>
                            <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.8 }}>
                                ช่องทาง: <strong style={{ color: '#0f172a' }}>{payment?.method || paymentMethod || 'PromptPay QR'}</strong><br />
                                สถานะ: <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: 4, fontWeight: 700, fontSize: 12 }}>ชำระเงินเรียบร้อย (PAID)</span><br />
                                {payment?.referenceNo && (
                                    <span>เลขอ้างอิง: <code style={{ color: '#475569', fontSize: 12 }}>{payment.referenceNo}</code></span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Purchased Items Table */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24, fontSize: 14 }}>
                        <thead>
                            <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#334155', fontWeight: 800 }}>รายการตำราเรียนออนไลน์</th>
                                <th style={{ padding: '12px 16px', textAlign: 'center', width: '15%', color: '#334155', fontWeight: 800 }}>จำนวน</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right', width: '20%', color: '#334155', fontWeight: 800 }}>ราคา/หน่วย</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right', width: '20%', color: '#334155', fontWeight: 800 }}>จำนวนเงิน (บาท)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(items || []).map((item, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ fontWeight: 800, color: '#0f172a' }}>{item.name}</div>
                                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                                            รหัสวิชา: {item.id} • สิทธิ์เข้าอ่านตำราเรียน 20 หน้าตลอดชีพ
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 600, color: '#334155' }}>
                                        {item.quantity}
                                    </td>
                                    <td style={{ padding: '14px 16px', textAlign: 'right', color: '#334155' }}>
                                        {formatPrice(item.price)}
                                    </td>
                                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>
                                        {formatPrice(item.price * item.quantity)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'right', padding: '16px 16px 6px 16px', color: '#64748b', fontWeight: 600 }}>รวมมูลค่าสินค้า:</td>
                                <td style={{ textAlign: 'right', padding: '16px 16px 6px 16px', fontWeight: 700, color: '#0f172a' }}>{formatPrice(totals?.subtotal || 0)}</td>
                            </tr>
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'right', padding: '6px 16px', color: '#64748b', fontWeight: 600 }}>ค่าธรรมเนียมระบบ / จัดส่ง:</td>
                                <td style={{ textAlign: 'right', padding: '6px 16px', fontWeight: 700, color: '#0f172a' }}>{formatPrice(totals?.shipping || 0)}</td>
                            </tr>
                            <tr style={{ borderTop: '2px solid #3b82f6', fontSize: 16 }}>
                                <td colSpan="3" style={{ textAlign: 'right', padding: '14px 16px', fontWeight: 900, color: '#0f172a' }}>ยอดชำระสุทธิทั้งสิ้น:</td>
                                <td style={{ textAlign: 'right', padding: '14px 16px', fontWeight: 900, color: '#1d4ed8', fontSize: 20 }}>
                                    {formatPrice(totals?.total || 0)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    {/* Bank Slip Attachment Preview (If present) */}
                    {payment?.slipImage && (
                        <div style={{ marginTop: 24, padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 10 }}>
                                📄 หลักฐานสลิปการโอนเงินที่แนบ (Attached Bank Slip)
                            </div>
                            <img 
                                src={payment.slipImage} 
                                alt="Bank Transfer Slip" 
                                style={{ maxHeight: 220, maxWidth: '100%', borderRadius: 8, border: '1px solid #cbd5e1' }}
                            />
                        </div>
                    )}

                    {/* Invoice Footer Note */}
                    <div style={{ marginTop: 36, borderTop: '1px dashed #cbd5e1', paddingTop: 20, textAlign: 'center', fontSize: 12, color: '#64748b' }}>
                        <p style={{ margin: '0 0 4px 0', fontWeight: 600, color: '#334155' }}>
                            ขอบคุณที่เลือกศึกษาและสั่งซื้อตำราเรียนออนไลน์กับ StudyRoad
                        </p>
                        <p style={{ margin: 0 }}>
                            เอกสารอิเล็กทรอนิกส์นี้ออกโดยระบบอัตโนมัติ ถูกต้องและสมบูรณ์ตามมาตรฐานระบบการศึกษา
                        </p>
                    </div>
                </div>

            </div>

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; }
                    #invoice { box-shadow: none !important; border: none !important; padding: 0 !important; }
                }
            `}</style>
        </div>
    );
}
