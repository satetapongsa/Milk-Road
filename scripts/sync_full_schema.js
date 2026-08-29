import pg from 'pg';
import fs from 'fs';
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

async function syncSchema() {
    try {
        console.log('🚀 Connecting to Neon Cloud PostgreSQL Database...');
        const client = await pool.connect();
        console.log('✅ Connected successfully!');

        const sqlFilePath = path.join(__dirname, '../database_schema.sql');
        const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

        console.log('📜 Executing full database_schema.sql DDL script...');
        await client.query(sqlContent);
        console.log('✨ All tables, ENUM types, triggers, and functions created successfully!');

        // Verify triggers and tables
        const triggerRes = await client.query(`
            SELECT trigger_name, event_object_table 
            FROM information_schema.triggers 
            WHERE trigger_schema = 'public';
        `);

        console.log('\n⚡ Verified Triggers in Neon DB:');
        triggerRes.rows.forEach(tr => {
            console.log(`  - ${tr.trigger_name} on table [${tr.event_object_table}]`);
        });

        client.release();
        console.log('\n🎉 Full Neon PostgreSQL Database sync complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error syncing schema:', err);
        process.exit(1);
    }
}

syncSchema();
