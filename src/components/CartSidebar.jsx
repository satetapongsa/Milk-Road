import { useNavigate } from 'react-router-dom';
import { X, ShoppingBasket, Plus, Minus, CreditCard, FileText } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';

export default function CartSidebar({ isOpen, onClose }) {
    const { cart, removeFromCart, updateQuantity, subtotal, total } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    return (
        <>
            <div
                className={`cart-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
                aria-hidden={!isOpen}
            ></div>
            <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h3>ตะกร้าสินค้า ({cart.reduce((sum, i) => sum + i.quantity, 0)})</h3>
                    <button className="close-btn" onClick={onClose} aria-label="Close cart">
                        <X size={20} />
                    </button>
                </div>

                <div className="cart-items">
                    {cart.length === 0 ? (
                        <div className="empty-cart-message">
                            <ShoppingBasket size={32} style={{ opacity: 0.5, marginBottom: 8 }} />
                            <p>ยังไม่มีสินค้าในตะกร้า</p>
                            <button className="btn btn-outline" onClick={onClose}>เลือกซื้อสินค้า</button>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div className="cart-item" key={item.id}>
                                <img src={item.image} className="cart-item-img" alt={item.name} />
                                <div className="cart-item-info">
                                    <div>
                                        <h4 className="cart-item-title">{item.name}</h4>
                                        <div className="cart-item-price">{formatPrice(item.price)}</div>
                                    </div>
                                    <div className="cart-controls">
                                        <div className="qty-control">
                                            <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity">
                                                <Minus size={14} />
                                            </button>
                                            <span className="qty-value">{item.quantity}</span>
                                            <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity">
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <button className="remove-item-btn" onClick={() => removeFromCart(item.id)}>ลบ</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-footer">
                    <div className="cart-summary">
                        <div className="summary-row">
                            <span>ยอดรวม</span>
                            <span id="cart-subtotal">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="summary-row total">
                            <span>ยอดสุทธิ</span>
                            <span id="cart-total">{formatPrice(total)}</span>
                        </div>
                    </div>
                    {cart.length > 0 && (
                        <div style={{ display: 'grid', gap: '12px' }}>
                            <button className="btn btn-primary btn-block checkout-btn" onClick={handleCheckout} style={{ marginTop: 0 }}>
                                ชำระเงิน <CreditCard size={18} style={{ marginLeft: 8 }} />
                            </button>
                            <button className="btn btn-outline btn-block" onClick={() => { onClose(); navigate('/quotation-request'); }}>
                                ใบเสนอราคา <FileText size={18} style={{ marginLeft: 8 }} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
