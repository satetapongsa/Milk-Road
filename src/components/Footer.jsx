export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-brand">
                    <h3>Milk Road<span className="logo-dot">.</span></h3>
                    <p>Platform E-commerce ระดับ Enterprise ที่ช่วยให้ธุรกิจของคุณเติบโตอย่างก้าวกระโดด</p>
                </div>
                <div className="footer-links">
                    <div className="link-group">
                        <h4>เกี่ยวกับเรา</h4>
                        <a href="#">บริษัท</a>
                        <a href="#">ทีมงาน</a>
                        <a href="#">ร่วมงานกับเรา</a>
                    </div>
                    <div className="link-group">
                        <h4>ช่วยเหลือ</h4>
                        <a href="#">ศูนย์ช่วยเหลือ</a>
                        <a href="#">การจัดส่ง</a>
                        <a href="#">การคืนสินค้า</a>
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
