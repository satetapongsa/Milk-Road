import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error('❌ Error: DATABASE_URL is missing in .env');
    process.exit(1);
}

const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
});

const sampleUsers = [
    // Original 10 accounts
    { email: 'admin@studyroad.com', password: 'admin123', full_name: 'Super Admin (StudyRoad Official)', role: 'admin' },
    { email: 'tutor.physics@studyroad.com', password: 'tutor123', full_name: 'ดร.อนันต์ วิทยาศิริ (ติวเตอร์ฟิสิกส์ & แคลคูลัส)', role: 'admin' },
    { email: 'somchai.j@gmail.com', password: 'pass1234', full_name: 'สมชาย ใจดี (นิสิตคณะวิศวกรรมศาสตร์ จุฬาฯ)', role: 'user' },
    { email: 'kanya.p@hotmail.com', password: 'pass1234', full_name: 'กัญญา พรหมมินทร์ (นักเรียน ม.6 เตรียมอุดมศึกษา)', role: 'user' },
    { email: 'thanawat.s@yahoo.com', password: 'pass1234', full_name: 'ธนวัฒน์ สมบูรณ์ (นักเรียน ม.5 สายวิทย์-คณิต)', role: 'user' },
    { email: 'siriporn.k@gmail.com', password: 'pass1234', full_name: 'ศิริพร แก้วมณี (นักศึกษาแพทยศาสตร์ มหิดล)', role: 'user' },
    { email: 'nattapong.t@gmail.com', password: 'pass1234', full_name: 'ณัฐพงษ์ ตั้งเจริญ (นักเรียนเตรียมสอบ A-Level Bio)', role: 'user' },
    { email: 'pattama.w@chula.ac.th', password: 'pass1234', full_name: 'พัทธมน วงศ์สุวรรณ (นิสิตคณะวิทยาศาสตร์ จุฬาฯ)', role: 'user' },
    { email: 'chanyanuch.m@gmail.com', password: 'pass1234', full_name: 'ชัญญานุช มีสุข (นักเรียนเตรียมสอบ กสพท 69)', role: 'user' },
    { email: 'varut.p@kmitl.ac.th', password: 'pass1234', full_name: 'วรุฒิ ปัญญาวิวัฒน์ (นักศึกษาวิศวฯ สจล.)', role: 'user' },

    // Additional 20 accounts requested by user
    { email: 'nutthawat.k@gmail.com', password: 'pass1234', full_name: 'ณัฐวัฒน์ เกษมสุข (ม.6 โรงเรียนสวนกุหลาบวิทยาลัย)', role: 'user' },
    { email: 'prapaporn.s@hotmail.com', password: 'pass1234', full_name: 'ประภาพร ศรีสว่าง (นักศึกษาทันตแพทยศาสตร์ จุฬาฯ)', role: 'user' },
    { email: 'korakot.t@yahoo.com', password: 'pass1234', full_name: 'กรกช ตั้งมุ่งมั่น (ม.5 โรงเรียนมหิดลวิทยานุสรณ์)', role: 'user' },
    { email: 'pitchaya.m@gmail.com', password: 'pass1234', full_name: 'พิชญา มีชัย (นักศึกษาเภสัชศาสตร์ มหิดล)', role: 'user' },
    { email: 'thanakorn.p@ku.th', password: 'pass1234', full_name: 'ธนกร ประเสริฐแท้ (นิสิตคณะเกษตร Kasetsart University)', role: 'user' },
    { email: 'savitree.r@gmail.com', password: 'pass1234', full_name: 'สาวิตรี รัตนกุล (ม.6 โรงเรียนมหิดลวิทยานุสรณ์)', role: 'user' },
    { email: 'phakin.w@hotmail.com', password: 'pass1234', full_name: 'ภาคิน วงศ์วิจิตร (นักศึกษาสัตวแพทยศาสตร์ มก.)', role: 'user' },
    { email: 'araya.c@gmail.com', password: 'pass1234', full_name: 'อารยา เจริญผล (ม.4 เตรียมสอบ A-Level Physics)', role: 'user' },
    { email: 'surasak.n@gmail.com', password: 'pass1234', full_name: 'สุรศักดิ์ นามวงศ์ (ติวเตอร์คณิตศาสตร์ A-Level)', role: 'admin' },
    { email: 'nichapa.k@hotmail.com', password: 'pass1234', full_name: 'ณิชาภา กิจเจริญ (นักเรียน ม.6 โรงเรียนเตรียมอุดมศึกษา)', role: 'user' },
    { email: 'chanatip.p@gmail.com', password: 'pass1234', full_name: 'ชนาธิป เพชรดี (นักศึกษาวิศวฯ ธรรมศาสตร์)', role: 'user' },
    { email: 'kamonchanok.s@yahoo.com', password: 'pass1234', full_name: 'กมลชนก สุวรรณโชติ (ม.5 โรงเรียนบดินทรเดชา)', role: 'user' },
    { email: 'panupong.t@gmail.com', password: 'pass1234', full_name: 'ภานุพงศ์ ทรงเกียรติ (นิสิตคณะวิทยาศาสตร์ มศว)', role: 'user' },
    { email: 'wanida.b@hotmail.com', password: 'pass1234', full_name: 'วนิดา บุญส่ง (นักศึกษาพยาบาลศาสตร์ มหิดล)', role: 'user' },
    { email: 'teerapat.m@chula.ac.th', password: 'pass1234', full_name: 'ธีรภัทร มีทรัพย์ (นิสิตวิศวะ จุฬาฯ)', role: 'user' },
    { email: 'jutasri.k@gmail.com', password: 'pass1234', full_name: 'จุฑาศรี กาญจนา (นักเรียน ม.6 เตรียมสอบ กสพท)', role: 'user' },
    { email: 'suppachai.v@gmail.com', password: 'pass1234', full_name: 'ศุภชัย วิเศษศิลป์ (ม.4 เตรียมสอบ A-Level Chem)', role: 'user' },
    { email: 'jiraporn.d@gmail.com', password: 'pass1234', full_name: 'จิราพร ดีเยี่ยม (นักศึกษาเทคนิคการแพทย์ มช.)', role: 'user' },
    { email: 'chaiwat.s@hotmail.com', password: 'pass1234', full_name: 'ชัยวัฒน์ สมคิด (ม.6 โรงเรียนอัสสัมชัญ)', role: 'user' },
    { email: 'patcharapa.t@gmail.com', password: 'pass1234', full_name: 'พัชราภา ทองแท้ (ม.5 เตรียมสอบ A-Level Bio)', role: 'user' }
];

