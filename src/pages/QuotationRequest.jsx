import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, CONFIG } from '../data/products';
import { FileText, Truck, Loader } from 'lucide-react';

export default function QuotationRequest() {
    const { cart, subtotal, total, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (cart.length === 0) {
            navigate('/');
        }
    }, [cart, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const form = e.target;
        const formData = new FormData(form);

        const address = `${formData.get('address')}
${formData.get('subdistrict')} ${formData.get('district')}
${formData.get('province')} ${formData.get('zipcode')}`;

        // Simulate API call
        setTimeout(() => {
            const quotation = {
                id: 'QT-' + Date.now().toString().slice(-6),
                date: new Date().toLocaleDateString('th-TH'),
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('th-TH'), // Valid for 30 days
                customer: {
                    name: formData.get('name'),
                    company: formData.get('company'), // New field for quotation
                    phone: formData.get('phone'),
                    email: formData.get('email'),
                    address: address,
                    taxId: formData.get('taxId') // New field
                },
                items: cart,
                totals: {
                    subtotal: subtotal,
                    shipping: CONFIG.shippingCost,
                    total: total
                }
            };

            localStorage.setItem('shopii_quotation', JSON.stringify(quotation));
            // Don't clear cart for quotation as they might want to clear it only after actual purchase
            // clearCart(); 
            setLoading(false);
            navigate('/quotation');
        }, 1500);
    };

    if (cart.length === 0) return null;

    return (
        <div className="container">
            <div className="checkout-page-container">
                <form id="quotation-form" onSubmit={handleSubmit} className="checkout-grid">
                    <div className="checkout-section">
                        <h2><FileText size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} /> ขอใบเสนอราคา</h2>
                        <p style={{ marginBottom: 24, fontSize: 14 }}>กรอกข้อมูลเพื่อออกเอกสารใบเสนอราคาอย่างเป็นทางการ</p>

                        <div className="form-group">
                            <label>ชื่อผู้ติดต่อ</label>
                            <input type="text" name="name" required placeholder="สมชาย ใจดี" />
                        </div>

                        <div className="form-group">
                            <label>ชื่อบริษัท / หน่วยงาน (ถ้ามี)</label>
                            <input type="text" name="company" placeholder="บริษัท ตัวอย่าง จำกัด" />
                        </div>

                        <div className="form-group">
                            <label>เลขประจำตัวผู้เสียภาษี (ถ้ามี)</label>
                            <input type="text" name="taxId" placeholder="1234567890123" />
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
                    </div>

                    <div className="checkout-summary">
                        <h3>รายการสินค้า</h3>
                        <div style={{ flexGrow: 1, overflowY: 'auto', maxHeight: '400px', marginBottom: 24 }}>
                            {cart.map(item => (
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
                            <span>ยอดรวมสินลา</span>
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
                                    <Loader className="spin" size={20} /> กำลังสร้างเอกสาร...
                                </>
                            ) : (
                                'ออกใบเสนอราคา'
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
