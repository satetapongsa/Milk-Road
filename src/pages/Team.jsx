import { User, Award, Heart, Sparkles } from 'lucide-react';

export default function Team() {
    return (
        <div className="container" style={{ padding: '60px 24px', maxWidth: '800px' }}>
            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1 style={{ fontSize: '38px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '16px' }}>
                    ทีมงานของเรา / Our Team
                </h1>
                <p style={{ fontSize: '17px', color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                    ทำความรู้จักกับผู้ก่อตั้งและผู้พัฒนาเบื้องหลังแพลตฟอร์ม Pharm Road
                </p>
            </div>

            {/* Founder Profile Card */}
            <div style={{ 
                background: 'white', 
                border: '1px solid var(--border)', 
                borderRadius: '24px', 
                padding: '40px', 
                boxShadow: '0 20px 40px -20px rgba(0,0,0,0.1)',
                marginBottom: '40px',
                textAlign: 'center'
            }}>
                {/* Avatar Placeholder / Styled Circle */}
                <div style={{ 
                    width: '120px', 
                    height: '120px', 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 24px auto',
                    boxShadow: '0 10px 20px rgba(79, 70, 229, 0.2)'
                }}>
                    <User size={60} />
                </div>

                <h2 style={{ fontSize: '26px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                    satetapong sanguansuk
                </h2>
                <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px' }}>
                    Founder & Lead System Architect
                </p>
                
                <div style={{ width: '50px', height: '3px', background: 'var(--primary)', margin: '0 auto 24px auto', borderRadius: '2px' }}></div>

                <p style={{ fontSize: '15px', color: 'var(--text-main)', lineHeight: '1.8', maxWidth: '650px', margin: '0 auto text-align-justify' }}>
                    คุณ <strong>satetapong sanguansuk</strong> คือผู้ริเริ่มวิสัยทัศน์ของแพลตฟอร์ม <strong>Pharm Road</strong> ดิจิทัลฟาร์มาซีชั้นนำ ด้วยความตั้งใจที่จะรวมเอาความปลอดภัยในการเข้าถึงยาสามัญประจำบ้านและเทคโนโลยี E-commerce สมัยใหม่เข้าด้วยกัน เพื่อช่วยลดความยุ่งยากในการดูแลสุขภาพของทุกคน
                </p>
            </div>

            {/* Brand Journey Timeline */}
            <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '24px', textAlign: 'center' }}>
                    <Sparkles size={20} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} color="var(--primary)" /> 
                    การสร้างแบรนด์ Pharm Road
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', gap: '20px', background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <div style={{ padding: '10px', borderRadius: '50%', background: 'rgba(79,70,229,0.1)', color: 'var(--primary)', height: 'fit-content' }}>
                            <Award size={20} />
                        </div>
                        <div>
                            <strong style={{ fontSize: '16px', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>จุดเริ่มต้นและแนวคิด (The Vision)</strong>
                            <span style={{ fontSize: '14px', color: 'var(--text-light)', lineHeight: '1.6' }}>
                                แบรนด์ถูกริเริ่มขึ้นเพื่อแก้ปัญหาความยุ่งยากในเข้าถึงยาและอาหารเสริมที่น่าเชื่อถือ โดยออกแบบให้อยู่ในรูปแบบเว็บไซต์พรีเมียม สวยงาม สะอาด และเข้าใจง่ายที่สุด
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <div style={{ padding: '10px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', color: '#10b981', height: 'fit-content' }}>
                            <Heart size={20} />
                        </div>
                        <div>
                            <strong style={{ fontSize: '16px', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>ใส่ใจในคุณภาพและความแม่นยำ (Quality First)</strong>
                            <span style={{ fontSize: '14px', color: 'var(--text-light)', lineHeight: '1.6' }}>
                                ทุกขั้นตอนการออกแบบรูปภาพ AI และการเขียนข้อมูลรายละเอียดบรรจุภัณฑ์ ได้รับการกลั่นกรองและตรวจสอบอย่างประณีต เพื่อความถูกต้องสูงสุดของผู้ใช้งาน
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
