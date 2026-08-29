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
    console.error('❌ Error: DATABASE_URL missing in .env');
    process.exit(1);
}

const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
});

async function updateAdminCredentials() {
    try {
        console.log('🚀 Connecting to Neon Cloud PostgreSQL Database...');
        const client = await pool.connect();
        console.log('✅ Connected successfully!');

        const newAdminEmail = 'satetapongs@gmail.com';
        const newAdminPassword = '887624@W';
        const newAdminFullName = 'เศรษฐพงศ์ สงวนสุข (Super Admin)';

        // 1. Delete old admin account if email was admin@studyroad.com
        await client.query(`DELETE FROM users WHERE email = 'admin@studyroad.com';`);

        // 2. Insert or update the new Super Admin account
        await client.query(`
            INSERT INTO users (email, password, full_name, role)
            VALUES ($1, $2, $3, 'admin')
            ON CONFLICT (email) DO UPDATE 
            SET password = $2, full_name = $3, role = 'admin';
        `, [newAdminEmail.trim().toLowerCase(), newAdminPassword, newAdminFullName]);

        // 3. Verify in DB
        const res = await client.query(`SELECT id, email, full_name, role FROM users WHERE email = $1;`, [newAdminEmail.trim().toLowerCase()]);
        console.log('✅ Admin credentials updated in Neon DB:', res.rows[0]);

        client.release();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error updating admin credentials:', err);
        process.exit(1);
    }
}

updateAdminCredentials();
