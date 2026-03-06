import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3001;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ordersFile = path.join(__dirname, 'orders.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper functions
function getOrders() {
  if (!fs.existsSync(ordersFile)) {
    fs.writeFileSync(ordersFile, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(ordersFile, 'utf-8'));
}

function saveOrders(orders) {
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
}

// Payment API - รับ payment request
app.post('/api/payment', (req, res) => {
  const { orderId, amount, customerPhone, referenceNo } = req.body;

  if (!orderId || !amount || !referenceNo) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const orders = getOrders();
  const newOrder = {
    id: orderId,
    referenceNo,
    amount,
    customerPhone,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  orders.push(newOrder);
  saveOrders(orders);

  // จำลอง Webhook callback หลัง 5-10 วินาที
  const delay = Math.random() * 5000 + 5000; // 5-10 seconds
  setTimeout(() => {
    const updatedOrders = getOrders();
    const orderIndex = updatedOrders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
      updatedOrders[orderIndex].status = 'confirmed';
      updatedOrders[orderIndex].confirmedAt = new Date().toISOString();
      updatedOrders[orderIndex].transactionId = 'TXN-' + Date.now();
      saveOrders(updatedOrders);
      
      console.log(`✓ Payment confirmed for order ${orderId}`);
    }
  }, delay);

  res.json({
    success: true,
    orderId,
    referenceNo,
    status: 'pending',
    message: 'Payment request created. Checking status...'
  });
});

// Check payment status
app.get('/api/payment/:orderId', (req, res) => {
  const { orderId } = req.params;
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json({
    orderId: order.id,
    status: order.status,
    amount: order.amount,
    referenceNo: order.referenceNo,
    transactionId: order.transactionId || null,
    confirmedAt: order.confirmedAt || null
  });
});

// Webhook endpoint (สำหรับ frontend เรียกมาตรวจสอบ)
app.post('/webhook/payment-confirm', (req, res) => {
  const { orderId } = req.body;
  
  if (!orderId) {
    return res.status(400).json({ error: 'Missing orderId' });
  }

  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json({
    orderId: order.id,
    status: order.status,
    transactionId: order.transactionId || null,
    confirmedAt: order.confirmedAt || null
  });
});

// Get all orders (for testing)
app.get('/api/orders', (req, res) => {
  const orders = getOrders();
  res.json(orders);
});

// Reset orders (for testing)
app.post('/api/orders/reset', (req, res) => {
  fs.writeFileSync(ordersFile, JSON.stringify([]));
  res.json({ message: 'Orders reset' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Payment API Server running on http://localhost:${PORT}`);
  console.log(`📝 Orders saved in: ${ordersFile}\n`);
  console.log('Available endpoints:');
  console.log(`  POST   /api/payment          - Create payment request`);
  console.log(`  GET    /api/payment/:orderId - Check payment status`);
  console.log(`  POST   /webhook/payment-confirm - Webhook listener`);
  console.log(`  GET    /api/orders           - Get all orders`);
  console.log(`  POST   /api/orders/reset     - Reset orders`);
  console.log(`  GET    /health               - Health check\n`);
});
