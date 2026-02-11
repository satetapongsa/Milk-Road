import { useState } from 'react';
import { User, Mail, MapPin, Phone, Edit, Save, LogOut, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Account() {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState({
        name: 'สมชาย ใจดี',
        email: 'somchai.j@example.com',
        phone: '081-234-5678',
        address: '123 Cyber Tower, Digital District\nBangkok, 10110',
        memberSince: 'มกราคม 2024',
        tier: 'Gold Member'
    });

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        setUser({
            ...user,
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address')
        });
        setIsEditing(false);
    };

    return (
        <div className="container" style={{ padding: '40px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 40, marginTop: 24 }}>
                {/* Sidebar / Profile Card */}
                <div>
                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '40px 24px',
                        textAlign: 'center',
                        boxShadow: 'var(--shadow-lg)',
                        border: '1px solid var(--border)',
                        position: 'sticky',
                        top: '100px'
                    }}>
                        <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 24px' }}>
                            <img
                                src="https://ui-avatars.com/api/?name=Somchai+Jaidee&background=4f46e5&color=fff&size=128"
                                alt="Profile"
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: '0 8px 16px -4px rgba(0,0,0,0.1)' }}
                            />
                            <button style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                background: 'var(--primary)',
                                color: 'white',
                                border: '3px solid white',
                                borderRadius: '50%',
                                width: 36,
                                height: 36,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}>
                                <Camera size={16} />
                            </button>
                        </div>

                        <h2 style={{ fontSize: 20, marginBottom: 4 }}>{user.name}</h2>
                        <p style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 16 }}>{user.tier}</p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
                            <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: 12, padding: '4px 8px', borderRadius: 4, fontWeight: 600 }}>ยืนยันตัวตนแล้ว</span>
                        </div>

                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, textAlign: 'left' }}>
                            <div style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: 16, fontWeight: 600, letterSpacing: 1 }}>Menu</div>
                            <ul style={{ display: 'grid', gap: 8 }}>
                                <li>
                                    <Link to="/orders" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 8, color: 'var(--text-main)', transition: '0.2s', background: '#f8fafc' }}>
                                        <div style={{ width: 8, height: 8, background: 'var(--primary)', borderRadius: '50%' }}></div>
                                        ประวัติการสั่งซื้อ
                                    </Link>
                                </li>
                                <li>
                                    <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 8, color: '#ef4444', transition: '0.2s', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', font: 'inherit' }}>
                                        <LogOut size={16} />
                                        ออกจากระบบ
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                        <h1 style={{ fontSize: 28, margin: 0 }}>ตั้งค่าบัญชีผู้ใช้</h1>
                        {!isEditing && (
                            <button
                                className="btn btn-primary"
                                onClick={() => setIsEditing(true)}
                                style={{ padding: '8px 16px', fontSize: 14 }}
                            >
                                <Edit size={16} /> แก้ไขข้อมูล
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSave} style={{
                        background: 'white',
                        padding: 32,
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <div style={{ display: 'grid', gap: 24 }}>
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontWeight: 600, color: 'var(--text-light)' }}>
                                    <User size={16} /> ชื่อ-นามสกุล
                                </label>
                                {isEditing ? (
                                    <input type="text" name="name" defaultValue={user.name} required />
                                ) : (
                                    <div style={{ fontSize: 16, fontWeight: 500 }}>{user.name}</div>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontWeight: 600, color: 'var(--text-light)' }}>
                                        <Mail size={16} /> อีเมล
                                    </label>
                                    {isEditing ? (
                                        <input type="email" name="email" defaultValue={user.email} required />
                                    ) : (
                                        <div style={{ fontSize: 16 }}>{user.email}</div>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontWeight: 600, color: 'var(--text-light)' }}>
                                        <Phone size={16} /> เบอร์โทรศัพท์
                                    </label>
                                    {isEditing ? (
                                        <input type="tel" name="phone" defaultValue={user.phone} required />
                                    ) : (
                                        <div style={{ fontSize: 16 }}>{user.phone}</div>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontWeight: 600, color: 'var(--text-light)' }}>
                                    <MapPin size={16} /> ที่อยู่จัดส่ง
                                </label>
                                {isEditing ? (
                                    <textarea name="address" rows="3" defaultValue={user.address} required></textarea>
                                ) : (
                                    <div style={{ fontSize: 16, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{user.address}</div>
                                )}
                            </div>

                            {isEditing && (
                                <div style={{ display: 'flex', gap: 12, marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 24 }}>
                                    <button type="submit" className="btn btn-primary">
                                        <Save size={16} /> บันทึกการเปลี่ยนแปลง
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        ยกเลิก
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>

                    <div style={{ marginTop: 24, padding: 24, background: '#f8fafc', borderRadius: 12, border: '1px dashed var(--border)' }}>
                        <h3 style={{ fontSize: 16, marginBottom: 12 }}>สถานะสมาชิก</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span style={{ fontSize: 14 }}>คะแนนสะสม</span>
                            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>2,450 แต้ม</span>
                        </div>
                        <div style={{ width: '100%', height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ width: '70%', height: '100%', background: 'linear-gradient(90deg, var(--primary) 0%, #a855f7 100%)' }}></div>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 8 }}>
                            อีก 550 แต้ม เพื่อเลื่อนเป็นระดับ Platinum
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    font-size: 15px;
                    font-family: inherit;
                    transition: 0.2s;
                }
                .form-group input:focus, .form-group textarea:focus {
                    outline: none;
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
                }
                
                @media (max-width: 768px) {
                    div[style*="grid-template-columns"] {
                        grid-template-columns: 1fr !important;
                    }
                    div[style*="top: 100px"] {
                        position: static !important;
                    }
                }
            `}</style>
        </div>
    );
}
