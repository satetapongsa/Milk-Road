export const CONFIG = {
    vatRate: 0.07,
    shippingCost: 0, // Instant digital online textbook delivery
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
        "name": "[ตำราเรียนออนไลน์ฟรี 5 หน้าแรก] สรุปชีววิทยา ม.4-6 ฉบับอัปแน่นเตรียมสอบมหาลัย (A-Level Bio Online Textbook)",
        "price": 0,
        "is_free_sample": true,
        "category": "ตำราชีววิทยา (Free Textbook)",
        "image": "/images/hero_banner.jpg",
        "description": "🎁 ตำราเรียนออนไลน์แจกฟรีพิเศษ! เปิดให้อ่านฟรี 5 หน้าแรกทันทีเพื่อทดลองอ่านกระตุ้นความเข้าใจ สรุปเข้ม 5 หมวดใหญ่ เน้นจุดออกสอบบ่อย A-Level สามารถสั่งซื้อหนังสือเล่มเต็มปลดล็อค 150 หน้าได้ตลอด 24 ชั่วโมง!",
        "specs": [
            "หนังสือตำราเรียนออนไลน์ฉบับเต็ม เปิดอ่านในระบบได้ทันที",
            "สรุปเนื้อหาอัปแน่น 5 หมวดใหญ่ ม.4 - ม.6 (150 หน้า)",
            "มีคีย์เวิร์ดภาษาอังกฤษ + แผนผัง Mind Map ประกอบ",
            "เก็งจุดออกสอบบ่อยและช้อยหลอกในห้องสอบ A-Level"
        ],
        "stock_quantity": 999,
        "ingredients": "ผู้เขียน: อ.ดร.จิราพร (ภาควิชาชีววิทยา) & ทีมเกียรตินิยม StudyRoad Bio",
        "origin": "StudyRoad Online Textbook Platform",
        "mfg_date": "2026-08-29",
        "exp_date": "ฉบับอัปเดตเตรียมสอบ A-Level ปี 2026"
    },
    {
        "id": 2,
        "name": "[ตำราเรียนออนไลน์ + คอร์สวิดีโอ] แคลคูลัส 1 สรุปเนื้อหา + ตะลุยโจทย์มหาวิทยาลัย (Calculus I Master Textbook)",
        "price": 290,
        "category": "ตำราแคลคูลัส (Textbook)",
        "image": "/images/calculus_cover.jpg",
        "description": "หนังสือตำราเรียนออนไลน์ 120 หน้า พร้อมคอร์สวิดีโอประกอบ 18 ชั่วโมง ครอบคลุมเรื่อง ลิมิต, อนุพันธ์, การประยุกต์อนุพันธ์, อินทิกรัล และการหาพื้นที่ เหมาะสำหรับนิสิตนักศึกษาสายวิศวะฯ และวิทยาศาสตร์",
        "specs": [
            "หนังสือตำราเรียนออนไลน์ 120 หน้า อ่านในระบบเว็บ",
            "คอร์สวิดีโอประกอบ 18 ชม. ดูได้ตลอดชีพ",
            "โจทย์พร้อมเฉลยละเอียด 300 ข้อ"
        ],
        "stock_quantity": 999,
        "ingredients": "ผู้เขียน: ดร.กิตติศักดิ์ (ทีมอาจารย์ StudyRoad Math)",
        "origin": "StudyRoad Online Textbook + Video Streaming",
        "mfg_date": "2026-08-01",
        "exp_date": "อัปเดตเวอร์ชันปี 2026"
    },
    {
        "id": 3,
        "name": "[ตำราเรียนออนไลน์] สรุปสูตรและเทคนิคคิดลัด แคลคูลัส 2 (Calculus II Online Textbook)",
        "price": 150,
        "category": "ตำราแคลคูลัส (Textbook)",
        "image": "/images/calculus_cover.jpg",
        "description": "หนังสือตำราเรียนออนไลน์สรุปสูตร แคลคูลัส 2 เรื่องลำดับ อนุกรม อนุกรมเทย์เลอร์ พิกัดเชิงขั้ว และอินทิกรัลหลายชั้น สรุปสั้น กระชับ แม่นยำ อ่านจบใน 45 หน้า",
        "specs": [
            "หนังสือตำราเรียนในระบบ 45 หน้า",
            "Mind Map สรุปสูตรสำคัญทุกบท",
            "เข้าอ่านในเว็บได้ทันทีหลังชำระเงิน"
        ],
        "stock_quantity": 999,
        "ingredients": "ผู้เขียน: ทีมเกียรตินิยมแคลคูลัส StudyRoad",
        "origin": "StudyRoad Online Textbook Platform",
        "mfg_date": "2026-07-15",
        "exp_date": "อัปเดตเวอร์ชันปี 2026"
    },
    {
        "id": 4,
        "name": "[ตำราเรียนออนไลน์ + คอร์สวิดีโอ] ฟิสิกส์ ม.ปลาย & มหาวิทยาลัย: กลศาสตร์และแรง (Physics Mechanics Textbook)",
        "price": 350,
        "category": "ตำราฟิสิกส์ (Textbook)",
        "image": "/images/hero_banner.jpg",
        "description": "หนังสือตำราเรียนฟิสิกส์ออนไลน์เรื่อง การเคลื่อนที่, กฎของนิวตัน, งานและพลังงาน, โมเมนตัม และการหมุน พร้อมคลิปวิดีโออธิบายการคำนวณทีละขั้นตอนอย่างละเอียด",
        "specs": [
            "หนังสือตำราเรียนออนไลน์ 150 หน้า",
            "วิดีโอเฉลยโจทย์ประกอบ 24 ชั่วโมง",
            "แจกสูตรลัดและข้อควรระวังในห้องสอบ"
        ],
        "stock_quantity": 999,
        "ingredients": "ผู้เขียน: อาจารย์ชินวุฒิ (สถาบันฟิสิกส์ StudyRoad)",
        "origin": "StudyRoad Online Textbook + Streaming",
        "mfg_date": "2026-08-05",
        "exp_date": "อัปเดตเวอร์ชันปี 2026"
    },
    {
        "id": 5,
        "name": "[ตำราเรียนออนไลน์ + คอร์สวิดีโอ] สรุปเคมีอินทรีย์ Visual Mind Map & กลไกปฏิกิริยา (Organic Chemistry Textbook)",
        "price": 290,
        "category": "ตำราเคมี (Textbook)",
        "image": "/images/hero_banner.jpg",
        "description": "หนังสือตำราเรียนเคมีออนไลน์ สารประกอบไฮโดรคาร์บอน หมู่ฟังก์ชัน กลไกปฏิกิริยา (Reaction Mechanisms) สรุปเป็นแผนภาพสีวาดมือ 80 หน้า สวยงาม อ่านสนุก ไม่น่าเบื่อ",
        "specs": [
            "หนังสือตำราเรียนออนไลน์ 80 หน้า วาดมือสีสันสวยงาม",
            "วิดีโอสรุปกลไกปฏิกิริยา 10 ชม.",
            "สรุปชื่อ IUPAC และปฏิกิริยาสำคัญ"
        ],
        "stock_quantity": 999,
        "ingredients": "ผู้เขียน: ดร.จิราพร (ภาควิชาเคมี)",
        "origin": "StudyRoad Online Textbook + Streaming",
        "mfg_date": "2026-08-12",
        "exp_date": "อัปเดตเวอร์ชันปี 2026"
    },
    {
        "id": 6,
        "name": "[ตำราเรียนออนไลน์] รวมชุดข้อสอบพร้อมเฉลยละเอียด A-Level STEM (Calculus, Physics, Chem, Bio Textbook)",
        "price": 320,
        "category": "ตำรารวมข้อสอบ (Exam Prep Textbook)",
        "image": "/images/hero_banner.jpg",
        "description": "หนังสือตำราเรียนรวมคลังข้อสอบเก่า 4 วิชาหลัก (แคลคูลัส ฟิสิกส์ เคมี ชีววิทยา) ย้อนหลัง 7 ปี พร้อมเฉลยวิธีทำอย่างละเอียดทีละข้อ เข้าใจที่มาที่ไปของคำตอบ",
        "specs": [
            "หนังสือตำราเรียนออนไลน์รวมมากกว่า 350 หน้า",
            "เฉลยวิธีคิดละเอียดทุกข้อ",
            "เก็งแนวข้อสอบปีล่าสุด"
        ],
        "stock_quantity": 999,
        "ingredients": "ผู้เขียน: คณะอาจารย์ผู้เก็งข้อสอบ StudyRoad",
        "origin": "StudyRoad Online Textbook Platform",
        "mfg_date": "2026-08-14",
        "exp_date": "อัปเดตเวอร์ชันปี 2026"
    },
    {
        "id": 7,
        "name": "[Interactive Techbook] CCNA 200-301 Network Master Guide & Interactive Blueprint (Network Fundamentals & CLI Lab)",
        "price": 390,
        "category": "ตำราไอที & เครือข่าย (Techbook)",
        "image": "/images/ccna_cover.svg",
        "is_ccna_reader": true,
        "description": "หนังสือตำราเรียนออนไลน์เครือข่ายแบบโต้ตอบ (CCNA 200-301 Interactive Dark-Mode Techbook) สรุปเข้ม OSI 7 Layers vs TCP/IP, IP Subnetting, VLAN, Trunking 802.1Q, STP, OSPF, และ CLI Labs คำสั่ง Cisco IOS สำหรับเตรียมสอบสอบใบเซอร์ Cisco CCNA 200-301 v1.2 อัปเดตล่าสุด!",
        "specs": [
            "หนังสือตำราเรียนออนไลน์โต้ตอบแบบสไลด์ + โน้ต + CLI Simulator",
            "ครอบคลุมเนื้อหา OSI 7 Layers, IP Addressing, VLAN, STP, OSPF, Automation",
            "มีแบบทดสอบ Quiz วัดผลในตัวระบบหลังเรียนจบแต่ละบท",
            "เข้าอ่านในระบบได้ตลอดชีพ 24 ชั่วโมง"
        ],
        "stock_quantity": 999,
        "ingredients": "ผู้เขียน: Senior Network Engineer (CCNP/CCIE Certified) & StudyRoad Tech",
        "origin": "StudyRoad Interactive Techbook Platform",
        "mfg_date": "2026-08-30",
        "exp_date": "CCNA 200-301 v1.2 Latest Blueprint"
    }
];
