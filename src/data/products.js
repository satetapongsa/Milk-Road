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
        name: "Frostbite (Indica-Dominant Hybrid)",
        price: 650,
        category: "ช่อดอกพรีเมียม (Premium Flowers)",
        image: "/images/1.png",
        description: "ดอกเกรด Top Shelf ไทรโคมแน่น เอฟเฟกต์ผ่อนคลายล้ำลึก เหมาะสำหรับช่วงเวลาก่อนนอน\n\nขนาด: 1 กรัม\n(ราคาอ้างอิงต่อ 1 กรัม สามารถเลือกซื้อแบบ 3.5g หรือ 5g เพื่อรับราคาขายส่งได้)",
        specs: ["Indica-Dominant Hybrid", "1 กรัม", "Top Shelf"]
    },
    {
        id: 2,
        name: "Sunset Sherbet (Relaxing & Calming)",
        price: 600,
        category: "ช่อดอกพรีเมียม (Premium Flowers)",
        image: "/images/2.png",
        description: "กลิ่นหอมหวานอมเปรี้ยวคล้ายเบอร์รี่และซิตรัส ช่วยคลายเครียด ปรับมู้ดให้สงบและอารมณ์ดี\n\nขนาด: 1 กรัม\n(ราคาอ้างอิงต่อ 1 กรัม สามารถเลือกซื้อแบบ 3.5g หรือ 5g เพื่อรับราคาขายส่งได้)",
        specs: ["Relaxing & Calming", "1 กรัม", "Berry & Citrus"]
    },
    {
        id: 3,
        name: "Gelato 41 (Uplifting & Focus)",
        price: 700,
        category: "ช่อดอกพรีเมียม (Premium Flowers)",
        image: "/images/3.png",
        description: "สายพันธุ์ยอดฮิต กลิ่นครีมมี่และของหวานชัดเจน ให้พลังงานตื่นตัว โฟกัสงานได้ดี\n\nขนาด: 1 กรัม\n(ราคาอ้างอิงต่อ 1 กรัม สามารถเลือกซื้อแบบ 3.5g หรือ 5g เพื่อรับราคาขายส่งได้)",
        specs: ["Uplifting & Focus", "1 กรัม", "Creamy Aroma"]
    },
    {
        id: 4,
        name: "OG Kush (Classical Relief)",
        price: 550,
        category: "ช่อดอกพรีเมียม (Premium Flowers)",
        image: "/images/4.png",
        description: "สายพันธุ์ระดับตำนาน กลิ่นเอิร์ธโทนผสมสนและเลมอน ช่วยลดอาการปวดเมื่อยและผ่อนคลายร่างกาย\n\nขนาด: 1 กรัม\n(ราคาอ้างอิงต่อ 1 กรัม สามารถเลือกซื้อแบบ 3.5g หรือ 5g เพื่อรับราคาขายส่งได้)",
        specs: ["Classical Relief", "1 กรัม", "Earthy & Lemon"]
    },
    {
        id: 5,
        name: "Blueberry Muffins (Balanced & Euphoric)",
        price: 680,
        category: "ช่อดอกพรีเมียม (Premium Flowers)",
        image: "/images/5.png",
        description: "หอมกลิ่นมัฟฟินบลูเบอร์รี่อบใหม่ๆ เอฟเฟกต์สมดุล ให้ความรู้สึกเคลิบเคลิ้มและมีความสุข\n\nขนาด: 1 กรัม\n(ราคาอ้างอิงต่อ 1 กรัม สามารถเลือกซื้อแบบ 3.5g หรือ 5g เพื่อรับราคาขายส่งได้)",
        specs: ["Balanced & Euphoric", "1 กรัม", "Sweet Muffin"]
    },
    {
        id: 6,
        name: "Infused Gummies - Mixed Berry",
        price: 490,
        category: "สินค้าแปรรูปและสกัด (Edibles & Extracts)",
        image: "/images/6.png",
        description: "เยลลี่กัมมี่รสผลไม้รวม ทานง่าย ออกฤทธิ์ยาวนาน (มี THC 10mg ต่อ 1 ชิ้น)\n\nขนาด: กระปุก 10 ชิ้น (รวม 100mg THC)",
        specs: ["10mg THC/piece", "กระปุก 10 ชิ้น"]
    },
    {
        id: 7,
        name: "Pre-Rolls - Sativa Blend",
        price: 1290,
        category: "สินค้าแปรรูปและสกัด (Edibles & Extracts)",
        image: "/images/7.png",
        description: "กัญชามวนสำเร็จรูปพร้อมสูบ ใช้ดอก Sativa เกรดพรีเมียมล้วน ไม่ผสมใบ มวนด้วยกระดาษออร์แกนิก\n\nขนาด: แพ็ก 3 มวน (มวนละ 1 กรัม)",
        specs: ["Sativa Blend", "แพ็ก 3 มวน"]
    },
    {
        id: 8,
        name: "THC Vape Cart - Pineapple Express",
        price: 1890,
        category: "สินค้าแปรรูปและสกัด (Edibles & Extracts)",
        image: "/images/8.png",
        description: "หัวพอดน้ำยาสกัดเข้มข้น กลิ่นสับปะรดหอมหวาน สูบนุ่มลื่นคอ (ใช้กับแบตเตอรี่เกลียว 510 ทั่วไป)\n\nขนาด: 1 ml. (1 กรัม)",
        specs: ["Pineapple Express", "1 ml. Cartridge"]
    },
    {
        id: 9,
        name: "CBD Tincture Oil - Spearmint",
        price: 1490,
        category: "สุขภาพและการบำรุง (Wellness & Topicals)",
        image: "/images/9.png",
        description: "น้ำมันหยดใต้ลิ้น CBD สกัดบริสุทธิ์ กลิ่นสเปียร์มินต์หอมเย็น ช่วยเรื่องการนอนหลับและลดความวิตกกังวล\n\nขนาด: 30 ml. (1000mg CBD)",
        specs: ["Spearmint Flavor", "1000mg CBD", "30 ml."]
    },
    {
        id: 10,
        name: "Cannabis Topical - Soothing Balm",
        price: 590,
        category: "สุขภาพและการบำรุง (Wellness & Topicals)",
        image: "/images/10.png",
        description: "ขี้ผึ้งทาภายนอกผสมสารสกัด เนื้อบาล์มซึมไว ช่วยบรรเทาอาการปวดเมื่อยกล้ามเนื้อและลดการอักเสบเฉพาะจุด\n\nขนาด: ตลับ 50 กรัม",
        specs: ["Soothing Balm", "Fast Absorbing", "ตลับ 50 กรัม"]
    },
    {
        id: 11,
        name: "Cannabis Seeds - Feminized (สายพันธุ์ยอดฮิต)",
        price: 1150,
        category: "อุปกรณ์และเมล็ดพันธุ์ (Seeds & Accessories)",
        image: "/images/11.png",
        description: "เมล็ดพันธุ์เพศเมีย 100% อัตราการงอกสูง เหมาะสำหรับนักปลูกที่ต้องการผลผลิตคุณภาพ\n\nขนาด: แพ็ก 3 เมล็ด",
        specs: ["100% Feminized", "High Germination Rate", "แพ็ก 3 เมล็ด"]
    },
    {
        id: 12,
        name: "Glass Bowl Pipe - Rainbow Swirl",
        price: 390,
        category: "อุปกรณ์และเมล็ดพันธุ์ (Seeds & Accessories)",
        image: "/images/12.png",
        description: "ไปป์แก้วทนความร้อนเป่ามือ ลวดลายสีรุ้งสวยงาม ดีไซน์จับถนัดมือ ทำความสะอาดง่าย\n\nขนาด: 1 ชิ้น (ความยาว 4 นิ้ว)",
        specs: ["Hand-Blown Glass", "Heat Resistant", "4 inches length"]
    }
];
