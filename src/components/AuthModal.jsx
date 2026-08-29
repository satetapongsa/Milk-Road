import { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, LogIn, UserPlus, Eye, EyeOff, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
    const { isAuthModalOpen, authModalMessage, closeAuthModal, login, register } = useAuth();
    const [tab, setTab] = useState('login'); // login | register
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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

    const handleQuickLogin = async (targetEmail, targetPassword) => {
        setError('');
        setLoading(true);
        try {
            await login(targetEmail, targetPassword);
        } catch (err) {
            setError(err.message || 'ไม่สามารถเข้าสู่ระบบได้');
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
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
        }}>
            <div style={{
                background: '#ffffff',
                width: '100%',
                maxWidth: '460px',
                borderRadius: '28px',
                overflow: 'hidden',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2)',
                animation: 'modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                {/* Modal Premium Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
                    padding: '28px 24px 24px 24px',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Ambient Glow */}
                    <div style={{
                        position: 'absolute',
                        top: '-50px',
                        right: '-50px',
                        width: '160px',
                        height: '160px',
                        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(0,0,0,0) 70%)',
                        borderRadius: '50%',
                        pointerEvents: 'none'
                    }} />

                    <button 
                        onClick={closeAuthModal}
                        style={{
                            position: 'absolute',
                            top: 18,
                            right: 18,
                            background: 'rgba(255, 255, 255, 0.15)',
                            border: 'none',
                            color: 'white',
                            borderRadius: '50%',
                            width: 34,
                            height: 34,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
                    >
                        <X size={18} />
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <img src="/images/logo.png" alt="StudyRoad" style={{ height: 36, borderRadius: 8, boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} />
                        <span style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>StudyRoad Pass</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: '#c7d2fe', lineHeight: 1.5 }}>
                        {authModalMessage || 'เข้าสู่ระบบหรือสมัครสมาชิกเพื่อเข้าชมและสั่งซื้อคอร์สเรียน'}
                    </p>
                </div>

                {/* Tab Switcher */}
                <div style={{ padding: '6px', background: '#f1f5f9', display: 'flex', gap: 6, margin: '16px 20px 0 20px', borderRadius: '16px' }}>
                    <button
                        onClick={() => { setTab('login'); setError(''); }}
                        style={{
                            flex: 1,
                            padding: '10px 14px',
                            border: 'none',
                            borderRadius: '12px',
                            background: tab === 'login' ? '#ffffff' : 'transparent',
                            color: tab === 'login' ? '#4f46e5' : '#64748b',
                            fontWeight: tab === 'login' ? 800 : 600,
                            fontSize: 13,
                            cursor: 'pointer',
                            boxShadow: tab === 'login' ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6
                        }}
                    >
                        <LogIn size={15} /> เข้าสู่ระบบ
                    </button>
                    <button
                        onClick={() => { setTab('register'); setError(''); }}
                        style={{
                            flex: 1,
                            padding: '10px 14px',
                            border: 'none',
                            borderRadius: '12px',
                            background: tab === 'register' ? '#ffffff' : 'transparent',
                            color: tab === 'register' ? '#4f46e5' : '#64748b',
                            fontWeight: tab === 'register' ? 800 : 600,
                            fontSize: 13,
                            cursor: 'pointer',
                            boxShadow: tab === 'register' ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6
                        }}
                    >
                        <UserPlus size={15} /> สมัครสมาชิก
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px 24px' }}>
                    {error && (
                        <div style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#dc2626',
                            padding: '10px 14px',
                            borderRadius: '12px',
                            fontSize: 13,
                            marginBottom: 16,
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {tab === 'register' && (
                        <div style={{ marginBottom: 14 }}>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>ชื่อ-นามสกุล</label>
                            <div style={{ position: 'relative' }}>
                                <User size={16} style={{ position: 'absolute', left: 14, top: 13, color: '#94a3b8' }} />
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    placeholder="ชื่อผู้ใช้งานของคุณ"
                                    style={{
                                        width: '100%',
                                        padding: '10px 14px 10px 38px',
                                        borderRadius: '12px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: 14,
                                        boxSizing: 'border-box',
                                        outline: 'none',
                                        transition: 'all 0.2s'
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <div style={{ marginBottom: 14 }}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>อีเมล (Email Address)</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={{ position: 'absolute', left: 14, top: 13, color: '#94a3b8' }} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="student@studyroad.com"
                                style={{
                                    width: '100%',
                                    padding: '10px 14px 10px 38px',
                                    borderRadius: '12px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: 14,
                                    boxSizing: 'border-box',
                                    outline: 'none',
                                    transition: 'all 0.2s'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>รหัสผ่าน (Password)</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: 14, top: 13, color: '#94a3b8' }} />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '10px 42px 10px 38px',
                                    borderRadius: '12px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: 14,
                                    boxSizing: 'border-box',
                                    outline: 'none',
                                    transition: 'all 0.2s'
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: 12,
                                    top: 11,
                                    background: 'none',
                                    border: 'none',
                                    color: '#64748b',
                                    cursor: 'pointer',
                                    padding: 2
                                }}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit CTA Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '13px',
                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '14px',
                            fontSize: 15,
                            fontWeight: 800,
                            cursor: loading ? 'default' : 'pointer',
                            boxShadow: '0 8px 20px -4px rgba(79, 70, 229, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            transition: 'all 0.2s'
                        }}
                    >
                        {loading ? 'กำลังดำเนินการ...' : tab === 'login' ? (
                            <>เข้าสู่ระบบทันที <ArrowRight size={16} /></>
                        ) : (
                            <>สมัครสมาชิกบัญชีใหม่ <Sparkles size={16} /></>
                        )}
                    </button>

                    {/* Quick Demo Accounts Selection */}
                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 10, letterSpacing: 0.5, textAlign: 'center' }}>
                            ⚡ เลือกบัญชีทดสอบด่วน (One-Click Quick Login)
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                            <button
                                type="button"
                                onClick={() => handleQuickLogin('admin@studyroad.com', 'admin123')}
                                style={{
                                    background: '#eef2ff',
                                    border: '1px solid #c7d2fe',
                                    color: '#4f46e5',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontSize: 11,
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4
                                }}
                            >
                                👑 Super Admin
                            </button>

                            <button
                                type="button"
                                onClick={() => handleQuickLogin('somchai.j@gmail.com', 'pass1234')}
                                style={{
                                    background: '#f1f5f9',
                                    border: '1px solid #cbd5e1',
                                    color: '#334155',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontSize: 11,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4
                                }}
                            >
                                🎓 สมชาย (วิศวฯ จุฬาฯ)
                            </button>

                            <button
                                type="button"
                                onClick={() => handleQuickLogin('siriporn.k@gmail.com', 'pass1234')}
                                style={{
                                    background: '#f1f5f9',
                                    border: '1px solid #cbd5e1',
                                    color: '#334155',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontSize: 11,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4
                                }}
                            >
                                🩺 ศิริพร (แพทย์ มหิดล)
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes modalPop {
                    from { transform: scale(0.92); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
