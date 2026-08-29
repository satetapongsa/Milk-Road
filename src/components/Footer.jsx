import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-brand">
                    <img src="/images/logo.png" alt="StudyRoad" style={{ height: '48px', marginBottom: '16px', borderRadius: '8px' }} />
                    <p>StudyRoad - แพลตฟอร์มคอร์สเรียนออนไลน์ สรุปชีทเรียน PDF แคลคูลัส ฟิสิกส์ เคมี ชีววิทยา คุณภาพระดับพรีเมียม</p>
                </div>
                <div className="footer-links">
                    <div className="link-group">
                        <h4>เกี่ยวกับเรา</h4>
                        <Link to="/about">เกี่ยวกับ StudyRoad</Link>
                        <Link to="/team">ทีมงาน & ผู้สอน</Link>
                        <Link to="/join-us">ร่วมงานกับเรา</Link>
                    </div>
                    <div className="link-group">
                        <h4>บริการสถาบัน</h4>
                        <Link to="/quotation-request">ขอใบเสนอราคาองค์กร/โรงเรียน</Link>
                        <Link to="/orders">ดาวน์โหลดไฟล์สั่งซื้อ</Link>
                    </div>
                    <div className="link-group">
                        <h4>ระบบจัดการ</h4>
                        <Link to="/admin-login" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Lock size={16} />
                            Admin Console
                        </Link>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} StudyRoad Platform. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
