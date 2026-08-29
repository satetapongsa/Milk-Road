import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, CONFIG } from '../data/products';
import { CreditCard, Truck, Loader, QrCode, Smartphone, Lock, Lightbulb } from 'lucide-react';
import PromptPayPayment from '../components/PromptPayPayment';
import { createOrder } from '../lib/ordersApi';

export default function Checkout() {
    const { cart, subtotal, total, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('credit'); // default to credit card for premium feel
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

    // Payment Simulation States
    const [simulationStep, setSimulationStep] = useState('none'); // none, processing, success

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
                    referenceNo: paymentMethod === 'credit' ? 'TXN-' + Date.now().toString().slice(-8).toUpperCase() : 'REF-' + Date.now().toString().slice(-8).toUpperCase()
                },
                status: paymentMethod === 'cod' ? 'Pending' : 'Completed',
                admin: {
                    note: 'สั่งซื้อจำลองแบบไม่ต้องกรอกข้อมูลครบถ้วน',
                    trackingNo: ''
                }
            };

            const savedOrder = await createOrder(receipt);
            localStorage.setItem('shopii_receipt', JSON.stringify(savedOrder || receipt));
            
            // Save order ID to local history
            const myOrders = JSON.parse(localStorage.getItem('my_order_ids') || '[]');
            myOrders.push((savedOrder || receipt).id);
            localStorage.setItem('my_order_ids', JSON.stringify(myOrders));
            
            clearCart();
            setIsSubmitted(true);
            navigate('/receipt');
        } catch (error) {
            console.error('Failed to create order:', error);
            alert('ไม่สามารถบันทึกคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง');
            setSimulationStep('none');
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

                        {/* Payment Selection Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 40, marginBottom: 20, borderBottom: '1px solid #f1f5f9', paddingBottom: 16 }}>
                            <CreditCard size={24} color="#4f46e5" />
                            <h2 style={{ fontSize: 20, margin: 0, fontWeight: 700 }}>เลือกช่องทางการชำระเงิน</h2>
                        </div>

                        {/* TAB-BASED PREMIUM SELECTION */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
                            {/* Tab 1: Credit Card */}
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('credit')}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '14px 10px',
                                    border: paymentMethod === 'credit' ? '2px solid #4f46e5' : '1px solid var(--border)',
                                    borderRadius: 12,
                                    background: paymentMethod === 'credit' ? '#f5f3ff' : 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    outline: 'none',
                                }}
                            >
                                <CreditCard size={22} color={paymentMethod === 'credit' ? '#4f46e5' : '#64748b'} />
                                <span style={{ fontSize: 12, fontWeight: paymentMethod === 'credit' ? 700 : 500, color: paymentMethod === 'credit' ? '#4f46e5' : '#334155' }}>
                                    บัตรเครดิต/เดบิต
                                </span>
                            </button>

                            {/* Tab 2: PromptPay */}
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('promptpay')}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '14px 10px',
                                    border: paymentMethod === 'promptpay' ? '2px solid #4f46e5' : '1px solid var(--border)',
                                    borderRadius: 12,
                                    background: paymentMethod === 'promptpay' ? '#f5f3ff' : 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    outline: 'none',
                                }}
                            >
                                <svg viewBox="0 0 24 24" width="22" height="22" fill={paymentMethod === 'promptpay' ? '#4f46e5' : '#64748b'}>
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                </svg>
                                <span style={{ fontSize: 12, fontWeight: paymentMethod === 'promptpay' ? 700 : 500, color: paymentMethod === 'promptpay' ? '#4f46e5' : '#334155' }}>
                                    โอนพร้อมเพย์
                                </span>
                            </button>

                            {/* Tab 3: COD */}
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('cod')}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '14px 10px',
                                    border: paymentMethod === 'cod' ? '2px solid #4f46e5' : '1px solid var(--border)',
                                    borderRadius: 12,
                                    background: paymentMethod === 'cod' ? '#f5f3ff' : 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    outline: 'none',
                                }}
                            >
                                <Truck size={22} color={paymentMethod === 'cod' ? '#4f46e5' : '#64748b'} />
                                <span style={{ fontSize: 12, fontWeight: paymentMethod === 'cod' ? 700 : 500, color: paymentMethod === 'cod' ? '#4f46e5' : '#334155' }}>
                                    เก็บเงินปลายทาง
                                </span>
                            </button>
                        </div>

                        {/* --- TAB CONTENT 1: CREDIT CARD --- */}
                        {paymentMethod === 'credit' && (
                            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                                
                                {/* LIVE CREDIT CARD PREVIEW */}
                                <div style={{
                                    width: '100%',
                                    maxWidth: 360,
                                    height: 200,
                                    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                                    borderRadius: 16,
                                    padding: 24,
                                    color: 'white',
                                    boxShadow: '0 10px 25px rgba(49, 46, 129, 0.25)',
                                    position: 'relative',
                                    marginBottom: 24,
                                    marginRight: 'auto',
                                    marginLeft: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    fontFamily: 'monospace'
                                }}>
                                    {/* Top Card Row */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        {/* Golden Card Chip */}
                                        <div style={{
                                            width: 42,
                                            height: 30,
                                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                            borderRadius: 6,
                                            border: '1px solid #78350f'
                                        }}></div>
                                        {/* Visa Logo Text */}
                                        <span style={{ fontSize: 20, fontWeight: 'bold', fontStyle: 'italic', color: '#93c5fd' }}>VISA</span>
                                    </div>

                                    {/* Card Number display */}
                                    <div style={{ fontSize: 20, letterSpacing: 3, fontWeight: 700, margin: '20px 0 10px 0', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                        {cardNumber || '•••• •••• •••• ••••'}
                                    </div>

                                    {/* Expiry & Card Holder Details */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                                        <div>
                                            <div style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 2 }}>CARDHOLDER</div>
                                            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
                                                {cardName || 'YOUR FULL NAME'}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 2 }}>EXPIRES</div>
                                            <div style={{ fontSize: 13, fontWeight: 600 }}>{cardExpiry || 'MM/YY'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Fields for Credit Card (NO REQUIRED ATTS!) */}
                                <div style={{ background: '#f8fafc', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                                    <div className="form-group">
                                        <label style={{ fontSize: 12, fontWeight: 600 }}>หมายเลขบัตรเครดิต</label>
                                        <input 
                                            type="text" 
                                            value={cardNumber}
                                            onChange={handleCardNumberChange}
                                            placeholder="4111 2222 3333 4444" 
                                            style={{ height: 44, borderRadius: 8, fontFamily: 'monospace' }}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label style={{ fontSize: 12, fontWeight: 600 }}>ชื่อผู้ถือบัตร (ภาษาอังกฤษ)</label>
                                        <input 
                                            type="text" 
                                            value={cardName}
                                            onChange={e => setCardName(e.target.value)}
                                            placeholder="SOMCHAI JAIDEE" 
                                            style={{ height: 44, borderRadius: 8, textTransform: 'uppercase' }}
                                        />
                                    </div>

                                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 0 }}>
                                        <div>
                                            <label style={{ fontSize: 12, fontWeight: 600 }}>วันหมดอายุ</label>
                                            <input 
                                                type="text" 
                                                value={cardExpiry}
                                                onChange={handleExpiryChange}
                                                placeholder="MM/YY" 
                                                style={{ height: 44, borderRadius: 8, fontFamily: 'monospace' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: 12, fontWeight: 600 }}>รหัสความปลอดภัย (CVV)</label>
                                            <input 
                                                type="password" 
                                                value={cardCvv}
                                                onChange={handleCvvChange}
                                                placeholder="123" 
                                                style={{ height: 44, borderRadius: 8, fontFamily: 'monospace' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- TAB CONTENT 2: PROMPTPAY --- */}
                        {paymentMethod === 'promptpay' && (
                            <div style={{
                                background: '#f8fafc',
                                padding: 24,
                                borderRadius: 12,
                                border: '1px solid #e2e8f0',
                                textAlign: 'center',
                                animation: 'fadeIn 0.3s ease-out'
                            }}>
                                <div style={{
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: '#0f172a',
                                    marginBottom: 8,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8
                                }}>
                                    <Smartphone size={20} color="var(--primary)" /> โอนเงินผ่านระบบพร้อมเพย์ (PromptPay QR)
                                </div>
                                <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
                                    ระบบจำลองนี้จะช่วยจำลองการสร้าง QR Code และโอนเงินเข้าร้านยาโดยไม่ต้องเชื่อมสแกนจริง
                                </p>
                                
                                <div style={{
                                    padding: '16px',
                                    background: 'white',
                                    border: '2px dashed #cbd5e1',
                                    borderRadius: 12,
                                    display: 'inline-block',
                                    marginBottom: 16
                                }}>
                                    <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>PROMPTPAY ID</div>
                                    <div style={{ fontSize: 18, color: '#4f46e5', fontWeight: 800, fontFamily: 'monospace', margin: '4px 0' }}>081-501-8272</div>
                                    <div style={{ fontSize: 11, color: '#64748b' }}>ยอดโอน: <strong>{formatPrice(total)}</strong></div>
                                </div>
                                
                                <div style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic' }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, verticalAlign: 'middle' }}><Lightbulb size={14} /> <strong>กดปุ่ม "ยืนยันสั่งชำระเงิน"</strong> ที่เมนูด้านขวาเพื่อจำลองการยืนยันสลิปทันที</span>
                                </div>
                            </div>
                        )}

                        {/* --- TAB CONTENT 3: COD --- */}
                        {paymentMethod === 'cod' && (
                            <div style={{
                                background: '#f8fafc',
                                padding: 24,
                                borderRadius: 12,
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 16,
                                animation: 'fadeIn 0.3s ease-out'
                            }}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '50%',
                                    background: '#eef2ff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#4f46e5',
                                    flexShrink: 0
                                }}>
                                    <Truck size={24} />
                                </div>
                                <div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
                                        ชำระเงินเมื่อสินค้าส่งถึงบ้าน (Cash on Delivery)
                                    </div>
                                    <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
                                        กรุณาจัดเตรียมเงินสดตามยอดสั่งซื้อทั้งหมดให้พร้อมกับพนักงานขนส่งเมื่อสินค้าส่งถึงมือคุณ
                                    </div>
                                </div>
                            </div>
                        )}
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
