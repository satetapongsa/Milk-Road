import { Briefcase, Send, Gift, MapPin } from 'lucide-react';

export default function JoinUs() {
    const handleApply = (e) => {
        e.preventDefault();
        alert('ส่งข้อมูลการสมัครสำเร็จ! ขอบคุณที่สนใจร่วมงานกับ Pharm Road');
    };

    return (
        <div className="container" style={{ padding: '60px 24px', maxWidth: '800px' }}>
            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1 style={{ fontSize: '38px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '16px' }}>
                    ร่วมงานกับเรา / Join Our Team
                </h1>
                <p style={{ fontSize: '17px', color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                    มาร่วมสร้างสรรค์และปฏิวัติวงการร้านขายยาดิจิทัลพรีเมียมไปด้วยกัน
                </p>
            </div>

            {/* Benefits Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '50px' }}>
                <div style={{ padding: '24px', border: '1px solid var(--border)', borderRadius: '16px', background: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <Gift size={20} color="var(--primary)" />
                        <strong style={{ fontSize: '16px' }}>สวัสดิการสุดพิเศษ</strong>
                    </div>
                    <span style={{ fontSize: '14px', color: 'var(--text-light)', lineHeight: '1.5' }}>
                        ประกันสุขภาพกลุ่ม, วันหยุดพักร้อนประจำปี, ส่วนลดเวชภัณฑ์และอาหารเสริมราคาพนักงาน
                    </span>
                </div>

                <div style={{ padding: '24px', border: '1px solid var(--border)', borderRadius: '16px', background: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <MapPin size={20} color="var(--primary)" />
                        <strong style={{ fontSize: '16px' }}>ทำงานแบบ Flexible</strong>
                    </div>
                    <span style={{ fontSize: '14px', color: 'var(--text-light)', lineHeight: '1.5' }}>
                        สนับสนุนนโยบายการทำงานแบบ Hybrid / Work from Anywhere เพื่อสมดุลชีวิตและการทำงานที่ดีที่สุด
                    </span>
                </div>
            </div>

            {/* Application Form */}
            <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '24px', padding: '36px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Briefcase size={22} color="var(--primary)" /> กรอกข้อมูลสมัครงานเบื้องต้น
                </h3>

                <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>ชื่อ-นามสกุล</label>
                            <input 
                                type="text" 
                                required 
                                placeholder="ภาษาไทย หรือ อังกฤษ" 
                                style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', background: 'white' }} 
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>ตำแหน่งที่สนใจ</label>
                            <select style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
                                <option>Pharmacist (เภสัชกรประจำร้าน)</option>
                                <option>Frontend Developer (React/Vite)</option>
                                <option>Backend Developer (Node.js/PostgreSQL)</option>
                                <option>Digital Marketing</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>อีเมลติดต่อกลับ</label>
                        <input 
                            type="email" 
                            required 
                            placeholder="example@email.com" 
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', background: 'white' }} 
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>แนะนำตัวสั้นๆ และแนบลิงก์ Resume/Portfolio</label>
                        <textarea 
                            required 
                            placeholder="บอกให้เรารู้จักคุณมากขึ้น..." 
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', background: 'white', minHeight: '100px', resize: 'vertical' }} 
                        ></textarea>
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', width: '100%', fontSize: '15px', fontWeight: '600' }}
                    >
                        <Send size={16} /> ส่งใบสมัครงาน
                    </button>
                </form>
            </div>
        </div>
    );
}
