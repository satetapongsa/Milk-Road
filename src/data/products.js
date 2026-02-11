export const CONFIG = {
    vatRate: 0.07,
    shippingCost: 50,
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
        id: 1,
        name: "Sony WH-1000XM5 Wireless Headphones",
        price: 12900,
        category: "Audio",
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=600&q=80",
        description: "หูฟังไร้สายแบบครอบหู Sony WH-1000XM5 พร้อมระบบตัดเสียงรบกวนที่ดีที่สุด รูปทรงสวยงาม สวมใส่สบาย แบตเตอรี่ใช้งานได้ยาวนานถึง 30 ชั่วโมง",
        specs: ["Noise Cancelling", "30H Battery", "Bluetooth 5.2", "LDAC Support"]
    },
    {
        id: 2,
        name: "Apple MacBook Air M2 13.6-inch",
        price: 39900,
        category: "Laptop",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=600&q=80",
        description: "แล็ปท็อปที่บางและเบาที่สุดจาก Apple พร้อมชิป M2 รุ่นใหม่ล่าสุด หน้าจอ Liquid Retina ขนาด 13.6 นิ้ว ประสิทธิภาพสูง ประหยัดพลังงาน",
        specs: ["Apple M2 Chip", "8GB RAM", "256GB SSD", "13.6\" Liquid Retina"]
    },
    {
        id: 3,
        name: "Mechanical Keyboard Keychron Q1 Pro",
        price: 7500,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80",
        description: "คีย์บอร์ดแมคคานิคอลไร้สาย Custom ระดับพรีเมียม บอดี้อลูมิเนียม CNC ทั้งตัว เชื่อมต่อได้ทั้งมีสายและ Bluetooth รองรับ QMK/VIA",
        specs: ["Hot-swappable", "Bluetooth 5.1", "Aluminum Body", "QMK/VIA Support"]
    },
    {
        id: 4,
        name: "Logitech MX Master 3S Performance Mouse",
        price: 3990,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80",
        description: "เมาส์ไร้สายเพื่อการทำงานระดับมืออาชีพ ดีไซน์ตามหลักสรีรศาสตร์ scroll wheel ระบบแม่เหล็ก MagSpeed ที่เงียบและแม่นยำ พร้อมคลิกที่เงียบสนิท",
        specs: ["8000 DPI Sensor", "Quiet Clicks", "MagSpeed Scroll", "70 Days Battery"]
    },
    {
        id: 5,
        name: "iPhone 15 Pro Max 256GB Titanium",
        price: 48900,
        category: "Smartphone",
        image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=600&q=80",
        description: "iPhone รุ่น Pro ที่เบาที่สุดเท่าที่เคยมีมา ออกแบบมาด้วยไทเทเนียมเกรดเดียวกับที่ใช้ในอุตสาหกรรมอวกาศ พร้อมชิป A17 Pro ที่เปลี่ยนเกมไปตลอดกาล",
        specs: ["Titanium Design", "A17 Pro Chip", "48MP Camera", "USB-C 3.0"]
    },
    {
        id: 6,
        name: "Samsung Galaxy S24 Ultra 5G",
        price: 46900,
        category: "Smartphone",
        image: "https://images.unsplash.com/photo-1610945265078-3858a0b5d8f4?auto=format&fit=crop&w=600&q=80",
        description: "สมาร์ทโฟน AI เครื่องแรกจาก Samsung มาพร้อมปากกา S Pen ในตัว กล้องความละเอียดสูงถ่ายภาพคมชัดทุกระยะ ซูมได้ไกลถึง 100 เท่า",
        specs: ["Snapdragon 8 Gen 3", "200MP Camera", "S Pen Built-in", "Galaxy AI"]
    },
    {
        id: 7,
        name: "iPad Air 5 64GB Wi-Fi",
        price: 23900,
        category: "Tablet",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80",
        description: "iPad Air พร้อมชิป M1 ที่ปฏิวัติวงการ จอภาพ Liquid Retina 10.9 นิ้ว ที่สวยงาม น่าทึ่ง รองรับ Apple Pencil รุ่นที่ 2",
        specs: ["M1 Chip", "10.9\" Display", "Touch ID", "12MP Ultra Wide Front Camera"]
    },
    {
        id: 8,
        name: "Sony PlayStation 5 Console (Slim)",
        price: 18690,
        category: "Gaming",
        image: "https://images.unsplash.com/photo-1606144042614-b0417c0ed616?auto=format&fit=crop&w=600&q=80",
        description: "เครื่องเกมคอนโซลยุคใหม่ ดีไซน์บางลง มาพร้อม SSD ความเร็วสูงพิเศษ รองรับ Haptic Feedback, Adaptive Triggers และ 3D Audio",
        specs: ["1TB SSD", "4K 120Hz", "Ray Tracing", "Tempest 3D Audio"]
    },
    {
        id: 9,
        name: "Apple Watch Series 9 GPS 45mm",
        price: 15900,
        category: "Smartwatch",
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80",
        description: "นาฬิกาอัจฉริยะที่ทรงพลังที่สุด จอภาพสว่างขึ้น 2 เท่า ชิป S9 SiP รุ่นใหม่ ควบคุมด้วยคำสั่งนิ้ว Double Tap โดยไม่ต้องสัมผัสหน้าจอ",
        specs: ["S9 SiP", "Always-On Retina", "Blood Oxygen", "ECG App"]
    },
    {
        id: 10,
        name: "Dyson V15 Detect Absolute",
        price: 30500,
        category: "Home",
        image: "https://images.unsplash.com/photo-1558317374-a354d5f6d4da?auto=format&fit=crop&w=600&q=80",
        description: "เครื่องดูดฝุ่นไร้สายที่ฉลาดที่สุด พร้อมเลเซอร์ตรวจจับฝุ่นที่มองไม่เห็น เซ็นเซอร์ Piezo วัดขนาดและปริมาณฝุ่น ปรับแรงดูดอัตโนมัติ",
        specs: ["Laser Detect", "Piezo Sensor", "240AW Suction", "60 Mins Run time"]
    },
    {
        id: 11,
        name: "Herman Miller Aeron Chair",
        price: 56900,
        category: "Furniture",
        image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=600&q=80",
        description: "เก้าอี้ทำงานระดับโลกที่ออกแบบตามหลักสรีรศาสตร์ ช่วยลดอาการปวดหลัง นั่งสบายได้ตลอดทั้งวัน วัสดุตาข่ายระบายอากาศยอดเยี่ยม",
        specs: ["Ergonomic Design", "Pellicle Mesh", "PostureFit SL", "Fully Adjustable"]
    },
    {
        id: 12,
        name: "Anker 737 Power Bank (PowerCore 24K)",
        price: 4990,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1609591437809-e9397906c997?auto=format&fit=crop&w=600&q=80",
        description: "แบตเตอรี่สำรองความจุสูง 24,000mAh จ่ายไฟสูงสุด 140W ชาร์จ MacBook Pro ได้สบาย พร้อมหน้าจอ Smart Digital Display บอกสถานะ",
        specs: ["24,000mAh", "140W Output", "Smart Display", "GaNPrime Technology"]
    }
];
