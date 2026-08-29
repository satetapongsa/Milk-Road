import { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
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
            background: 'rgba(32, 33, 36, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
            fontFamily: 'Google Sans, Roboto, Prompt, sans-serif'
        }}>
            <div style={{
                background: '#ffffff',
                width: '100%',
                maxWidth: '440px',
                borderRadius: '28px',
                padding: '36px 32px 32px 32px',
                boxShadow: '0 1px 3px rgba(60,64,67,0.3), 0 8px 24px 6px rgba(60,64,67,0.15)',
                position: 'relative',
                animation: 'googlePop 0.25s cubic-bezier(0.0, 0.0, 0.2, 1)'
            }}>
                {/* Close Button */}
                <button
                    onClick={closeAuthModal}
                    style={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        background: 'none',
                        border: 'none',
                        color: '#5f6368',
                        borderRadius: '50%',
                        width: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f1f3f4'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                    <X size={20} />
                </button>

                {/* Google-style Header Badge & Title */}
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
                        {/* 4-Color Google Icon */}
                        <svg width="28" height="28" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span style={{ fontSize: 18, fontWeight: 700, color: '#202124', letterSpacing: '-0.3px' }}>StudyRoad Account</span>
                    </div>
                    <h2 style={{ fontSize: 22, fontWeight: 500, color: '#202124', margin: '0 0 6px 0' }}>
                        {tab === 'login' ? 'ลงชื่อเข้าใช้งาน' : 'สร้างบัญชีผู้ใช้ใหม่'}
                    </h2>
                    <p style={{ fontSize: 13, color: '#5f6368', margin: 0, lineHeight: 1.5 }}>
                        {authModalMessage || 'เพื่อใช้งานคลังหนังสือส่วนตัวและสั่งซื้อคอร์สเรียน'}
                    </p>
                </div>

                {/* Google Sign-In One-Tap Quick Button */}
                <button
                    type="button"
                    onClick={() => handleQuickLogin('somchai.j@gmail.com', 'pass1234')}
                    style={{
                        width: '100%',
                        padding: '10px 16px',
                        background: '#ffffff',
                        border: '1px solid #dadce0',
                        borderRadius: '20px',
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#3c4043',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        boxShadow: '0 1px 2px rgba(60,64,67,0.08)',
                        transition: 'all 0.2s',
                        marginBottom: 16
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>ดำเนินการต่อด้วย Google Account</span>
                </button>

                {/* Divider Line */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0', color: '#70757a', fontSize: 12 }}>
                    <div style={{ flex: 1, height: 1, background: '#dadce0' }}></div>
                    <span>หรือใช้งานด้วยอีเมล</span>
                    <div style={{ flex: 1, height: 1, background: '#dadce0' }}></div>
                </div>

                {/* Form Inputs (Google Material 3 Styled) */}
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{
                            background: '#fce8e6',
                            color: '#c5221f',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            fontSize: 13,
                            marginBottom: 16,
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {tab === 'register' && (
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#3c4043', marginBottom: 6 }}>ชื่อ-นามสกุล</label>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                placeholder="ชื่อและนามสกุลของคุณ"
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    borderRadius: '8px',
                                    border: '1px solid #dadce0',
                                    fontSize: 14,
                                    color: '#202124',
                                    boxSizing: 'border-box',
                                    outline: 'none',
                                    transition: 'border-color 0.2s, box-shadow 0.2s'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#1a73e8';
                                    e.target.style.boxShadow = '0 0 0 2px rgba(26,115,232,0.2)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#dadce0';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    )}

                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#3c4043', marginBottom: 6 }}>อีเมล</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="อีเมลของคุณ"
                            style={{
                                width: '100%',
                                padding: '12px 14px',
                                borderRadius: '8px',
                                border: '1px solid #dadce0',
                                fontSize: 14,
                                color: '#202124',
                                boxSizing: 'border-box',
                                outline: 'none',
                                transition: 'border-color 0.2s, box-shadow 0.2s'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#1a73e8';
                                e.target.style.boxShadow = '0 0 0 2px rgba(26,115,232,0.2)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#dadce0';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#3c4043', marginBottom: 6 }}>รหัสผ่าน</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="ป้อนรหัสผ่าน"
                                style={{
                                    width: '100%',
                                    padding: '12px 42px 12px 14px',
                                    borderRadius: '8px',
                                    border: '1px solid #dadce0',
                                    fontSize: 14,
                                    color: '#202124',
                                    boxSizing: 'border-box',
                                    outline: 'none',
                                    transition: 'border-color 0.2s, box-shadow 0.2s'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#1a73e8';
                                    e.target.style.boxShadow = '0 0 0 2px rgba(26,115,232,0.2)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#dadce0';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: 12,
                                    top: 12,
                                    background: 'none',
                                    border: 'none',
                                    color: '#5f6368',
                                    cursor: 'pointer',
                                    padding: 2
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Google Action Bar (Switch Tab Link + Primary Blue Button) */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
                        <button
                            type="button"
                            onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError(''); }}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#1a73e8',
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: 'pointer',
                                padding: 0
                            }}
                        >
                            {tab === 'login' ? 'สร้างบัญชีผู้ใช้ใหม่' : 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ'}
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                background: '#1a73e8',
                                color: '#ffffff',
                                border: 'none',
                                padding: '10px 24px',
                                borderRadius: '20px',
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: loading ? 'default' : 'pointer',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                                transition: 'background 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#1557b0'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#1a73e8'}
                        >
                            {loading ? 'กำลังโหลด...' : tab === 'login' ? 'เข้าสู่ระบบ' : 'ถัดไป'}
                        </button>
                    </div>

                    {/* Google Account Selector Card List */}
                    <div style={{ marginTop: 28, paddingTop: 16, borderTop: '1px solid #f1f3f4' }}>
                        <div style={{ fontSize: 11, fontWeight: 500, color: '#70757a', marginBottom: 10 }}>
                            เลือกบัญชีสำหรับทดสอบด่วน (Quick Account Chooser):
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <div
                                onClick={() => handleQuickLogin('admin@studyroad.com', 'admin123')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e8eaed',
                                    cursor: 'pointer',
                                    transition: 'background 0.15s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e8f0fe', color: '#1a73e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                                        A
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 12, fontWeight: 600, color: '#202124' }}>Super Admin (StudyRoad)</div>
                                        <div style={{ fontSize: 11, color: '#5f6368' }}>admin@studyroad.com</div>
                                    </div>
                                </div>
                                <ChevronRight size={16} color="#70757a" />
                            </div>

                            <div
                                onClick={() => handleQuickLogin('somchai.j@gmail.com', 'pass1234')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e8eaed',
                                    cursor: 'pointer',
                                    transition: 'background 0.15s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#ceedd5', color: '#137333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                                        ส
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 12, fontWeight: 600, color: '#202124' }}>สมชาย ใจดี (นิสิตวิศวะ จุฬาฯ)</div>
                                        <div style={{ fontSize: 11, color: '#5f6368' }}>somchai.j@gmail.com</div>
                                    </div>
                                </div>
                                <ChevronRight size={16} color="#70757a" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes googlePop {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
