import { useState } from 'react';
import { Shield, Users, Clock, Award, ZoomIn, X, Zap, Lock, Smartphone } from 'lucide-react';

export default function About() {
    const [isZoomed, setIsZoomed] = useState(false);

    return (
        <div className="container" style={{ padding: '60px 24px', maxWidth: '1000px' }}>
            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '40px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '16px' }}>
                    เกี่ยวกับเรา / About Us
                </h1>
                <p style={{ fontSize: '18px', color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                    ยินดีต้อนรับสู่ Pharm Road แพลตฟอร์มร้านขายยาดิจิทัลระดับพรีเมียมที่มุ่งมั่นส่งมอบสุขภาพที่ดีสู่คุณ
                </p>
            </div>

            {/* Content Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center', marginBottom: '60px' }}>
                {/* Brand Image and Expand Logic */}
                <div style={{ position: 'relative', textAlign: 'center' }}>
                    <div 
                        style={{ 
                            position: 'relative', 
                            display: 'inline-block',
                            borderRadius: '24px', 
                            overflow: 'hidden', 
                            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15)',
                            cursor: 'zoom-in',
                            transition: 'transform 0.3s ease'
                        }}
                        onClick={() => setIsZoomed(true)}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <img 
                            src="/images/logo.png" 
                            alt="Pharm Road Logo Profile" 
                            style={{ width: '100%', maxWidth: '380px', height: 'auto', display: 'block', backgroundColor: '#f8fafc' }}
                        />
                        <div style={{ 
                            position: 'absolute', 
                            bottom: '16px', 
                            right: '16px', 
                            background: 'rgba(15, 23, 42, 0.7)', 
                            color: 'white', 
                            padding: '8px 12px', 
                            borderRadius: '30px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px',
                            fontSize: '13px',
                            backdropFilter: 'blur(4px)'
                        }}>
                            <ZoomIn size={14} /> คลิกเพื่อขยายรูป
                        </div>
                    </div>
                </div>

                {/* History & Details */}
                <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '20px', color: 'var(--primary)' }}>
                        ประวัติความเป็นมา
                    </h2>
                    <p style={{ fontSize: '15px', color: 'var(--text-main)', lineHeight: '1.8', marginBottom: '16px' }}>
                        <strong>Pharm Road</strong> ก่อตั้งขึ้นจากวิสัยทัศน์ที่ต้องการทำให้การเข้าถึงเวชภัณฑ์ยาสามัญประจำบ้านและอาหารเสริมเป็นเรื่องที่ง่าย ปลอดภัย และสะดวกสบายที่สุดสำหรับคนไทยทุกคน เราได้นำเทคโนโลยี E-commerce ระดับ Enterprise เข้ามารวมกับมาตรฐานการบริการทางยาที่ถูกต้องเพื่อสร้างประสบการณ์ที่น่าเชื่อถือที่สุด
                    </p>
                    <p style={{ fontSize: '15px', color: 'var(--text-main)', lineHeight: '1.8', marginBottom: '24px' }}>
                        ด้วยการใช้ฐานข้อมูลคลาวด์ยุคใหม่อย่าง Neon PostgreSQL ทำให้มั่นใจได้ว่าระบบคำสั่งซื้อ การออกใบเสร็จรับเงิน และใบเสนอราคาทำงานได้รวดเร็วทันใจ พร้อมรองรับระบบการควบคุมและจัดส่งยาที่ได้มาตรฐานสาธารณสุข
                    </p>

                    {/* Key Stats / Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                                <Shield size={20} />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>ปลอดภัย 100%</h4>
                                <small style={{ color: 'var(--text-light)' }}>ยาแท้จากแล็บมาตรฐาน</small>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' }}>
                                <Users size={20} />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>บริการใส่ใจ</h4>
                                <small style={{ color: 'var(--text-light)' }}>พร้อมดูแลคุณเสมอ</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Web App Specs Card */}
            <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '24px', padding: '36px', marginTop: '40px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Award size={22} color="var(--primary)" /> รายละเอียดของแพลตฟอร์ม (Platform Architecture)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginTop: '20px' }}>
                    <div>
                        <strong style={{ fontSize: '15px', color: 'var(--text-main)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <Zap size={16} color="var(--primary)" /> Fast Performance
                        </strong>
                        <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '6px', lineHeight: '1.5' }}>
                            ขับเคลื่อนด้วย React และ Vite ตัวเลือกล่าสุด มอบความเร็วในการเรนเดอร์สูงสุดในเสี้ยววินาที
                        </p>
                    </div>
                    <div>
                        <strong style={{ fontSize: '15px', color: 'var(--text-main)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <Lock size={16} color="var(--primary)" /> Neon PostgreSQL
                        </strong>
                        <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '6px', lineHeight: '1.5' }}>
                            เก็บข้อมูลแบบ Cloud-Serverless ปลอดภัย เชื่อถือได้ ข้อมูลสินค้าไม่มีตกหล่น
                        </p>
                    </div>
                    <div>
                        <strong style={{ fontSize: '15px', color: 'var(--text-main)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <Smartphone size={16} color="var(--primary)" /> Ultra Responsive
                        </strong>
                        <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '6px', lineHeight: '1.5' }}>
                            แสดงผลได้ไร้ที่ติบนอุปกรณ์ทุกขนาด ไม่ว่าจะเป็นคอมพิวเตอร์ แท็บเล็ต หรือสมาร์ทโฟน
                        </p>
                    </div>
                </div>
            </div>

            {/* Image Zoom Modal overlay */}
            {isZoomed && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2000,
                        animation: 'fadeIn 0.25s ease-out'
                    }}
                    onClick={() => setIsZoomed(false)}
                >
                    <button 
                        style={{
                            position: 'absolute',
                            top: '24px',
                            right: '24px',
                            background: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                        onClick={() => setIsZoomed(false)}
                    >
                        <X size={20} />
                    </button>
                    <img 
                        src="/images/logo.png" 
                        alt="Pharm Road Logo Zoomed" 
                        style={{ 
                            maxWidth: '90%', 
                            maxHeight: '90%', 
                            borderRadius: '16px', 
                            backgroundColor: 'white', 
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }} 
                    />
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
}
