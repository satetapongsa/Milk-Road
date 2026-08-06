import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, '../public/images/products');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const products = [
  { id: 1, name: 'Fresh Milk', title: 'Milk Road Pure', bg: '#4f46e5', accent: '#38bdf8', icon: '🥛', cat: 'Milk & Dairy' },
  { id: 2, name: 'Strawberry Milk', title: 'Hokkaido Strawberry', bg: '#e11d48', accent: '#fda4af', icon: '🍓', cat: 'Milk & Dairy' },
  { id: 3, name: 'Choco Milk', title: 'Belgian Chocolate', bg: '#451a03', accent: '#fbbf24', icon: '🍫', cat: 'Milk & Dairy' },
  { id: 4, name: 'Matcha Milk', title: 'Uji Matcha', bg: '#15803d', accent: '#86efac', icon: '🍵', cat: 'Milk & Dairy' },
  { id: 5, name: 'Caramel Milk', title: 'Caramel Butter', bg: '#b45309', accent: '#fde047', icon: '🍯', cat: 'Milk & Dairy' },
  { id: 6, name: 'Milk Toast', title: 'Butter Toast', bg: '#d97706', accent: '#fef08a', icon: '🍞', cat: 'Bakery & Toast' },
  { id: 7, name: 'Cheese Toast', title: 'Double Cheese', bg: '#ca8a04', accent: '#fef08a', icon: '🧀', cat: 'Bakery & Toast' },
  { id: 8, name: 'Nutella Toast', title: 'Nutella Banana', bg: '#78350f', accent: '#fde047', icon: '🍌', cat: 'Bakery & Toast' },
  { id: 9, name: 'Garlic Bread', title: 'Garlic Cream Cheese', bg: '#854d0e', accent: '#fef08a', icon: '🧄', cat: 'Bakery & Toast' },
  { id: 10, name: 'Custard Bun', title: 'Milk Custard Bun', bg: '#ea580c', accent: '#ffedd5', icon: '🥯', cat: 'Bakery & Toast' },
  { id: 11, name: 'Soft Serve', title: 'Milk Soft Serve', bg: '#2563eb', accent: '#e0f2fe', icon: '🍦', cat: 'Ice Cream & Desserts' },
  { id: 12, name: 'Milk Bingsoo', title: 'Red Bean Bingsoo', bg: '#9333ea', accent: '#f3e8ff', icon: '🍧', cat: 'Ice Cream & Desserts' },
  { id: 13, name: 'Mango Bingsoo', title: 'Mango Bingsoo', bg: '#d97706', accent: '#fef3c7', icon: '🥭', cat: 'Ice Cream & Desserts' },
  { id: 14, name: 'Caramel Pudding', title: 'Caramel Pudding', bg: '#c2410c', accent: '#ffedd5', icon: '🍮', cat: 'Ice Cream & Desserts' },
  { id: 15, name: 'Choco Sundae', title: 'Choco Brownie Sundae', bg: '#581c87', accent: '#f3e8ff', icon: '🍨', cat: 'Ice Cream & Desserts' },
  { id: 16, name: 'Pink Milk', title: 'Pink Sweet Shake', bg: '#db2777', accent: '#fce7f3', icon: '🥤', cat: 'Fresh Drinks' },
  { id: 17, name: 'Ceylon Milk Tea', title: 'Ceylon Milk Tea', bg: '#c2410c', accent: '#ffedd5', icon: '🧋', cat: 'Fresh Drinks' },
  { id: 18, name: 'Coffee Latte', title: 'Fresh Milk Latte', bg: '#78350f', accent: '#fef3c7', icon: '☕', cat: 'Fresh Drinks' },
  { id: 19, name: 'Cocoa Volcano', title: 'Cocoa Volcano', bg: '#3f2305', accent: '#fed7aa', icon: '🌋', cat: 'Fresh Drinks' },
  { id: 20, name: 'Croissant', title: 'Butter Croissant', bg: '#b45309', accent: '#fef08a', icon: '🥐', cat: 'Bakery & Toast' }
];

products.forEach(p => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <linearGradient id="grad-${p.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.bg}" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000" flood-opacity="0.35"/>
    </filter>
  </defs>
  <rect width="600" height="600" fill="url(#grad-${p.id})" />
  <circle cx="300" cy="260" r="160" fill="${p.accent}" opacity="0.2" />
  <circle cx="300" cy="260" r="130" fill="${p.accent}" opacity="0.3" filter="url(#shadow)" />
  <text x="300" y="295" font-size="110" text-anchor="middle" dominant-baseline="middle">${p.icon}</text>
  <rect x="50" y="440" width="500" height="110" rx="20" fill="rgba(255, 255, 255, 0.95)" filter="url(#shadow)" />
  <text x="300" y="485" font-family="'Inter', system-ui, sans-serif" font-size="28" font-weight="800" fill="#0f172a" text-anchor="middle">${p.title}</text>
  <text x="300" y="520" font-family="'Inter', system-ui, sans-serif" font-size="18" font-weight="600" fill="${p.bg}" text-anchor="middle">MILK ROAD • ${p.cat.toUpperCase()}</text>
</svg>`;

  fs.writeFileSync(path.join(dir, `product_${p.id}.svg`), svg);
});

console.log('✅ Created 20 SVG product images successfully!');
