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
    console.error('❌ Error: DATABASE_URL missing');
    process.exit(1);
}

const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
});

async function checkDatabase() {
    try {
        const client = await pool.connect();
        console.log('🌐 Connected to Neon Cloud PostgreSQL Database!\n');

        // 1. List all tables
        const tablesRes = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        `);
        const tables = tablesRes.rows.map(r => r.table_name);
        console.log(`📋 Tables in Public Schema (${tables.length} tables):`);

        for (const t of tables) {
            const countRes = await client.query(`SELECT COUNT(*) FROM "${t}";`);
            console.log(`  - ${t}: ${countRes.rows[0].count} rows`);
        }

        // 2. Check Triggers
        console.log('\n⚡ Triggers in Database:');
        const triggerRes = await client.query(`
            SELECT trigger_name, event_object_table 
            FROM information_schema.triggers 
            WHERE trigger_schema = 'public';
        `);
        if (triggerRes.rows.length === 0) {
            console.log('  (No custom triggers found, running database_schema.sql schema sync...)');
        } else {
            triggerRes.rows.forEach(tr => {
                console.log(`  - ${tr.trigger_name} on table [${tr.event_object_table}]`);
            });
        }

        // 3. Sync full schema if any missing tables
        const expectedTables = ['users', 'customers', 'addresses', 'products', 'orders', 'order_items', 'payments', 'admin_logs'];
        const missing = expectedTables.filter(et => !tables.includes(et));

        if (missing.length > 0) {
            console.log(`\n⚠️ Missing tables detected: ${missing.join(', ')}. Creating missing schema elements...`);
        }

        client.release();
        process.exit(0);
    } catch (err) {
        console.error('❌ Database query error:', err);
        process.exit(1);
    }
}

checkDatabase();
