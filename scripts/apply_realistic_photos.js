import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';
import { milkRoadProducts } from './seed_milk_road.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const brainDir = 'C:\\Users\\satet\\.gemini\\antigravity-ide\\brain\\95ef1b04-b7ce-490a-9fc6-4e8a15569fd9';
const targetDir = path.join(__dirname, '../public/images/products');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Find generated PNG files in brain directory
const brainFiles = fs.readdirSync(brainDir).filter(f => f.endsWith('.png'));

function findFile(keyword) {
  const match = brainFiles.find(f => f.includes(keyword));
  return match ? path.join(brainDir, match) : null;
}

const photoMap = {
  1: findFile('pure_fresh_milk'),
  2: findFile('hokkaido_strawberry_milk'),
  3: findFile('belgian_chocolate_milk'),
  4: findFile('uji_matcha_milk'),
  5: findFile('pure_fresh_milk'),
  6: findFile('condensed_milk_toast'),
  7: findFile('double_cheese_toast'),
  8: findFile('condensed_milk_toast'),
  9: findFile('double_cheese_toast'),
  10: findFile('french_butter_croissant'),
  11: findFile('milk_soft_serve'),
  12: findFile('mango_milk_bingsoo'),
  13: findFile('mango_milk_bingsoo'),
  14: findFile('milk_soft_serve'),
  15: findFile('milk_soft_serve'),
  16: findFile('hokkaido_strawberry_milk'),
  17: findFile('uji_matcha_milk'),
  18: findFile('french_butter_croissant'),
  19: findFile('belgian_chocolate_milk'),
  20: findFile('french_butter_croissant')
};

// Copy photo files
for (let i = 1; i <= 20; i++) {
  const src = photoMap[i];
  if (src && fs.existsSync(src)) {
    const dest = path.join(targetDir, `product_${i}.png`);
    fs.copyFileSync(src, dest);
    console.log(`📸 Copied photo for product ${i} -> product_${i}.png`);
  }
}

// Update products list image path
const updatedProducts = milkRoadProducts.map(p => ({
  ...p,
  image: `/images/products/product_${p.id}.png`
}));

// Save to src/data/products.js and products.json
const staticProductsPath = path.join(__dirname, '../src/data/products.js');
const staticContent = `export const CONFIG = {
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

export const products = ${JSON.stringify(updatedProducts, null, 4)};
`;

fs.writeFileSync(staticProductsPath, staticContent, 'utf-8');
fs.writeFileSync(path.join(__dirname, '../products.json'), JSON.stringify(updatedProducts, null, 2), 'utf-8');

console.log('✅ Updated products.js and products.json with realistic photography paths!');

// Update Neon PostgreSQL DB
async function updateNeon() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return;

  const { Client } = pg;
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    for (const p of updatedProducts) {
      await client.query(
        'UPDATE products SET image = $1 WHERE id = $2;',
        [p.image, p.id]
      );
    }
    console.log('🎉 Successfully updated image URLs for all 20 products in Neon PostgreSQL Database!');
  } catch (err) {
    console.error('❌ Error updating Neon DB:', err.message);
  } finally {
    await client.end();
  }
}

updateNeon();
