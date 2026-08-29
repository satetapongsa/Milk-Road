import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, CONFIG } from '../data/products';
import { CreditCard, Truck, Loader, QrCode, Smartphone, Lock, Lightbulb } from 'lucide-react';
import PromptPayPayment from '../components/PromptPayPayment';
import { createOrder } from '../lib/ordersApi';
import { API_BASE } from '../config';

export default function Checkout() {
    const { cart, subtotal, total, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('promptpay'); // Exclusive PromptPay QR Payment
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    // Credit Card Inputs States for Live Sync Card Preview
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');

    // Shipping Defaults States
    const [custName, setCustName] = useState('');
    const [custPhone, setCustPhone] = useState('');
    const [custEmail, setCustEmail] = useState('');
    const [custAddress, setCustAddress] = useState('');
    const [custSubdistrict, setCustSubdistrict] = useState('');
    const [custDistrict, setCustDistrict] = useState('');
    const [custProvince, setCustProvince] = useState('');
    const [custZipcode, setCustZipcode] = useState('');

    const [slipImage, setSlipImage] = useState(null);

    useEffect(() => {
        if (cart.length === 0 && !isSubmitted) {
            navigate('/');
        }
    }, [cart, navigate, isSubmitted]);

    const handleCardNumberChange = (e) => {
        let val = e.target.value.replace(/\s?/g, '').replace(/[^0-9]/g, '');
        if (val.length > 16) val = val.substring(0, 16);
        let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
        setCardNumber(formatted);
    };

    const handleExpiryChange = (e) => {
        let val = e.target.value.replace(/[^0-9]/g, '');
        if (val.length > 4) val = val.substring(0, 4);
        if (val.length > 2) {
            setCardExpiry(val.substring(0, 2) + '/' + val.substring(2));
        } else {
            setCardExpiry(val);
        }
    };

    const handleCvvChange = (e) => {
        let val = e.target.value.replace(/[^0-9]/g, '');
        if (val.length > 3) val = val.substring(0, 3);
        setCardCvv(val);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setLoading(true);
        setSimulationStep('processing');

        // 1. Simulate 2.5 seconds payment processing check
        await new Promise((resolve) => setTimeout(resolve, 2500));

        // 2. Change to green success screen
        setSimulationStep('success');

        // 3. Wait another 1 second on success screen
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Fallback billing defaults if user leaves them empty
        const finalName = custName.trim() || 'ลูกค้าทั่วไป (จำลอง)';
        const finalPhone = custPhone.trim() || '081-234-5678';
        const finalEmail = custEmail.trim() || 'customer@example.com';
        const finalAddress = [
            custAddress.trim() || 'กรุงเทพมหานคร (ชำระเงินจำลอง)',
            custSubdistrict.trim(),
            custDistrict.trim(),
            custProvince.trim(),
            custZipcode.trim()
        ].filter(Boolean).join(' ');

        try {
            const timestamp = new Date().toISOString();
            
            // Format payment method display text
            let finalPaymentMethod = 'ชำระเงินปลายทาง';
            if (paymentMethod === 'credit') finalPaymentMethod = 'บัตรเครดิต/เดบิต';
            if (paymentMethod === 'promptpay') finalPaymentMethod = 'PromptPay';

            const receipt = {
                id: 'INV-' + Date.now().toString().slice(-6),
                date: new Date().toLocaleDateString('th-TH'),
                customer: {
                    name: finalName,
                    phone: finalPhone,
                    email: finalEmail,
                    address: finalAddress
                },
                items: cart,
                totals: {
                    subtotal: subtotal,
                    shipping: CONFIG.shippingCost,
                    total: total
                },
                payment: {
                    method: finalPaymentMethod,
                    timestamp,
                    slipImage: slipImage || null,
                    referenceNo: paymentMethod === 'credit' ? 'TXN-' + Date.now().toString().slice(-8).toUpperCase() : 'REF-' + Date.now().toString().slice(-8).toUpperCase()
                },
                status: paymentMethod === 'cod' ? 'Pending' : 'Completed',
                admin: {
                    note: 'สั่งซื้อจำลองแบบไม่ต้องกรอกข้อมูลครบถ้วน',
                    trackingNo: ''
                }
            };

            let savedOrder = null;
            try {
                savedOrder = await createOrder(receipt);
            } catch (createErr) {
                console.warn('Backend order creation notice, using local receipt:', createErr);
            }

            const finalReceipt = savedOrder || receipt;

            localStorage.setItem('shopii_receipt', JSON.stringify(finalReceipt));
            
            // Save order ID to local history
            try {
                const myOrders = JSON.parse(localStorage.getItem('my_order_ids') || '[]');
                if (!myOrders.includes(finalReceipt.id)) {
                    myOrders.push(finalReceipt.id);
                }
                localStorage.setItem('my_order_ids', JSON.stringify(myOrders));
            } catch (e) {}
            
            clearCart();
            setIsSubmitted(true);
            navigate('/receipt');
        } catch (error) {
            console.error('Failed during checkout workflow:', error);
            // Fallback emergency navigation so user NEVER gets blocked!
            localStorage.setItem('shopii_receipt', JSON.stringify({
                id: 'INV-' + Date.now().toString().slice(-6),
                date: new Date().toLocaleDateString('th-TH'),
                customer: { name: custName || 'ลูกค้าทั่วไป', phone: custPhone || '081-501-8272', email: custEmail || '', address: custAddress || '' },
                items: cart,
                totals: { subtotal, shipping: CONFIG.shippingCost, total },
                payment: { method: 'PromptPay', timestamp: new Date().toISOString(), referenceNo: 'REF-' + Date.now().toString().slice(-8).toUpperCase() },
                status: 'Completed'
            }));
            clearCart();
            setIsSubmitted(true);
            navigate('/receipt');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0 && !isSubmitted) return null;

    return (
        <div className="container" style={{ paddingBottom: 64 }}>
            
            {/* --- SIMULATION FULL SCREEN OVERLAY --- */}
            {simulationStep !== 'none' && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontFamily: 'var(--font-main)',
                    textAlign: 'center',
                    padding: 24,
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    {simulationStep === 'processing' && (
                        <div style={{ animation: 'slideUp 0.4s ease-out' }}>
                            <div className="payment-spinner" style={{
                                width: 72,
                                height: 72,
                                border: '5px solid rgba(255, 255, 255, 0.1)',
                                borderTop: '5px solid #4f46e5',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto 24px auto'
                            }}></div>
                            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f8fafc', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                                <Lock size={24} /> กำลังเข้ารหัสและประมวลผลชำระเงิน...
                            </h2>
                            <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 440, margin: '0 auto' }}>
                                ระบบกำลังเชื่อมต่อเกตเวย์การชำระเงินอย่างปลอดภัยผ่าน SSL 256-bit กรุณาอย่าปิดหน้าต่างนี้...
                            </p>
                        </div>
                    )}

                    {simulationStep === 'success' && (
                        <div style={{ animation: 'bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                            <div style={{
                                width: 84,
                                height: 84,
                                borderRadius: '50%',
                                background: '#4f46e5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px auto',
                                boxShadow: '0 0 30px rgba(79, 70, 229, 0.4)'
                            }}>
                                <CheckCircle2 size={48} color="#ffffff" />
                            </div>
                            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#6366f1', marginBottom: 12 }}>
                                ชำระเงินสำเร็จเสร็จสิ้น!
                            </h2>
                            <p style={{ color: '#e2e8f0', fontSize: 16, marginBottom: 8 }}>
                                ยอดชำระ {formatPrice(total)} ได้รับการอนุมัติแล้ว
                            </p>
                            <p style={{ color: '#94a3b8', fontSize: 13 }}>
                                ระบบกำลังนำคุณไปยังหน้าใบเสร็จรับเงินอิเล็กทรอนิกส์...
                            </p>
                        </div>
                    )}

                    <style>{`
                        @keyframes spin { 100% { transform: rotate(360deg); } }
                        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                        @keyframes bounceIn {
                            0% { transform: scale(0.3); opacity: 0; }
                            50% { transform: scale(1.05); opacity: 0.8; }
                            70% { transform: scale(0.9); opacity: 0.9; }
                            100% { transform: scale(1); opacity: 1; }
                        }
                    `}</style>
                </div>
            )}

            <div className="checkout-page-container" style={{ marginTop: 32 }}>
                <form id="shipping-form" onSubmit={handleSubmit} className="checkout-grid" style={{ gap: 0 }}>
                    
                    {/* Left: Input details */}
                    <div className="checkout-section" style={{ padding: '40px 32px' }}>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, borderBottom: '1px solid #f1f5f9', paddingBottom: 16 }}>
                            <Truck size={24} color="#4f46e5" />
                            <h2 style={{ fontSize: 20, margin: 0, fontWeight: 700 }}>ที่อยู่จัดส่งสินค้า</h2>
                            <span style={{ fontSize: 11, background: '#eef2ff', color: '#4f46e5', padding: '2px 8px', borderRadius: 999, fontWeight: 600, marginLeft: 'auto' }}>
                                จำลอง - ไม่ต้องกรอกครบก็ได้
                            </span>
                        </div>

                        {/* Customer details fields (No required!) */}
                        <div className="form-group">
                            <label style={{ fontSize: 13, fontWeight: 600 }}>ชื่อ-นามสกุลผู้รับ</label>
                            <input 
                                type="text" 
                                value={custName}
                                onChange={e => setCustName(e.target.value)}
                                placeholder="เช่น นายสมชาย ใจดี (เว้นว่างได้)" 
                                style={{ height: 44, borderRadius: 8 }}
                            />
                        </div>

                        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600 }}>เบอร์โทรศัพท์</label>
                                <input 
                                    type="tel" 
                                    value={custPhone}
                                    onChange={e => setCustPhone(e.target.value)}
                                    placeholder="เช่น 089-xxx-xxxx" 
                                    style={{ height: 44, borderRadius: 8 }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600 }}>อีเมลผู้ติดต่อ</label>
                                <input 
                                    type="email" 
                                    value={custEmail}
                                    onChange={e => setCustEmail(e.target.value)}
                                    placeholder="เช่น customer@domain.com" 
                                    style={{ height: 44, borderRadius: 8 }}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label style={{ fontSize: 13, fontWeight: 600 }}>ที่อยู่จัดส่ง (บ้านเลขที่, ถนน, ซอย)</label>
                            <textarea 
                                value={custAddress}
                                onChange={e => setCustAddress(e.target.value)}
                                rows="2" 
                                placeholder="ระบุบ้านเลขที่และชื่อถนน..."
                                style={{ borderRadius: 8, padding: 12 }}
                            ></textarea>
                        </div>

                        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600 }}>ตำบล / แขวง</label>
                                <input 
                                    type="text" 
                                    value={custSubdistrict}
                                    onChange={e => setCustSubdistrict(e.target.value)}
                                    placeholder="เช่น สามเสนใน" 
                                    style={{ height: 44, borderRadius: 8 }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600 }}>อำเภอ / เขต</label>
                                <input 
                                    type="text" 
                                    value={custDistrict}
                                    onChange={e => setCustDistrict(e.target.value)}
                                    placeholder="เช่น พญาไท" 
                                    style={{ height: 44, borderRadius: 8 }}
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600 }}>จังหวัด</label>
                                <input 
                                    type="text" 
                                    value={custProvince}
                                    onChange={e => setCustProvince(e.target.value)}
                                    placeholder="เช่น กรุงเทพมหานคร" 
                                    style={{ height: 44, borderRadius: 8 }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600 }}>รหัสไปรษณีย์</label>
                                <input 
                                    type="text" 
                                    value={custZipcode}
                                    onChange={e => setCustZipcode(e.target.value)}
                                    placeholder="เช่น 10400" 
                                    style={{ height: 44, borderRadius: 8 }}
                                />
                            </div>
                        </div>

                        {/* Exclusive Payment Selection Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 40, marginBottom: 20, borderBottom: '1px solid #f1f5f9', paddingBottom: 16 }}>
                            <QrCode size={24} color="#4f46e5" />
                            <h2 style={{ fontSize: 20, margin: 0, fontWeight: 700 }}>ช่องทางการชำระเงิน: สแกน PromptPay QR Code</h2>
                        </div>

                        {/* EXCLUSIVE PROMPTPAY QR PAYMENT CARD */}
                        <div style={{ background: '#f8fafc', padding: 24, borderRadius: 16, border: '2px solid #6366f1', textAlign: 'center', marginBottom: 24, boxShadow: '0 4px 14px rgba(99, 102, 241, 0.08)' }}>
                            <PromptPayPayment 
                                total={total}
                                phoneNumber="0815018272"
                                onSlipUpload={(uploadedSlip) => {
                                    setSlipImage(uploadedSlip);
                                }}
                                onPaymentComplete={(data) => {
                                    setPaymentMethod('promptpay');
                                    if (data?.slipImage) setSlipImage(data.slipImage);
                                }}
                            />
                        </div>
                    </div>

                    {/* Right: Cart Summary and Submit button */}
                    <div className="checkout-summary" style={{ padding: '40px 32px', background: '#f8fafc', borderLeft: '1px solid var(--border)' }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
                            สรุปยอดคำสั่งซื้อ
                        </h3>
                        
                        <div style={{ flexGrow: 1, overflowY: 'auto', maxHeight: '320px', marginBottom: 20, paddingRight: 4 }}>
                            {(cart.length > 0 ? cart : []).map(item => (
                                <div className="summary-item" key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <img src={item.image} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid #e2e8f0' }} alt={item.name} />
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{item.name}</div>
                                            <small style={{ color: 'var(--text-light)' }}>จำนวน x{item.quantity}</small>
                                        </div>
                                    </div>
                                    <strong style={{ fontSize: 14, color: '#1e293b' }}>{formatPrice(item.price * item.quantity)}</strong>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: 16, marginBottom: 16 }}>
                            <div className="summary-row" style={{ fontSize: 13, marginBottom: 10 }}>
                                <span style={{ color: '#64748b' }}>รวมมูลค่าสินค้า</span>
                                <span style={{ color: '#1e293b', fontWeight: 600 }}>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="summary-row" style={{ fontSize: 13, marginBottom: 10 }}>
                                <span style={{ color: '#64748b' }}>ค่าจัดส่งด่วน</span>
                                <span style={{ color: '#1e293b', fontWeight: 600 }}>{formatPrice(CONFIG.shippingCost)}</span>
                            </div>
                            <div className="summary-row total" style={{ borderTop: '1px solid #cbd5e1', paddingTop: 16, marginTop: 12 }}>
                                <span style={{ fontWeight: 700, color: '#0f172a' }}>ยอดสุทธิรวมทั้งสิ้น</span>
                                <span style={{ fontSize: 24, fontWeight: 800, color: '#4f46e5' }}>{formatPrice(total)}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block confirm-btn"
                            disabled={loading}
                            style={{
                                marginTop: 12,
                                height: 50,
                                fontSize: 16,
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                                borderRadius: 10,
                                cursor: 'pointer'
                            }}
                        >
                            {paymentMethod === 'credit' ? 'ยืนยันชำระเงินผ่านบัตร' : paymentMethod === 'promptpay' ? 'ยืนยันโอนพร้อมเพย์' : 'ยืนยันสั่งซื้อสินค้า'}
                        </button>
                        
                        <p style={{ fontSize: 11, color: '#64748b', textAlign: 'center', marginTop: 16, lineHeight: 1.4 }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, verticalAlign: 'middle' }}><Lock size={12} /> ระบบเชื่อมต่อความปลอดภัย SSL แบบ 256-bit</span><br />
                            ข้อมูลจำลองเพื่อวัตถุประสงค์ในการสาธิตและทดลองเท่านั้น
                        </p>
                    </div>
                </form>
            </div>

            <style>{`
                .checkout-page-container {
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: var(--shadow-lg);
                    border: 1px solid var(--border);
                }
                .checkout-grid {
                    display: grid;
                    grid-template-columns: 1.4fr 1fr;
                }
                @media (max-width: 900px) {
                    .checkout-grid {
                        grid-template-columns: 1fr;
                    }
                    .checkout-summary {
                        border-left: none !important;
                        border-top: 1px solid var(--border) !important;
                    }
                }
                .fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
