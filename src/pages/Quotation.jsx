import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, CONFIG } from '../data/products';
import { FileText, Printer, ArrowLeft, Download, Wallet } from 'lucide-react';

export default function Quotation() {
    const navigate = useNavigate();
    const [quotation, setQuotation] = useState(null);

    useEffect(() => {
        const data = localStorage.getItem('shopii_quotation');
        if (data) {
            setQuotation(JSON.parse(data));
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleDownloadPDF = async () => {
        const html2pdf = (await import('html2pdf.js')).default;
        const element = document.getElementById('quotation-doc');
        const opt = {
            margin: 10,
            filename: `quotation-${quotation.id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    if (!quotation) return null;

    const { id, date, validUntil, customer, items, totals } = quotation;

    return (
        <div className="container">
            <div className="receipt-page-container">
                <div className="no-print" style={{ textAlign: 'center', marginBottom: 40 }}>
                    <FileText size={64} color="var(--primary)" style={{ marginBottom: 16 }} />
                    <h1 style={{ fontSize: 32 }}>ใบเสนอราคาของคุณพร้อมแล้ว</h1>
                    <p>เอกสารใบเสนอราคานี้มีผลถึงวันที่ {validUntil}</p>
                </div>

                <div className="receipt-paper" id="quotation-doc">
                    <div className="receipt-header">
                        <div>
                            <div className="receipt-title" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>ใบเสนอราคา / Quotation</div>
                            <h2 style={{ marginTop: 16, marginBottom: 4, color: 'var(--primary)' }}>Shopii Enterprise</h2>
                            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>
                                123 Cyber Tower, Digital District<br />
                                Bangkok, 10110<br />
                                Tax ID: 0105551234567<br />
                                Tel: 02-123-4567<br />
                                Email: sales@shopii.enterprise
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div className="meta-group">
                                <span className="meta-label">เลขที่ใบเสนอราคา</span>
                                <span className="meta-value" style={{ color: 'var(--primary)' }}>{id}</span>
                            </div>
                            <div className="meta-group">
                                <span className="meta-label">วันที่</span>
                                <span className="meta-value">{date}</span>
                            </div>
                            <div className="meta-group">
                                <span className="meta-label">ใช้ได้ถึงวันที่</span>
                                <span className="meta-value">{validUntil}</span>
                            </div>
                        </div>
                    </div>

                    <div className="customer-info" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 32, paddingBottom: 32, borderBottom: '1px dashed var(--border)' }}>
                        <div>
                            <h4 style={{ fontSize: 14, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: 12 }}>ลูกค้า / Customer</h4>
                            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
                                {customer.company ? customer.company : customer.name}
                            </div>
                            {customer.company && <div style={{ marginBottom: 4 }}>ผู้ติดต่อ: {customer.name}</div>}
                            {customer.taxId && <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>เลขนิติบุคคล: {customer.taxId}</div>}
                            <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                                {customer.address}
                            </div>
                        </div>
                        <div>
                            <h4 style={{ fontSize: 14, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: 12 }}>เงื่อนไขการชำระเงิน / Payment Terms</h4>
                            <div style={{ fontSize: 14, marginBottom: 8 }}>
                                <strong>เครดิต:</strong> เงินสด / โอนเงิน
                            </div>
                            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, fontWeight: 600, fontSize: 14 }}>
                                    <Wallet size={16} /> ธนาคารกสิกรไทย
                                </div>
                                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>ชื่อบัญชี: บจก. ช้อปปี้ เอ็นเตอร์ไพรส์</div>
                                <div style={{ fontSize: 16, fontFamily: 'monospace', marginTop: 4 }}>123-4-56789-0</div>
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

                    <div style={{ marginTop: 60, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ borderBottom: '1px solid #ccc', height: 40, marginBottom: 8 }}></div>
                            <div style={{ fontSize: 12 }}>ผู้สั่งซื้อ / สั่งจ่าย</div>
                            <div style={{ fontSize: 12, marginTop: 4 }}>วันที่ .......................................</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ height: 40, marginBottom: 8, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                                <span style={{ fontFamily: 'cursive', fontSize: 18, color: '#4f46e5' }}>Somchai J.</span>
                            </div>
                            <div style={{ borderTop: '1px solid #ccc', paddingTop: 8 }}>
                                <div style={{ fontSize: 14, fontWeight: 600 }}>นายสมชาย จัดให้</div>
                                <div style={{ fontSize: 12 }}>ผู้ออกเอกสาร</div>
                            </div>
                        </div>
                    </div>

                    <div className="receipt-footer" style={{ marginTop: 40, textAlign: 'center', fontSize: 12, color: 'var(--text-light)' }}>
                        <p>ขอบคุณที่สนใจสินค้าของเรา Shopii Enterprise</p>
                    </div>
                </div>

                <div className="no-print" style={{ textAlign: 'center', marginTop: 40, display: 'flex', justifyContent: 'center', gap: 16 }}>
                    <button className="btn btn-outline" onClick={() => window.print()}>
                        <Printer size={18} /> พิมพ์ใบเสนอราคา
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
                
                @media print {
                    .no-print { display: none !important; }
                    body { background: white; }
                    .container { max-width: 100%; padding: 0; margin: 0; }
                    .receipt-page-container { margin: 0; box-shadow: none; border: none; max-width: 100%; }
                    .receipt-paper { padding: 0; box-shadow: none; border-radius: 0; }
                    
                    header, footer, .cart-sidebar, .cart-overlay { display: none !important; }
                }
            `}</style>
        </div>
    );
}
