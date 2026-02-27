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
    },
    {
        id: 13,
        name: "White Widow (Balanced & Energetic)",
        price: 650,
        category: "ช่อดอกพรีเมียม (Premium Flowers)",
        image: "/images/13.png",
        description: "สายพันธุ์ไฮบริดที่โดดเด่นเรื่องความสมดุลและพลังงาน\n\nขนาด: 1 กรัม\n(ราคาอ้างอิงต่อ 1 กรัม สามารถเลือกซื้อแบบ 3.5g หรือ 5g เพื่อรับราคาขายส่งได้)",
        specs: ["Hybrid", "1 กรัม", "Balanced Energy"]
    },
    {
        id: 14,
        name: "Girl Scout Cookies (Joy & Relaxation)",
        price: 700,
        category: "ช่อดอกพรีเมียม (Premium Flowers)",
        image: "/images/14.png",
        description: "สายพันธุ์ไฮบริดที่เด่นเรื่องความสุขและการผ่อนคลาย\n\nขนาด: 1 กรัม\n(ราคาอ้างอิงต่อ 1 กรัม สามารถเลือกซื้อแบบ 3.5g หรือ 5g เพื่อรับราคาขายส่งได้)",
        specs: ["Hybrid", "1 กรัม", "Joy & Relaxation"]
    },
    {
        id: 15,
        name: "Northern Lights (Deep Sleep)",
        price: 600,
        category: "ช่อดอกพรีเมียม (Premium Flowers)",
        image: "/images/15.png",
        description: "สายพันธุ์อินดิก้าที่เน้นการนอนหลับลึกและการพักผ่อน\n\nขนาด: 1 กรัม\n(ราคาอ้างอิงต่อ 1 กรัม สามารถเลือกซื้อแบบ 3.5g หรือ 5g เพื่อรับราคาขายส่งได้)",
        specs: ["Indica", "1 กรัม", "Deep Sleep"]
    },
    {
        id: 16,
        name: "Jack Herer (Creative & Uplifting)",
        price: 650,
        category: "ช่อดอกพรีเมียม (Premium Flowers)",
        image: "/images/16.png",
        description: "สายพันธุ์ซาติว่าที่กระตุ้นความคิดสร้างสรรค์และยกจิตใจ\n\nขนาด: 1 กรัม\n(ราคาอ้างอิงต่อ 1 กรัม สามารถเลือกซื้อแบบ 3.5g หรือ 5g เพื่อรับราคาขายส่งได้)",
        specs: ["Sativa", "1 กรัม", "Creative & Uplifting"]
    },
    {
        id: 17,
        name: "Cannabis Chocolate - Sea Salt Dark",
        price: 350,
        category: "สินค้าแปรรูปและสกัด (Edibles & Extracts)",
        image: "/images/17.png",
        description: "ช็อกโกแลตผสมกัญชา รส Sea Salt Dark รสชาติเข้มข้น หรูหรา\n\nรสชาติเข้มข้น หรูหรา",
        specs: ["Dark Chocolate", "Sea Salt"]
    },
    {
        id: 18,
        name: "Cannabis Sparkling Water - Lime Twist",
        price: 150,
        category: "สินค้าแปรรูปและสกัด (Edibles & Extracts)",
        image: "/images/18.png",
        description: "น้ำโซดาสปาร์คกลิ้งผสมกัญชา รส Lime Twist\n\nสดชื่น เบาสบาย",
        specs: ["Sparkling Water", "Lime Twist"]
    },
    {
        id: 19,
        name: "Live Resin Concentrates - 1g",
        price: 1500,
        category: "สินค้าแปรรูปและสกัด (Edibles & Extracts)",
        image: "/images/19.png",
        description: "สารสกัด Live Resin Concentrates ขนาด 1 กรัม\n\nสารสกัดเข้มข้นที่รักษา terpene และ cannabinoid ได้อย่างครบถ้วน",
        specs: ["Live Resin", "1 กรัม", "Full Spectrum"]
    },
    {
        id: 20,
        name: "Disposable Vape - Mango Kush",
        price: 1200,
        category: "สินค้าแปรรูปและสกัด (Edibles & Extracts)",
        image: "/images/20.png",
        description: "ปากกาวีปแบบใช้แล้วทิ้ง กลิ่น Mango Kush\n\nสะดวก ใช้งานได้ทันที",
        specs: ["Disposable Vape", "Mango Kush"]
    },
    {
        id: 21,
        name: "CBD Softgel Capsules - 30 pcs",
        price: 900,
        category: "สุขภาพและการบำรุง (Wellness & Topicals)",
        image: "/images/21.png",
        description: "แคปซูล CBD ชนิด Softgel จำนวน 30 แคปซูล\n\nการโดสสารที่แม่นยำ",
        specs: ["CBD Softgel", "30 Capsules", "Precise Dosing"]
    },
    {
        id: 22,
        name: "Cannabis Bath Bomb - Lavender",
        price: 350,
        category: "สุขภาพและการบำรุง (Wellness & Topicals)",
        image: "/images/22.png",
        description: "บาธบอมบ์ผสมกัญชา กลิ่น Lavender\n\nแช่ตัวเพื่อการผ่อนคลาย",
        specs: ["Bath Bomb", "Lavender"]
    },
    {
        id: 23,
        name: "Metal Rolling Tray - Milk Road Edition",
        price: 250,
        category: "อุปกรณ์และเมล็ดพันธุ์ (Seeds & Accessories)",
        image: "/images/23.png",
        description: "ถาดม้วนบุหรี่โลหะ ลายแบรนด์ Milk Road\n\nทนทาน มีสไตล์",
        specs: ["Metal Tray", "Durable", "Milk Road Edition"]
    },
    {
        id: 24,
        name: "Aluminum Herb Grinder - 4 Layers",
        price: 450,
        category: "อุปกรณ์และเมล็ดพันธุ์ (Seeds & Accessories)",
        image: "/images/24.png",
        description: "เครื่องบดสมุนไพรอะลูมิเนียม 4 ชั้น\n\nบดสมุนไพรได้อย่างสมบูรณ์แบบ",
        specs: ["Aluminum", "4 Layers", "Perfect Grind"]
    },
    {
        id: 25,
        name: "Blue Dream (Sativa-Dominant Hybrid)",
        price: 680,
        category: "ช่อดอกพรีเมียม (Premium Flowers)",
        image: "/images/25 (1).png",
        description: "ดอก Sativa เกรดพรีเมียมไซส์ใหญ่ ไทรโคมสีส้มสดใส กระตุ้นพลังงานและความคิดสร้างสรรค์\n\nขนาด: 1 กรัม",
        specs: ["Sativa-Dominant", "1 กรัม", "Uplifting"]
    },
    {
        id: 26,
        name: "Girl Scout Cookies (Balanced Hybrid)",
        price: 700,
        category: "ช่อดอกพรีเมียม (Premium Flowers)",
        image: "/images/25 (5).jpg",
        description: "สายพันธุ์ยอดฮิตเนื้อแน่นเหลือบม่วง ไทรโคมขาวฟู หอมหวานชวนหลงใหล\n\nขนาด: 1 กรัม",
        specs: ["Hybrid", "1 กรัม", "Sweet & Earthy"]
    },
    {
        id: 27,
        name: "Northern Lights (Pure Indica)",
        price: 650,
        category: "ช่อดอกพรีเมียม (Premium Flowers)",
        image: "/images/25 (6).jpg",
        description: "สายพันธุ์อินดิก้าคลาสสิก ดอกสีเขียวเข้มเคลือบคริสตัลหนา เหมาะสำหรับพักผ่อนก่อนนอน\n\nขนาด: 1 กรัม",
        specs: ["Indica", "1 กรัม", "Deep Relaxation"]
    },
    {
        id: 28,
        name: "Jack Herer (Uplifting Sativa)",
        price: 700,
        category: "ช่อดอกพรีเมียม (Premium Flowers)",
        image: "/images/25 (8).jpg",
        description: "โทนสีเขียวสว่าง ดอกทรงเรียวมีขนสีส้ม กลิ่นหอมสนและสไปซ์ ช่วยปลุกความตื่นตัว\n\nขนาด: 1 กรัม",
        specs: ["Sativa", "1 กรัม", "Pine & Spice"]
    },
    {
        id: 29,
        name: "Live Resin Extract (1g)",
        price: 1500,
        category: "สินค้าแปรรูปและสกัด (Edibles & Extracts)",
        image: "/images/25 (10).jpg",
        description: "สารสกัดแบบเหลวเข้มข้นสีเหลืองทอง อุดมด้วย Terpene ธรรมชาติบรรจุในกระปุกแก้ว\n\nขนาด: 1 กรัม",
        specs: ["Live Resin", "1 กรัม", "Glass Jar"]
    },
    {
        id: 30,
        name: "Purple Punch (Heavy Indica)",
        price: 680,
        category: "ช่อดอกพรีเมียม (Premium Flowers)",
        image: "/images/25 (12).png",
        description: "ดอกทรงพุ่มแน่น โทนสีม่วงเข้มตัดเขียว หอมกลิ่นฟรุตตี้ช่วยให้เคลิบเคลิ้ม\n\nขนาด: 1 กรัม",
        specs: ["Indica", "1 กรัม", "Purple Hue"]
    },
    {
        id: 48,
        name: "OG Kush Wholesale Pack (5g)",
        price: 2500,
        category: "ช่อดอกพรีเมียม (Premium Flowers)",
        image: "/images/4.png",
        description: "ภาพถ่ายมาโครเจาะลึกช่อดอก OG Kush แบบแพ็กใหญ่ เหมาะสำหรับคนใช้บ่อย ลดราคาจากปกติ\n\nขนาด: 5 กรัม",
        specs: ["Wholesale", "5 กรัม", "Classic OG"]
    },
    {
        id: 32,
        name: "Sour Diesel (Energizing Sativa)",
        price: 650,
        category: "ช่อดอกพรีเมียม (Premium Flowers)",
        image: "/images/25 (14).png",
        description: "ช่อดอกขนาดใหญ่สีเขียวอ่อน ฟูเบา กลิ่นดีเซลและซิตรัสอันเป็นเอกลักษณ์\n\nขนาด: 1 กรัม",
        specs: ["Sativa", "1 กรัม", "Pungent Aroma"]
    },
    {
        id: 33,
        name: "THC Infused Organic Honey",
        price: 850,
        category: "สินค้าแปรรูปและสกัด (Edibles & Extracts)",
        image: "/images/25 (15).png",
        description: "น้ำผึ้งแท้สกัดเข้มข้นผสม THC ในกระปุกแก้วพร้อมไม้ตัก หอมหวานทานง่าย\n\nขนาด: 1 กระปุก",
        specs: ["Infused Honey", "Organic", "Wooden Dipper"]
    },
    {
        id: 34,
        name: "Fudge Weed Brownies (4 pcs)",
        price: 380,
        category: "สินค้าแปรรูปและสกัด (Edibles & Extracts)",
        image: "/images/25 (16).png",
        description: "บราวนี่เนื้อหนึบหนับตัดขอบ 4 ชิ้น โรยไอซิ่งบางๆ อร่อยลงตัวพร้อมผ่อนคลาย\n\nขนาด: 4 ชิ้น (บรรจุจาน)",
        specs: ["Baked Goods", "4 Pieces", "Chocolate Fudge"]
    },
    {
        id: 35,
        name: "Resin Sauce & Diamonds (1g)",
        price: 2200,
        category: "สินค้าแปรรูปและสกัด (Edibles & Extracts)",
        image: "/images/25 (17).png",
        description: "สารสกัดเข้มข้นที่สุด (Diamonds in Sauce) มาพร้อมแท่งตักแว็กซ์ในขวดแก้ว\n\nขนาด: 1 กรัม",
        specs: ["Sauce & Diamonds", "Dabbing Tool", "1 กรัม"]
    },
    {
        id: 36,
        name: "Premium Kief Powder (1g)",
        price: 900,
        category: "สินค้าแปรรูปและสกัด (Edibles & Extracts)",
        image: "/images/25 (18).png",
        description: "ผงคีฟเนื้อละเอียดในตลับไม้สุดหรู พร้อมช้อนสีเงินตักใช้งาน โรยบนช่อดอกเพิ่มฤทธิ์\n\nขนาด: 1 กรัม",
        specs: ["Kief", "Trichome Powder", "Wooden Container"]
    },
    {
        id: 37,
        name: "CBD Transdermal Patches (2 patches)",
        price: 490,
        category: "สุขภาพและการบำรุง (Wellness & Topicals)",
        image: "/images/25 (19).png",
        description: "แผ่นแปะดูดซึม CBD ผ่านชั้นผิวหนัง ซองฟอยล์พรีเมียมบรรจุแผ่นยาสีเนื้อ\n\nขนาด: 1 ซอง (บรรจุ 2 แผ่น)",
        specs: ["Transdermal Patch", "Targeted Relief", "Foil Pack"]
    },
    {
        id: 38,
        name: "Relaxing Muscle Massage Oil",
        price: 890,
        category: "สุขภาพและการบำรุง (Wellness & Topicals)",
        image: "/images/25 (20).png",
        description: "น้ำมันนวดสกัดจากธรรมชาติในขวดแก้วทึบ หัวปั๊มสีดำ บรรเทาอาการเมื่อยล้า\n\nปริมาตร: 100 ml",
        specs: ["Massage Oil", "Topical", "Black Pump Bottle"]
    },
    {
        id: 39,
        name: "Multi-Perc Glass Bong",
        price: 3500,
        category: "อุปกรณ์และเมล็ดพันธุ์ (Seeds & Accessories)",
        image: "/images/25 (21).png",
        description: "บ้องแก้วเป่ารูปทรงสูงประดับสีเขียว มีระบบตัวกรองน้ำ Percolator ชั้นเชิงซับซ้อน\n\nขนาด: 14 นิ้ว",
        specs: ["Glassware", "Multiple Percs", "14 Inches"]
    },
    {
        id: 40,
        name: "Crafted Wooden Rolling Tray",
        price: 450,
        category: "อุปกรณ์และเมล็ดพันธุ์ (Seeds & Accessories)",
        image: "/images/25 (22).png",
        description: "ถาดม้วนบุหรี่ทำจากไม้สุดประณีต มาพร้อมกระดาษโรลและแท่งไม้จัดทรงดอก\n\nขนาด: 20x15 ซม.",
        specs: ["Wooden Tray", "Hand Crafted", "Rolling Station"]
    },
    {
        id: 41,
        name: "White Widow (Balanced Hybrid)",
        price: 650,
        category: "ช่อดอกพรีเมียม (Premium Flowers)",
        image: "/images/25 (1).jpg",
        description: "ดอกไม้สายพันธุ์ระดับตำนาน ขาวโพลนด้วยคริสตัลไทรโคม ทรงพลังกระชุ่มกระชวย\n\nขนาด: 1 กรัม",
        specs: ["Hybrid", "1 กรัม", "White Frost"]
    },
    {
        id: 42,
        name: "Full Spectrum RSO Syringe",
        price: 1800,
        category: "สินค้าแปรรูปและสกัด (Edibles & Extracts)",
        image: "/images/25 (13).jpg",
        description: "น้ำมันเข้มข้นสีดำ Rick Simpson Oil บรรจุมาในไซริงก์แก้ว โดสง่าย สะอาด\n\nปริมาตร: 1 ml (1 กรัม)",
        specs: ["RSO Oil", "1 ml. Syringe", "Medical Grade"]
    },
    {
        id: 43,
        name: "CBD Tincture Drops (Apothecary Bottle)",
        price: 1500,
        category: "สุขภาพและการบำรุง (Wellness & Topicals)",
        image: "/images/25 (14).jpg",
        description: "น้ำมันหยดใต้ลิ้นสกัด CBD ขับขวดทึบแสงสีชาแบบคลาสสิก พร้อมฝาจุกหยดดำ\n\nปริมาตร: 30 ml (1000mg CBD)",
        specs: ["Tincture", "Brown Glass", "Dropper"]
    },
    {
        id: 44,
        name: "Cannabis Infused Cold Brew Bottle",
        price: 180,
        category: "สินค้าแปรรูปและสกัด (Edibles & Extracts)",
        image: "/images/25 (15).jpg",
        description: "เครื่องดื่มกาแฟสกัดเย็นผสม THC บรรจุขวดใสปิดปากจุก คาเฟอีนและสมุนไพรเข้ากันลงตัว\n\nปริมาตร: 250 ml",
        specs: ["Cold Brew Beverage", "Infused", "Clear Glass Bottle"]
    },
    {
        id: 45,
        name: "Starter CBD/THC Bundle Display",
        price: 3500,
        category: "อุปกรณ์และเมล็ดพันธุ์ (Seeds & Accessories)",
        image: "/images/1.1.png",
        description: "ชุดรวมผลิตภัณฑ์บนแท่นจัดแสดง จัดเต็มด้วยขวดน้ำมันหยด ช่อดอก และหลอดพรีโรล\n\nชุดเซ็ตสุดคุ้ม",
        specs: ["Bundle Kit", "Retail Display", "Starter Pack"]
    },
    {
        id: 46,
        name: "Premium Extract Discovery Kit",
        price: 4900,
        category: "อุปกรณ์และเมล็ดพันธุ์ (Seeds & Accessories)",
        image: "/images/1.2.png",
        description: "คอลเล็กชันสำหรับนักเจาะลึก รวมสมุนไพรในถุงทึบแสงและขวดหยดครบครัน\n\nชุดเซ็ตรีวีลพรีเมียม",
        specs: ["Discovery Kit", "Extracts & Bags", "Opaque Packaging"]
    },
    {
        id: 47,
        name: "Milk Road Official Logo Sticker",
        price: 150,
        category: "อุปกรณ์และเมล็ดพันธุ์ (Seeds & Accessories)",
        image: "/images/logo.png",
        description: "สติกเกอร์กราฟิกโลโก้แบรนด์ Milk Road แท้ 100% ถนนตัดผ่านใบกัญชา วัสดุกันน้ำ\n\nขนาด: 10x10 ซม.",
        specs: ["Merchandise", "Sticker", "Graphic Print"]
    },
    {
        id: 31,
        name: "Milk Road Official Hoodie (Black)",
        price: 1290,
        category: "อุปกรณ์และเมล็ดพันธุ์ (Seeds & Accessories)",
        image: "/images/25 (13).png",
        description: "เสื้อฮู้ดกันหนาวสีดำสุดเท่ สกรีนโลโก้ Milk Road พร้อมรูปใบกัญชาสีขาว\n\nขนาด: Free Size",
        specs: ["Apparel", "Cotton Hoodie", "Milk Road Edition"]
    }
];
