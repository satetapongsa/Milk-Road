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

async function resetCleanUsers() {
    try {
        console.log('🚀 Connecting to Neon Cloud PostgreSQL Database...');
        const client = await pool.connect();
        console.log('✅ Connected successfully!');

        // 1. Wipe all non-admin sample users
        console.log('🧹 Purging all sample users, keeping ONLY Super Admin account...');
        await client.query(`DELETE FROM users WHERE email != 'admin@studyroad.com';`);

        // 2. Ensure Super Admin account exists cleanly
        await client.query(`
            INSERT INTO users (email, password, full_name, role)
            VALUES ('admin@studyroad.com', 'admin123', 'Super Admin (StudyRoad Official)', 'admin')
            ON CONFLICT (email) DO UPDATE 
            SET full_name = 'Super Admin (StudyRoad Official)', password = 'admin123', role = 'admin';
        `);

        // 3. Count remaining users
        const countRes = await client.query(`SELECT COUNT(*) FROM users;`);
        console.log(`✅ Clean Users Reset Complete! Remaining users in DB: ${countRes.rows[0].count} user (admin@studyroad.com)`);

        client.release();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error cleaning database users:', err);
        process.exit(1);
    }
}

resetCleanUsers();
