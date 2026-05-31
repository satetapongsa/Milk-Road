import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ Error: DATABASE_URL is missing in .env');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function main() {
  console.log('🔌 Connecting to database...');
  await client.connect();
  console.log('✅ Connected successfully!\n');

  try {
    // 1. List all tables
    console.log('--- List of Tables ---');
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    for (const row of tablesRes.rows) {
      // Get count
      const countRes = await client.query(`SELECT COUNT(*) FROM "${row.table_name}";`);
      console.log(`- ${row.table_name}: ${countRes.rows[0].count} rows`);
    }

    // 2. Fetch some products
    console.log('\n--- Products Sample (Top 5) ---');
    const productsRes = await client.query('SELECT id, name, category, price FROM products LIMIT 5;');
    console.table(productsRes.rows);

    // 3. Fetch orders
    console.log('\n--- Orders Sample (Top 5) ---');
    const ordersRes = await client.query('SELECT id, order_no, status, total, created_at FROM orders LIMIT 5;');
    console.table(ordersRes.rows);

  } catch (err) {
    console.error('❌ Query error:', err.message);
  } finally {
    await client.end();
    console.log('\n🔌 Disconnected.');
  }
}

main();
