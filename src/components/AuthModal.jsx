import { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, KeyRound, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
    const { isAuthModalOpen, authModalMessage, closeAuthModal, login, register } = useAuth();
    const [tab, setTab] = useState('login'); // login | register
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isAuthModalOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (tab === 'login') {
                await login(email, password);
            } else {
                await register(email, password, fullName);
            }
        } catch (err) {
            setError(err.message || 'เกิดข้อผิดพลาดในการทำรายการ');
        } finally {
            setLoading(false);
        }
    };

    const handleQuickAdminLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await login('admin@studyroad.com', 'admin123');
        } catch (err) {
            setError(err.message || 'ไม่สามารถล็อกอินแอดมินได้');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
        }}>
            <div style={{
                background: '#ffffff',
                width: '100%',
                maxWidth: '440px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid #e2e8f0',
                animation: 'scaleUp 0.2s ease-out'
            }}>
                {/* Header */}
                <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)', padding: '24px', color: 'white', position: 'relative' }}>
                    <button 
                        onClick={closeAuthModal}
                        style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                        <X size={18} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <img src="/images/logo.png" alt="StudyRoad" style={{ height: 32, borderRadius: 6 }} />
                        <span style={{ fontSize: 18, fontWeight: 800, color: '#ffffff' }}>StudyRoad Auth</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, opacity: 0.95, color: '#e0e7ff' }}>
                        {authModalMessage || 'จำเป็นต้องสมัครสมาชิกหรือเข้าสู่ระบบก่อนเข้าชม/สั่งซื้อ'}
                    </p>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                    <button
                        onClick={() => { setTab('login'); setError(''); }}
                        style={{
                            flex: 1,
                            padding: '14px',
                            border: 'none',
                            background: tab === 'login' ? 'white' : 'transparent',
                            color: tab === 'login' ? '#4f46e5' : '#64748b',
                            fontWeight: tab === 'login' ? 700 : 500,
                            fontSize: 14,
                            cursor: 'pointer',
                            borderBottom: tab === 'login' ? '2px solid #4f46e5' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6
                        }}
                    >
                        <LogIn size={16} /> เข้าสู่ระบบ (Login)
                    </button>
                    <button
                        onClick={() => { setTab('register'); setError(''); }}
                        style={{
                            flex: 1,
                            padding: '14px',
                            border: 'none',
                            background: tab === 'register' ? 'white' : 'transparent',
                            color: tab === 'register' ? '#4f46e5' : '#64748b',
                            fontWeight: tab === 'register' ? 700 : 500,
                            fontSize: 14,
                            cursor: 'pointer',
                            borderBottom: tab === 'register' ? '2px solid #4f46e5' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6
                        }}
                    >
                        <UserPlus size={16} /> สมัครสมาชิก (Register)
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                    {error && (
                        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16, fontWeight: 500 }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {tab === 'register' && (
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 6 }}>ชื่อ-นามสกุล</label>
                            <div style={{ position: 'relative' }}>
                                <User size={16} style={{ position: 'absolute', left: 12, top: 14, color: '#94a3b8' }} />
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    placeholder="ชื่อผู้ใช้งาน"
                                    style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 14, boxSizing: 'border-box' }}
                                />
                            </div>
                        </div>
                    )}

                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 6 }}>อีเมล (Email)</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={{ position: 'absolute', left: 12, top: 14, color: '#94a3b8' }} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 14, boxSizing: 'border-box' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 6 }}>รหัสผ่าน (Password)</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: 12, top: 14, color: '#94a3b8' }} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 14, boxSizing: 'border-box' }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 10,
                            fontSize: 15,
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                            marginBottom: 16
                        }}
                    >
                        {loading ? 'กำลังดำเนินการ...' : tab === 'login' ? 'เข้าสู่ระบบทันที' : 'ลงทะเบียนสมัครสมาชิก'}
                    </button>

                    {/* Quick Admin Login Option */}
                    <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: 16, textAlign: 'center' }}>
                        <button
                            type="button"
                            onClick={handleQuickAdminLogin}
                            style={{
                                background: '#f8fafc',
                                border: '1px solid #cbd5e1',
                                padding: '8px 14px',
                                borderRadius: 8,
                                fontSize: 12,
                                color: '#334155',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6
                            }}
                        >
                            <ShieldCheck size={14} color="#4f46e5" /> เข้าสู่ระบบด้วยบัญชีแอดมิน (Super Admin Quick Login)
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
