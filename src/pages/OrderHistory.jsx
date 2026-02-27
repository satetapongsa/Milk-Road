import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Package } from 'lucide-react';
import { formatPrice } from '../data/products';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const data = localStorage.getItem('shopii_orders');
        if (data) {
            setOrders(JSON.parse(data));
        }
    }, []);

    if (orders.length === 0) {
        return (
            <div className="container">
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <Package size={64} style={{ color: 'var(--text-light)', marginBottom: 16 }} />
                    <h2 style={{ marginBottom: 16 }}>ยังไม่มีประวัติการสั่งซื้อ</h2>
                    <p style={{ marginBottom: 24 }}>คุณยังไม่ได้ทำการสั่งซื้อสินค้าใดๆ</p>
                    <Link to="/" className="btn btn-primary">เลือกซื้อสินค้า</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '40px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                <ShoppingBag size={28} color="var(--primary)" />
                <h1 style={{ fontSize: 24, margin: 0 }}>ประวัติการสั่งซื้อ</h1>
            </div>

            <div style={{ display: 'grid', gap: 24 }}>
                {orders.map((order) => (
                    <div key={order.id} style={{
                        background: 'white',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border)',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <div style={{
                            padding: '16px 24px',
                            background: '#f8fafc',
                            borderBottom: '1px solid var(--border)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 16
                        }}>
                            <div style={{ display: 'flex', gap: 24, fontSize: 14 }}>
                                <div>
                                    <div style={{ color: 'var(--text-light)', marginBottom: 4 }}>วันที่สั่งซื้อ</div>
                                    <div style={{ fontWeight: 500 }}>{order.date}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-light)', marginBottom: 4 }}>ยอดสุทธิ</div>
                                    <div style={{ fontWeight: 500 }}>{formatPrice(order.totals.total)}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-light)', marginBottom: 4 }}>สถานะ</div>
                                    <div style={{
                                        color: order.status === 'Completed' ? '#16a34a' : '#ea580c',
                                        background: order.status === 'Completed' ? '#dcfce7' : '#ffedd5',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontSize: 12,
                                        fontWeight: 600
                                    }}>
                                        {order.status === 'Completed' ? 'ชำระเงินแล้ว' : order.status}
                                    </div>
                                </div>
                            </div>
                            <div style={{ fontSize: 14, color: 'var(--text-light)' }}>
                                หมายเลขคำสั่งซื้อ #{order.id}
                            </div>
                        </div>

                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16, marginBottom: 16 }}>
                                {order.items.map((item, idx) => (
                                    <div key={idx} style={{ flexShrink: 0, width: 80, position: 'relative' }}>
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }}
                                        />
                                        <span style={{
                                            position: 'absolute',
                                            bottom: -8,
                                            right: -8,
                                            background: 'var(--secondary)',
                                            color: 'white',
                                            fontSize: 12,
                                            width: 24,
                                            height: 24,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 600
                                        }}>
                                            {item.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Link to={`/order/${order.id}`} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    ดูรายละเอียด <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
