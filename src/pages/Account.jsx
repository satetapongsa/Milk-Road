import { useState } from 'react';
import { User, Mail, MapPin, Phone, Edit, Save, LogOut, Camera, BookOpen, ShieldCheck, LogIn, KeyRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Account() {
    const { currentUser, isLoggedIn, isAdmin, logout, openAuthModal } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    const [userInfo, setUserInfo] = useState({
        phone: '081-501-8272',
        address: '123 Cyber Tower, Digital District\nBangkok, 10110',
    });

    if (!isLoggedIn) {
        return (
            <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
                <div style={{
                    maxWidth: 480,
                    margin: '0 auto',
                    background: '#ffffff',
                    padding: '48px 32px',
                    borderRadius: '24px',
                    boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #e2e8f0'
                }}>
                    <div style={{ width: 64, height: 64, background: '#eef2ff', color: '#4f46e5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                        <User size={32} />
                    </div>
                    <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
                        🔒 กรุณาเข้าสู่ระบบก่อนใช้งาน
                    </h2>
                    <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28, lineHeight: 1.6 }}>
                        คุณจำเป็นต้องเข้าสู่ระบบหรือสมัครสมาชิกก่อนเข้าชมข้อมูลบัญชีผู้ใช้ คลังหนังสือส่วนตัว และประวัติคำสั่งซื้อ
                    </p>
                    <button
                        onClick={() => openAuthModal('กรุณาเข้าสู่ระบบหรือสมัครสมาชิกก่อนเข้าชมหน้าตั้งค่าบัญชี')}
                        style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '14px',
                            borderRadius: '16px',
                            fontSize: 15,
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8
                        }}
                    >
                        <LogIn size={18} /> เข้าสู่ระบบ / สมัครสมาชิก
                    </button>
                </div>
            </div>
        );
    }

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        setUserInfo({
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
                        <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 20px' }}>
                            <div style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 36,
                                fontWeight: 800,
                                boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)'
                            }}>
                                {currentUser?.full_name ? currentUser.full_name.charAt(0).toUpperCase() : 'U'}
                            </div>
                        </div>

                        <h2 style={{ fontSize: 20, marginBottom: 4, fontWeight: 800, color: '#0f172a' }}>
                            {currentUser?.full_name}
                        </h2>
                        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
                            {currentUser?.email}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
                            {isAdmin ? (
                                <span style={{ background: '#eef2ff', color: '#4f46e5', fontSize: 12, padding: '4px 12px', borderRadius: 20, fontWeight: 700, border: '1px solid #c7d2fe', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                    <ShieldCheck size={14} /> Super Admin
                                </span>
                            ) : (
                                <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: 12, padding: '4px 12px', borderRadius: 20, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                    <CheckCircle2 size={14} /> สมาชิกยืนยันตัวตนแล้ว
                                </span>
                            )}
                        </div>

                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, textAlign: 'left' }}>
                            <div style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: 16, fontWeight: 700, letterSpacing: 1 }}>Menu</div>
                            <ul style={{ display: 'grid', gap: 8, padding: 0, margin: 0, listStyle: 'none' }}>
                                <li>
                                    <Link to="/my-library" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 10, color: '#4f46e5', transition: '0.2s', background: '#eef2ff', fontWeight: 700, textDecoration: 'none' }}>
                                        <BookOpen size={18} color="#4f46e5" />
                                        คลังหนังสือส่วนตัว (My Library)
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/orders" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 10, color: 'var(--text-main)', transition: '0.2s', background: '#f8fafc', textDecoration: 'none', fontWeight: 600 }}>
                                        <div style={{ width: 8, height: 8, background: 'var(--primary)', borderRadius: '50%' }}></div>
                                        ประวัติการสั่งซื้อ
                                    </Link>
                                </li>
                                <li>
                                    <button 
                                        onClick={logout}
                                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 10, color: '#ef4444', transition: '0.2s', background: '#fef2f2', border: '1px solid #fee2e2', cursor: 'pointer', textAlign: 'left', font: 'inherit', fontWeight: 700 }}
                                    >
                                        <LogOut size={18} />
                                        ออกจากระบบ
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: '#0f172a' }}>ตั้งค่าบัญชีผู้ใช้</h1>
                        {!isEditing && (
                            <button
                                className="btn btn-primary"
                                onClick={() => setIsEditing(true)}
                                style={{ padding: '8px 18px', fontSize: 14, borderRadius: 12, fontWeight: 700 }}
                            >
                                <Edit size={16} /> แก้ไขข้อมูล
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSave} style={{
                        background: 'white',
                        padding: 32,
                        borderRadius: '24px',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <div style={{ display: 'grid', gap: 24 }}>
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontWeight: 700, color: '#334155' }}>
                                    <User size={16} /> ชื่อ-นามสกุล
                                </label>
                                <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', padding: '12px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                                    {currentUser?.full_name}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontWeight: 700, color: '#334155' }}>
                                        <Mail size={16} /> อีเมลบัญชีผู้ใช้
                                    </label>
                                    <div style={{ fontSize: 15, color: '#475569', padding: '12px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                                        {currentUser?.email}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontWeight: 700, color: '#334155' }}>
                                        <Phone size={16} /> เบอร์โทรศัพท์
                                    </label>
                                    {isEditing ? (
                                        <input type="tel" name="phone" defaultValue={userInfo.phone} required />
                                    ) : (
                                        <div style={{ fontSize: 15, color: '#475569', padding: '12px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>{userInfo.phone}</div>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontWeight: 700, color: '#334155' }}>
                                    <MapPin size={16} /> ที่อยู่สำหรับการออกใบเสร็จ
                                </label>
                                {isEditing ? (
                                    <textarea name="address" rows="3" defaultValue={userInfo.address} required></textarea>
                                ) : (
                                    <div style={{ fontSize: 15, color: '#475569', padding: '12px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0', whiteSpace: 'pre-line' }}>{userInfo.address}</div>
                                )}
                            </div>

                            {isEditing && (
                                <div style={{ display: 'flex', gap: 12, marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 24 }}>
                                    <button type="submit" className="btn btn-primary" style={{ borderRadius: 12 }}>
                                        <Save size={16} /> บันทึกการเปลี่ยนแปลง
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={() => setIsEditing(false)}
                                        style={{ borderRadius: 12 }}
                                    >
                                        ยกเลิก
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid var(--border);
                    border-radius: 10px;
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
