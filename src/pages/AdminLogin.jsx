import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock } from 'lucide-react';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '887624';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => password.trim().length > 0 && !loading, [password, loading]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_login_time', Date.now().toString());
        navigate('/admin');
        return;
      }

      setError('รหัสผ่านไม่ถูกต้อง');
      setPassword('');
      setLoading(false);
    }, 400);
  };

  return (
    <div
      className="container"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 48,
        paddingBottom: 48
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: 32,
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              background: '#eef2ff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
              color: 'var(--primary)'
            }}
          >
            <Lock size={30} />
          </div>
          <h1 style={{ marginBottom: 8, fontSize: 28 }}>Admin Login</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>กรุณาใส่รหัสผ่านเพื่อเข้าสู่หน้าจัดการระบบ</p>
        </div>

        <form onSubmit={handleLogin}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>รหัสผ่าน</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="กรอกรหัสผ่านแอดมิน"
              autoFocus
              disabled={loading}
              style={{
                width: '100%',
                border: error ? '1px solid #ef4444' : '1px solid var(--border)',
                borderRadius: 10,
                padding: '12px 42px 12px 12px',
                fontSize: 14,
                fontFamily: 'inherit',
                outline: 'none'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                border: 'none',
                background: 'transparent',
                position: 'absolute',
                top: '50%',
                right: 12,
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'inline-flex',
                padding: 0
              }}
              aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p style={{ color: '#ef4444', marginTop: 10, marginBottom: 0, fontSize: 13 }}>{error}</p>}

          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              marginTop: 16,
              width: '100%',
              border: 'none',
              borderRadius: 10,
              padding: 12,
              fontSize: 14,
              fontWeight: 600,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              background: canSubmit ? 'var(--primary)' : '#cbd5e1',
              color: '#fff'
            }}
          >
            {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <div style={{ marginTop: 16, textAlign: 'center', fontSize: 13 }}>
          <Link to="/" style={{ color: 'var(--primary)', fontWeight: 500 }}>
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
