import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, CONFIG } from '../data/products';
import { CreditCard, Truck, Loader } from 'lucide-react';

export default function Checkout() {
    const { cart, subtotal, total, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (cart.length === 0 && !isSubmitted) {
            navigate('/');
        }
    }, [cart, navigate, isSubmitted]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setIsSubmitted(true);

        const form = e.target;
        const formData = new FormData(form);

        const address = `${formData.get('address')}
${formData.get('subdistrict')} ${formData.get('district')}
${formData.get('province')} ${formData.get('zipcode')}`;

        // Simulate API call
        setTimeout(() => {
            const receipt = {
                id: 'INV-' + Date.now().toString().slice(-6),
                date: new Date().toLocaleDateString('th-TH'),
                customer: {
                    name: formData.get('name'),
                    phone: formData.get('phone'),
                    email: formData.get('email'),
                    address: address
                },
                items: cart,
                totals: {
                    subtotal: subtotal,
                    shipping: CONFIG.shippingCost,
                    total: total
                },
                paymentMethod: paymentMethod === 'cod' ? 'เก็บเงินปลายทาง' : 'บัตรเครดิต/เดบิต',
                status: 'Completed'
            };

            // Save to history
            const existingOrders = JSON.parse(localStorage.getItem('shopii_orders') || '[]');
            localStorage.setItem('shopii_orders', JSON.stringify([receipt, ...existingOrders]));

            // Save for immediate receipt view
            localStorage.setItem('shopii_receipt', JSON.stringify(receipt));
            clearCart();
            setLoading(false);
            navigate('/receipt');
        }, 2000);
    };

    if (cart.length === 0 && !isSubmitted) return null;

    return (
        <div className="container">
            <div className="checkout-page-container">
                <form id="shipping-form" onSubmit={handleSubmit} className="checkout-grid">
                    <div className="checkout-section">
                        <h2><Truck size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} /> ที่อยู่จัดส่ง</h2>

                        <div className="form-group">
                            <label>ชื่อ-นามสกุล</label>
                            <input type="text" name="name" id="ship-name" required placeholder="สมชาย ใจดี" />
                        </div>

                        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <label>เบอร์โทรศัพท์</label>
                                <input type="tel" name="phone" required placeholder="081-234-5678" />
                            </div>
                            <div>
                                <label>อีเมล</label>
                                <input type="email" name="email" required placeholder="email@example.com" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>ที่อยู่</label>
                            <textarea name="address" rows="3" required placeholder="บ้านเลขที่, หมู่บ้าน, ถนน..."></textarea>
                        </div>

                        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <label>แขวง/ตำบล</label>
                                <input type="text" name="subdistrict" required />
                            </div>
                            <div>
                                <label>เขต/อำเภอ</label>
                                <input type="text" name="district" required />
                            </div>
                        </div>

                        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <label>จังหวัด</label>
                                <input type="text" name="province" required />
                            </div>
                            <div>
                                <label>รหัสไปรษณีย์</label>
                                <input type="text" name="zipcode" required />
                            </div>
                        </div>

                        <h3 style={{ marginTop: 40, marginBottom: 16 }}>
                            <CreditCard size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
                            การชำระเงิน
                        </h3>

                        <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="payment"
                                value="cod"
                                checked={paymentMethod === 'cod'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <span>เก็บเงินปลายทาง (Cash on Delivery)</span>
                        </label>

                        <label className={`payment-option ${paymentMethod === 'credit' ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="payment"
                                value="credit"
                                checked={paymentMethod === 'credit'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <span>บัตรเครดิต / เดบิต</span>
                        </label>

                        {paymentMethod === 'credit' && (
                            <div className="payment-fields" id="credit-card-fields">
                                <div className="form-group">
                                    <label>หมายเลขบัตร</label>
                                    <input type="text" placeholder="0000 0000 0000 0000" />
                                </div>
                                <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div>
                                        <label>วันหมดอายุ</label>
                                        <input type="text" placeholder="MM/YY" />
                                    </div>
                                    <div>
                                        <label>CVV</label>
                                        <input type="text" placeholder="123" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="checkout-summary">
                        <h3>สรุปคำสั่งซื้อ</h3>
                        <div style={{ flexGrow: 1, overflowY: 'auto', maxHeight: '400px', marginBottom: 24 }}>
                            {(cart.length > 0 ? cart : []).map(item => (
                                <div className="summary-item" key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <img src={item.image} style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }} alt={item.name} />
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</div>
                                            <small style={{ color: 'var(--text-light)' }}>x{item.quantity}</small>
                                        </div>
                                    </div>
                                    <strong style={{ fontSize: 14 }}>{formatPrice(item.price * item.quantity)}</strong>
                                </div>
                            ))}
                        </div>

                        <div className="summary-row">
                            <span>ยอดรวมสินค้า</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="summary-row">
                            <span>ค่าจัดส่ง</span>
                            <span>{formatPrice(CONFIG.shippingCost)}</span>
                        </div>
                        <div className="summary-row total">
                            <span>ยอดสุทธิ</span>
                            <span style={{ fontSize: 24, color: 'var(--primary)' }}>{formatPrice(total)}</span>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block confirm-btn"
                            disabled={loading}
                            style={{ marginTop: 24 }}
                        >
                            {loading ? (
                                <>
                                    <Loader className="spin" size={20} /> กำลังประมวลผล...
                                </>
                            ) : (
                                'ยืนยันการสั่งซื้อ'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
