import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const brainDir = 'C:\\Users\\satet\\.gemini\\antigravity-ide\\brain\\95ef1b04-b7ce-490a-9fc6-4e8a15569fd9';
const oldDir = path.join(__dirname, '../public/images/products');
const newDir = path.join(__dirname, '../public/images/milk-road-products');

if (!fs.existsSync(newDir)) {
  fs.mkdirSync(newDir, { recursive: true });
}

// Find generated PNG files in brain directory
const brainFiles = fs.existsSync(brainDir) ? fs.readdirSync(brainDir).filter(f => f.endsWith('.png')) : [];

function findBrainFile(keyword) {
  const match = brainFiles.find(f => f.includes(keyword));
  return match ? path.join(brainDir, match) : null;
}

const productFilenameMap = {
  1: { filename: 'pure_fresh_milk.png', brainKey: 'pure_fresh_milk' },
  2: { filename: 'hokkaido_strawberry_milk.png', brainKey: 'hokkaido_strawberry_milk' },
  3: { filename: 'belgian_chocolate_milk.png', brainKey: 'belgian_chocolate_milk' },
  4: { filename: 'uji_matcha_milk.png', brainKey: 'uji_matcha_milk' },
  5: { filename: 'caramel_butter_milk.png', brainKey: 'pure_fresh_milk' },
  6: { filename: 'condensed_milk_toast.png', brainKey: 'condensed_milk_toast' },
  7: { filename: 'double_cheese_toast.png', brainKey: 'double_cheese_toast' },
  8: { filename: 'nutella_banana_toast.png', brainKey: 'condensed_milk_toast' },
  9: { filename: 'garlic_cream_cheese_bread.png', brainKey: 'double_cheese_toast' },
  10: { filename: 'custard_lava_bun.png', brainKey: 'french_butter_croissant' },
  11: { filename: 'fresh_milk_soft_serve.png', brainKey: 'milk_soft_serve' },
  12: { filename: 'red_bean_bingsoo.png', brainKey: 'mango_milk_bingsoo' },
  13: { filename: 'mango_milk_bingsoo.png', brainKey: 'mango_milk_bingsoo' },
  14: { filename: 'caramel_pudding.png', brainKey: 'milk_soft_serve' },
  15: { filename: 'choco_brownie_sundae.png', brainKey: 'milk_soft_serve' },
  16: { filename: 'pink_sweet_milk.png', brainKey: 'hokkaido_strawberry_milk' },
  17: { filename: 'ceylon_milk_tea.png', brainKey: 'uji_matcha_milk' },
  18: { filename: 'coffee_latte.png', brainKey: 'french_butter_croissant' },
  19: { filename: 'cocoa_volcano.png', brainKey: 'belgian_chocolate_milk' },
  20: { filename: 'butter_croissant.png', brainKey: 'french_butter_croissant' }
};

for (let i = 1; i <= 20; i++) {
  const item = productFilenameMap[i];
  const destPath = path.join(newDir, item.filename);
  
  // Try copying from brain folder first, fallback to old product_X.png
  const brainPath = findBrainFile(item.brainKey);
  const oldProductPath = path.join(oldDir, `product_${i}.png`);

  if (brainPath && fs.existsSync(brainPath)) {
    fs.copyFileSync(brainPath, destPath);
    console.log(`📁 Copied from brain -> public/images/milk-road-products/${item.filename}`);
  } else if (fs.existsSync(oldProductPath)) {
    fs.copyFileSync(oldProductPath, destPath);
    console.log(`📁 Copied from products -> public/images/milk-road-products/${item.filename}`);
  }
}

// Update products list with new dedicated folder paths
const productsJsonPath = path.join(__dirname, '../products.json');
const staticProductsPath = path.join(__dirname, '../src/data/products.js');

let currentProducts = [];
if (fs.existsSync(productsJsonPath)) {
  currentProducts = JSON.parse(fs.readFileSync(productsJsonPath, 'utf-8'));
}

const updatedProducts = currentProducts.map(p => {
  const item = productFilenameMap[p.id];
  return {
    ...p,
    image: `/images/milk-road-products/${item ? item.filename : `product_${p.id}.png`}`
  };
});

fs.writeFileSync(productsJsonPath, JSON.stringify(updatedProducts, null, 2), 'utf-8');

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
console.log('✅ Updated products.js and products.json to point to /images/milk-road-products/');

// Update Neon DB
async function syncNeon() {
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
    console.log('🎉 Successfully synced updated image paths to Neon PostgreSQL Database!');
  } catch (err) {
    console.error('❌ Error updating Neon DB:', err.message);
  } finally {
    await client.end();
  }
}

syncNeon();
