import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-brand">
                    <img src="/images/logo.png" alt="Milk Road" style={{ height: '48px', marginBottom: '16px' }} />
                    <p>Platform E-commerce ระดับ Enterprise ที่ช่วยให้ธุรกิจของคุณเติบโตอย่างก้าวกระโดด</p>
                </div>
                <div className="footer-links">
                    <div className="link-group">
                        <h4>เกี่ยวกับเรา</h4>
                        <Link to="/">บริษัท</Link>
                        <Link to="/">ทีมงาน</Link>
                        <Link to="/">ร่วมงานกับเรา</Link>
                    </div>
                    <div className="link-group">
                        <h4>ช่วยเหลือ</h4>
                        <Link to="/">ศูนย์ช่วยเหลือ</Link>
                        <Link to="/">การจัดส่ง</Link>
                        <Link to="/">การคืนสินค้า</Link>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Milk Road. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
