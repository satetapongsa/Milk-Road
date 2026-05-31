import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, CONFIG } from '../data/products';
import { FileText, Printer, ArrowLeft, Download, Wallet } from 'lucide-react';

export default function Quotation() {
    const navigate = useNavigate();
    const [quotation, setQuotation] = useState(null);

    // Customizer States
    const [themeColor, setThemeColor] = useState('indigo'); // indigo, emerald, amber, rose, slate
    const [showLogo, setShowLogo] = useState(true);
    const [showDetails, setShowDetails] = useState(true);
    const [showStamp, setShowStamp] = useState(true);
    const [stampText, setStampText] = useState('PROPOSAL'); // PROPOSAL, APPROVED, DRAFT, VERIFIED
    const [customNote, setCustomNote] = useState('ใบเสนอราคานี้ออกโดยระบบอัตโนมัติของ Pharm Road มีผลใช้ได้ตามระยะเวลาที่กำหนดด้านบน');

    const themes = {
        indigo: { primary: '#4f46e5', light: '#eef2ff', text: '#312e81', border: '#c7d2fe', shadow: 'rgba(79, 70, 229, 0.1)' },
        emerald: { primary: '#059669', light: '#ecfdf5', text: '#064e3b', border: '#a7f3d0', shadow: 'rgba(5, 150, 105, 0.1)' },
        amber: { primary: '#d97706', light: '#fffbeb', text: '#78350f', border: '#fde68a', shadow: 'rgba(217, 119, 6, 0.1)' },
        rose: { primary: '#e11d48', light: '#fff1f2', text: '#4c0519', border: '#fecdd3', shadow: 'rgba(225, 29, 72, 0.1)' },
        slate: { primary: '#334155', light: '#f1f5f9', text: '#0f172a', border: '#cbd5e1', shadow: 'rgba(51, 65, 85, 0.1)' },
    };

    const currentTheme = themes[themeColor];

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
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    if (!quotation) return null;

    const { id, date, validUntil, customer, items, totals } = quotation;

    return (
        <div className="container">
            <div className="receipt-page-container">
                
                {/* Header Section */}
                <div className="no-print" style={{ textAlign: 'center', marginBottom: 32 }}>
                    <FileText size={56} color={currentTheme.primary} style={{ marginBottom: 12 }} />
                    <h1 style={{ fontSize: 28, marginBottom: 8 }}>ใบเสนอราคาของคุณพร้อมแล้ว</h1>
                    <p style={{ margin: 0 }}>เอกสารใบเสนอราคานี้มีผลถึงวันที่ {validUntil}</p>
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
                    <h3 style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 16px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
                        🎨 ตกแต่งรูปแบบใบเสนอราคา / Quotation Customizer
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                        {/* Theme Picker */}
                        <div>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-muted)' }}>
                                โทนสีใบเสนอราคา (Themes)
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
                                    แสดงตรายางเอกสาร
                                </label>
                            </div>
                        </div>

                        {/* Rubber Stamp Customizer */}
                        {showStamp && (
                            <div>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-muted)' }}>
                                    คำบนตรายางเอกสาร
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
                                    <option value="PROPOSAL">PROPOSAL (เสนอราคา)</option>
                                    <option value="APPROVED">APPROVED (อนุมัติแล้ว)</option>
                                    <option value="DRAFT">DRAFT (ฉบับร่าง)</option>
                                    <option value="VERIFIED">VERIFIED (ตรวจสอบแล้ว)</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Thank You Note Text Area */}
                    <div style={{ marginTop: 16 }}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-muted)' }}>
                            หมายเหตุกำกับเอกสาร (Quotation Note)
                        </label>
                        <input
                            type="text"
                            value={customNote}
                            onChange={e => setCustomNote(e.target.value)}
                            placeholder="พิมพ์หมายเหตุเพิ่มเติมสำหรับใบเสนอราคานี้..."
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

                {/* --- QUOTATION PAPER --- */}
                <div className="receipt-paper" id="quotation-doc" style={{
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
                                VALID: {validUntil}
                            </div>
                        </div>
                    )}

                    <div className="receipt-header" style={{ borderBottomColor: currentTheme.primary }}>
                        <div>
                            <div className="receipt-title" style={{ 
                                borderColor: currentTheme.border, 
                                color: currentTheme.primary, 
                                background: currentTheme.light,
                                marginBottom: 16 
                            }}>
                                ใบเสนอราคา / Quotation
                            </div>
                            {showLogo && (
                                <img src="/images/logo.png" alt="Pharm Road" style={{ height: '50px', marginBottom: '16px' }} />
                            )}
                            {showDetails && (
                                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                    <strong>บริษัท ฟาร์ม โรด จำกัด (สำนักงานใหญ่)</strong><br />
                                    123 Cyber Tower, Digital District<br />
                                    Bangkok, 10110<br />
                                    Tax ID: 0105551234567<br />
                                    Tel: 02-123-4567 | Email: sales@pharmroad.com
                                </p>
                            )}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div className="meta-group">
                                <span className="meta-label">เลขที่ใบเสนอราคา</span>
                                <span className="meta-value" style={{ color: currentTheme.primary }}>{id}</span>
                            </div>
                            <div className="meta-group">
                                <span className="meta-label">วันที่ออกเอกสาร</span>
                                <span className="meta-value">{date}</span>
                            </div>
                            <div className="meta-group">
                                <span className="meta-label">ใช้ได้ถึงวันที่</span>
                                <span className="meta-value" style={{ fontWeight: 600 }}>{validUntil}</span>
                            </div>
                        </div>
                    </div>

                    <div className="customer-info" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 32, paddingBottom: 32, borderBottom: '1px dashed var(--border)' }}>
                        <div>
                            <h4 style={{ fontSize: 13, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: 10, fontWeight: 700, letterSpacing: 1 }}>ลูกค้า / Customer</h4>
                            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, color: currentTheme.text }}>
                                {customer.company ? customer.company : customer.name}
                            </div>
                            {customer.company && <div style={{ fontSize: 13, marginBottom: 4 }}>ผู้ติดต่อ: {customer.name}</div>}
                            {customer.taxId && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>เลขนิติบุคคล: {customer.taxId}</div>}
                            <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                                {customer.address}
                            </div>
                        </div>
                        <div>
                            <h4 style={{ fontSize: 13, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: 10, fontWeight: 700, letterSpacing: 1 }}>เงื่อนไขการชำระเงิน / Payment Terms</h4>
                            <div style={{ fontSize: 13, marginBottom: 8 }}>
                                <strong>เครดิต:</strong> เงินสด / โอนเงินผ่านธนาคาร
                            </div>
                            <div style={{ padding: '12px', background: currentTheme.light, borderRadius: '8px', border: `1px solid ${currentTheme.border}`, color: currentTheme.text }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, fontWeight: 600, fontSize: 14 }}>
                                    <Wallet size={16} /> ธนาคารกสิกรไทย (K-Bank)
                                </div>
                                <div style={{ fontSize: 12, color: currentTheme.text, opacity: 0.8 }}>ชื่อบัญชี: บจก. ฟาร์ม โรด เอ็นเตอร์ไพรส์</div>
                                <div style={{ fontSize: 16, fontFamily: 'monospace', marginTop: 4, fontWeight: 700 }}>123-4-56789-0</div>
                            </div>
                        </div>
                    </div>

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
                                        <div style={{ fontSize: 11, color: 'var(--text-light)' }}>รหัส: {item.id}</div>
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

                    <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ borderBottom: '1px solid #ccc', height: 40, marginBottom: 8 }}></div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>ผู้สั่งซื้อ / สั่งจ่าย</div>
                            <div style={{ fontSize: 12, marginTop: 4, color: 'var(--text-light)' }}>วันที่ .......................................</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ height: 40, marginBottom: 8, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                                <span style={{ fontFamily: 'cursive', fontSize: 18, color: currentTheme.primary }}>Somchai J.</span>
                            </div>
                            <div style={{ borderTop: '1px solid #ccc', paddingTop: 8 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>นายสมชาย จัดให้</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>ผู้ออกเอกสาร</div>
                            </div>
                        </div>
                    </div>

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
                            💡 <strong>หมายเหตุเพิ่มเติม:</strong> {customNote}
                        </div>
                    )}

                    <div className="receipt-footer" style={{ marginTop: 40, textAlign: 'center', fontSize: 12, color: 'var(--text-light)' }}>
                        <p style={{ margin: 0 }}>ขอบคุณที่ให้ความไว้วางใจเลือกซื้อยาสามัญและเวชภัณฑ์กับ Pharm Road</p>
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
            </div>

            <style>{`
                .meta-group { margin-bottom: 8px; }
                .meta-label { display: block; font-size: 12px; color: var(--text-light); }
                .meta-value { font-size: 16px; font-weight: 600; }
                
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