const sampleOrders = [
    {
        order_no: 'INV-88201',
        customer_name: 'กัญญา พรหมมินทร์',
        customer_email: 'kanya.p@hotmail.com',
        customer_phone: '089-123-4567',
        status: 'Completed',
        payment_method: 'PromptPay',
        total_amount: 199.00,
        item_title: '[PDF File] สรุปชีววิทยา ม.4-6 ฉบับอัปแน่นเตรียมสอบมหาลัย (A-Level Bio)'
    },
    {
        order_no: 'INV-88202',
        customer_name: 'สมชาย ใจดี',
        customer_email: 'somchai.j@gmail.com',
        customer_phone: '081-987-6543',
        status: 'Completed',
        payment_method: 'PromptPay',
        total_amount: 590.00,
        item_title: '[PDF + Video] แคลคูลัส 1 สรุปเนื้อหา + ตะลุยโจทย์มหาวิทยาลัย'
    },
    {
        order_no: 'INV-88203',
        customer_name: 'ศิริพร แก้วมณี',
        customer_email: 'siriporn.k@gmail.com',
        customer_phone: '086-555-1234',
        status: 'Completed',
        payment_method: 'บัตรเครดิต/เดบิต',
        total_amount: 990.00,
        item_title: '[PDF Pack] รวมชุดข้อสอบพร้อมเฉลยรายละเอียด A-Level STEM (Bio, Chem, Phys, Calc)'
    },
    {
        order_no: 'INV-88204',
        customer_name: 'ธนวัฒน์ สมบูรณ์',
        customer_email: 'thanawat.s@yahoo.com',
        customer_phone: '082-444-9988',
        status: 'Completed',
        payment_method: 'PromptPay',
        total_amount: 199.00,
        item_title: '[PDF File] สรุปชีววิทยา ม.4-6 ฉบับอัปแน่นเตรียมสอบมหาลัย'
    },
    {
        order_no: 'INV-88205',
        customer_name: 'ชัญญานุช มีสุข',
        customer_email: 'chanyanuch.m@gmail.com',
        customer_phone: '090-333-2211',
        status: 'Completed',
        payment_method: 'PromptPay',
        total_amount: 490.00,
        item_title: '[PDF + Video] สรุปเคมีอินทรีย์ Visual Mind Map & กลไกปฏิกิริยา'
    }
];

async function seedData() {
    try {
        console.log('🚀 Connecting to Neon PostgreSQL...');
        const client = await pool.connect();
        console.log('✅ Connected successfully!');

        // Insert Users
        console.log(`🌱 Inserting ${sampleUsers.length} Sample Users into Neon DB...`);
        for (const u of sampleUsers) {
            await client.query(`
                INSERT INTO users (email, password, full_name, role)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (email) DO UPDATE 
                SET full_name = EXCLUDED.full_name, password = EXCLUDED.password, role = EXCLUDED.role;
            `, [u.email, u.password, u.full_name, u.role]);
            console.log(`  👤 User synced: ${u.full_name} (${u.email}) [Role: ${u.role}]`);
        }

        // Insert Sample Orders
        console.log('🛒 Inserting Sample Completed Orders into Neon DB...');
        for (const o of sampleOrders) {
            const custRes = await client.query(`
                INSERT INTO customers (full_name, email, phone)
                VALUES ($1, $2, $3)
                RETURNING id;
            `, [o.customer_name, o.customer_email, o.customer_phone]);
            
            const customerId = custRes.rows[0].id;

            const orderRes = await client.query(`
                INSERT INTO orders (order_no, customer_id, status, subtotal, shipping, total)
                VALUES ($1, $2, $3::order_status, $4, 0, $4)
                ON CONFLICT (order_no) DO NOTHING
                RETURNING id;
            `, [o.order_no, customerId, o.status, o.total_amount]);

            if (orderRes.rows.length > 0) {
                const orderId = orderRes.rows[0].id;
                await client.query(`
                    INSERT INTO order_items (order_id, product_name, quantity, unit_price, line_total)
                    VALUES ($1, $2, 1, $3, $3);
                `, [orderId, o.item_title, o.total_amount]);
                
                await client.query(`
                    INSERT INTO payments (order_id, method, status)
                    VALUES ($1, $2, 'paid');
                `, [orderId, o.payment_method]);
                
                console.log(`  🛍️ Order inserted: ${o.order_no} (${o.customer_name}) - ฿${o.total_amount}`);
            }
        }

        client.release();
        console.log('🎉 Seeding 30 user accounts completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding data:', err);
        process.exit(1);
    }
}

seedData();
