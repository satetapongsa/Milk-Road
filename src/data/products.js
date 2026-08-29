export const CONFIG = {
    vatRate: 0.07,
    shippingCost: 0, // Instant digital file delivery
    currency: '฿'
};

export const formatPrice = (price) => {
    return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
        minimumFractionDigits: 0
    }).format(price);
};

export const products = [
    {
        "id": 1,
        "name": "[เปิดอ่านฟรี 5 หน้าแรก] สรุปชีววิทยา ม.4-6 ฉบับอัปแน่นเตรียมสอบมหาลัย (A-Level Bio High-Yield Master Summary)",
        "price": 0,
        "is_free_sample": true,
        "category": "ชีววิทยา (Free Sample)",
        "image": "/images/hero_banner.jpg",
        "description": "🎁 เล่มแจกฟรีพิเศษ! เปิดให้อ่านฟรี 5 หน้าแรกทันทีเพื่อทดลองอ่านกระตุ้นความเข้าใจ สรุปเข้ม 5 หมวดใหญ่ เน้นจุดออกสอบบ่อย A-Level สามารถสั่งซื้อเล่มเต็มปลดล็อค 150 หน้าได้ตลอด 24 ชั่วโมง!",
        "specs": [
            "ชีทสรุปฉบับเต็ม เปิดอ่านในระบบได้ทันที",
            "สรุปเนื้อหาอัปแน่น 5 หมวดใหญ่ ม.4 - ม.6 (150 หน้า)",
            "มีคีย์เวิร์ดภาษาอังกฤษ + แผนผัง Mind Map ประกอบ",
            "เก็งจุดออกสอบบ่อยและช้อยหลอกในห้องสอบ A-Level"
        ],
        "stock_quantity": 999,
        "ingredients": "จัดทำโดย: อ.ดร.จิราพร (ภาควิชาชีววิทยา) & ทีมเกียรตินิยม StudyRoad Bio",
        "origin": "StudyRoad Web Reader",
        "mfg_date": "2026-08-29",
        "exp_date": "ฉบับอัปเดตเตรียมสอบ A-Level ปี 2026"
    },
    {
        "id": 2,
        "name": "[คอร์สเรียน + เว็บชีทสรุป] แคลคูลัส 1 สรุปเนื้อหา + ตะลุยโจทย์มหาวิทยาลัย (Calculus I Masterclass)",
        "price": 290,
        "category": "แคลคูลัส (Calculus)",
        "image": "/images/calculus_cover.jpg",
        "description": "สรุปชีทเรียน 120 หน้า พร้อมคอร์สวิดีโอ 18 ชั่วโมง ครอบคลุมเรื่อง ลิมิต, อนุพันธ์, การประยุกต์อนุพันธ์, อินทิกรัล และการหาพื้นที่ เหมาะสำหรับนิสิตนักศึกษาสายวิศวะฯ และวิทยาศาสตร์",
        "specs": [
            "สรุปชีทเรียน 120 หน้า อ่านในระบบเว็บ",
            "คอร์สวิดีโอ 18 ชม. ดูได้ตลอดชีพ",
            "โจทย์พร้อมเฉลยละเอียด 300 ข้อ"
        ],
        "stock_quantity": 999,
        "ingredients": "ผู้สอน: ดร.กิตติศักดิ์ (ทีมอาจารย์ StudyRoad Math)",
        "origin": "StudyRoad Web Reader + Streaming",
        "mfg_date": "2026-08-01",
        "exp_date": "อัปเดตเวอร์ชันปี 2026"
    },
    {
        "id": 3,
        "name": "[เว็บชีทสรุป] สรุปสูตรและเทคนิคคิดลัด แคลคูลัส 2 (Calculus II Cheat Sheet)",
        "price": 150,
        "category": "แคลคูลัส (Calculus)",
        "image": "/images/calculus_cover.jpg",
        "description": "สรุปชีทสรุปสูตร แคลคูลัส 2 เรื่องลำดับ อนุกรม อนุกรมเทย์เลอร์ พิกัดเชิงขั้ว และอินทิกรัลหลายชั้น สรุปสั้น กระชับ แม่นยำ อ่านจบใน 45 หน้า",
        "specs": [
            "ชีทสรุปในระบบ 45 หน้า",
            "Mind Map สรุปสูตรสำคัญทุกบท",
            "เข้าอ่านได้ทันทีหลังชำระเงิน"
        ],
        "stock_quantity": 999,
        "ingredients": "จัดทำโดย: ทีมเกียรตินิยมแคลคูลัส StudyRoad",
        "origin": "StudyRoad Web Reader",
        "mfg_date": "2026-07-15",
        "exp_date": "อัปเดตเวอร์ชันปี 2026"
    },
    {
        "id": 4,
        "name": "[คอร์สเรียน + เว็บชีทสรุป] ฟิสิกส์ ม.ปลาย & มหาวิทยาลัย: กลศาสตร์และแรง (Physics Mechanics)",
        "price": 350,
        "category": "ฟิสิกส์ (Physics)",
        "image": "/images/hero_banner.jpg",
        "description": "สรุปชีทฟิสิกส์เรื่อง การเคลื่อนที่, กฎของนิวตัน, งานและพลังงาน, โมเมนตัม และการหมุน พร้อมคลิปวิดีโออธิบายการคำนวณทีละขั้นตอนอย่างละเอียด",
        "specs": [
            "ชีทสรุปในระบบ 150 หน้า สีสันสดใส",
            "วิดีโอเฉลยโจทย์ 24 ชั่วโมง",
            "แจกสูตรลัดและข้อควรระวังในห้องสอบ"
        ],
        "stock_quantity": 999,
        "ingredients": "ผู้สอน: อาจารย์ชินวุฒิ (สถาบันฟิสิกส์ StudyRoad)",
        "origin": "StudyRoad Web Reader + Streaming",
        "mfg_date": "2026-08-05",
        "exp_date": "อัปเดตเวอร์ชันปี 2026"
    },
    {
        "id": 5,
        "name": "[คอร์สเรียน + เว็บชีทสรุป] สรุปเคมีอินทรีย์ Visual Mind Map & กลไกปฏิกิริยา (Organic Chemistry Notes)",
        "price": 290,
        "category": "เคมี (Chemistry)",
        "image": "/images/hero_banner.jpg",
        "description": "สรุปสารประกอบไฮโดรคาร์บอน หมู่ฟังก์ชัน กลไกปฏิกิริยา (Reaction Mechanisms) สรุปเป็นแผนภาพสีวาดมือ 80 หน้า สวยงาม อ่านสนุก ไม่น่าเบื่อ",
        "specs": [
            "ชีทสรุป 80 หน้า วาดมือสีสันสวยงาม",
            "วิดีโอสรุปกลไกปฏิกิริยา 10 ชม.",
            "สรุปชื่อ IUPAC และปฏิกิริยาสำคัญ"
        ],
        "stock_quantity": 999,
        "ingredients": "จัดทำโดย: ดร.จิราพร (ภาควิชาเคมี)",
        "origin": "StudyRoad Web Reader + Streaming",
        "mfg_date": "2026-08-12",
        "exp_date": "อัปเดตเวอร์ชันปี 2026"
    },
    {
        "id": 6,
        "name": "[คอร์สเรียน + เว็บชีทสรุป] รวมชุดข้อสอบพร้อมเฉลยละเอียด A-Level STEM (Calculus, Physics, Chem, Bio)",
        "price": 320,
        "category": "รวมข้อสอบ & ตะลุยโจทย์ (Exam Prep)",
        "image": "/images/hero_banner.jpg",
        "description": "คลังไฟล์ข้อสอบเก่า 4 วิชาหลัก (แคลคูลัส ฟิสิกส์ เคมี ชีววิทยา) ย้อนหลัง 7 ปี พร้อมเฉลยวิธีทำอย่างละเอียดทีละข้อ เข้าใจที่มาที่ไปของคำตอบ",
        "specs": [
            "สรุปในระบบรวมมากกว่า 350 หน้า",
            "เฉลยวิธีคิดละเอียดทุกข้อ",
            "เก็งแนวข้อสอบปีล่าสุด"
        ],
        "stock_quantity": 999,
        "ingredients": "จัดทำโดย: คณะอาจารย์ผู้เก็งข้อสอบ StudyRoad",
        "origin": "StudyRoad Web Reader",
        "mfg_date": "2026-08-14",
        "exp_date": "อัปเดตเวอร์ชันปี 2026"
    },
    {
        "id": 7,
        "name": "[Interactive E-Reader] CCNA 200-301 Network Master Guide & Interactive Blueprint (Network Fundamentals, Switching & CLI Lab)",
        "price": 390,
        "category": "เครือข่าย & ไอที (CCNA Network)",
        "image": "/images/ccna_cover.svg",
        "is_ccna_reader": true,
        "description": "ระบบอ่านบทเรียนเครือข่ายแบบโต้ตอบ (CCNA 200-301 Interactive Dark-Mode Reader) สรุปเข้ม OSI 7 Layers vs TCP/IP, IP Subnetting, VLAN, Trunking 802.1Q, STP, OSPF, และ CLI Labs คำสั่ง Cisco IOS สำหรับเตรียมสอบสอบใบเซอร์ Cisco CCNA 200-301 v1.2 อัปเดตล่าสุด!",
        "specs": [
            "ระบบอ่าน Interactive Dark Reader แบบสไลด์ + โน้ต + CLI Simulator",
            "ครอบคลุมเนื้อหา OSI 7 Layers, IP Addressing, VLAN, STP, OSPF, Automation",
            "มีแบบทดสอบ Quiz วัดผลในตัวระบบหลังเรียนจบแต่ละบท",
            "เข้าอ่านในระบบได้ตลอดชีพ 24 ชั่วโมง"
        ],
        "stock_quantity": 999,
        "ingredients": "ผู้จัดทำ: Senior Network Engineer (CCNP/CCIE Certified) & StudyRoad Tech",
        "origin": "Interactive E-Learning Platform (StudyRoad Reader)",
        "mfg_date": "2026-08-30",
        "exp_date": "CCNA 200-301 v1.2 Latest Blueprint"
    }
];
