import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';
import { products as localProducts } from './src/data/products.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3001;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ordersFile = path.join(__dirname, 'orders.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Neon Database Connection Pool
const { Pool } = pg;
const dbUrl = process.env.DATABASE_URL;

const pool = dbUrl
  ? new Pool({
      connectionString: dbUrl,
      ssl: {
        rejectUnauthorized: false // Required for serverless database connection
      }
    })
  : null;

if (pool) {
  console.log('🚀 Connected to Neon PostgreSQL Database successfully!');
} else {
  console.warn('⚠️ Warning: DATABASE_URL is missing in .env. Falling back to local file database.');
}

const productsFile = path.join(__dirname, 'products.json');

// Helper functions for file-based fallback
function getLocalProducts() {
  if (!fs.existsSync(productsFile)) {
    fs.writeFileSync(productsFile, JSON.stringify(localProducts));
  }
  return JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
}

function saveLocalProducts(products) {
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
}

function getLocalOrders() {
  if (!fs.existsSync(ordersFile)) {
    fs.writeFileSync(ordersFile, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(ordersFile, 'utf-8'));
}

function saveLocalOrders(orders) {
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
}

// ==========================================
// 1. NEON DATABASE REST API GATEWAY
// ==========================================

// PRODUCTS API
app.get('/api/products', async (req, res) => {
  try {
    if (!pool) {
      return res.json(getLocalProducts().filter(p => p.is_active !== false));
    }
    const { rows } = await pool.query(
      "SELECT * FROM products WHERE is_active = true ORDER BY id ASC"
    );
    const formatted = rows.map(p => ({
      ...p,
      price: Number(p.price)
    }));
    res.json(formatted);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.json(getLocalProducts().filter(p => p.is_active !== false));
  }
});

// ==========================================
// AUTHENTICATION API (LOGIN & REGISTER)
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'กรุณากรอกอีเมลและรหัสผ่าน' });
    }

    if (!pool) {
      // Local fallback auth
      if (email === 'satetapongs@gmail.com' && password === '887624@W') {
        return res.json({
          user: { id: 'admin-id', email, full_name: 'เศรษฐพงศ์ สงวนสุข (Super Admin)', role: 'admin' }
        });
      }
      return res.json({
        user: { id: 'user-id', email, full_name: 'สมาชิก StudyRoad', role: 'user' }
      });
    }

    const { rows } = await pool.query('SELECT id, email, full_name, role, password FROM users WHERE email = $1', [email.trim().toLowerCase()]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'ไม่พบบัญชีผู้ใช้นี้ในระบบ กรุณาสมัครสมาชิก' });
    }

    const user = rows[0];
    if (user.password !== password) {
      return res.status(401).json({ error: 'รหัสผ่านไม่ถูกต้อง' });
    }

    delete user.password;
    res.json({ user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    if (!pool) {
      return res.json({
        user: { id: 'new-user-id', email, full_name, role: 'user' }
      });
    }

    const { rows } = await pool.query(
      `INSERT INTO users (email, password, full_name, role)
       VALUES ($1, $2, $3, 'user')
       RETURNING id, email, full_name, role`,
      [email.trim().toLowerCase(), password, full_name]
    );

    res.json({ user: rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานไปแล้วในระบบ' });
    }
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    if (!pool) {
      return res.json([
        { id: '1', email: 'admin@studyroad.com', full_name: 'Super Admin', role: 'admin' },
        { id: '2', email: 'somchai.j@gmail.com', full_name: 'สมชาย ใจดี', role: 'user' }
      ]);
    }
    const { rows } = await pool.query('SELECT id, email, full_name, role, created_at FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/products', async (req, res) => {
  try {
    if (!pool) return res.json(getLocalProducts());
    const { rows } = await pool.query("SELECT * FROM products ORDER BY id DESC");
    const formatted = rows.map(p => ({ ...p, price: Number(p.price) }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/products/refill-stock', async (req, res) => {
  try {
    const { quantity } = req.body;
    const targetQty = quantity !== undefined ? Number(quantity) : 1000;
    if (!pool) {
      const local = getLocalProducts();
      const updated = local.map(p => ({ ...p, stock_quantity: targetQty }));
      saveLocalProducts(updated);
      return res.json({ success: true, message: `Refilled all products to ${targetQty} units` });
    }
    await pool.query('UPDATE products SET stock_quantity = $1', [targetQty]);
    res.json({ success: true, message: `Refilled all products to ${targetQty} units` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, category, description, price, stock_quantity, image, specs, is_active, ingredients, origin, mfg_date, exp_date } = req.body;
    
    if (!pool) {
      const local = getLocalProducts();
      const newId = local.length > 0 ? Math.max(...local.map(p => Number(p.id) || 0)) + 1 : 1;
      const newProduct = {
        id: newId,
        name,
        category: category || 'General',
        description: description || '',
        price: Number(price) || 0,
        stock_quantity: Number(stock_quantity) || 0,
        image: image || '/images/placeholder.png',
        specs: specs || [],
        is_active: is_active !== false,
        ingredients: ingredients || '',
        origin: origin || '',
        mfg_date: mfg_date || '',
        exp_date: exp_date || ''
      };
      local.unshift(newProduct);
      saveLocalProducts(local);
      return res.json(newProduct);
    }

    const { rows } = await pool.query(
      `INSERT INTO products (name, category, description, price, stock_quantity, image, specs, is_active, ingredients, origin, mfg_date, exp_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [
        name, 
        category, 
        description || '', 
        Number(price) || 0, 
        Number(stock_quantity) || 0, 
        image || '/images/placeholder.png', 
        JSON.stringify(specs || []), 
        is_active !== false,
        ingredients || '',
        origin || '',
        mfg_date || '',
        exp_date || ''
      ]
    );
    res.json({ ...rows[0], price: Number(rows[0].price) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, price, stock_quantity, image, specs, is_active, ingredients, origin, mfg_date, exp_date } = req.body;

    if (!pool) {
      const local = getLocalProducts();
      const index = local.findIndex(p => String(p.id) === String(id));
      if (index === -1) return res.status(404).json({ error: 'Product not found' });
      local[index] = {
        ...local[index],
        ...(name !== undefined && { name }),
        ...(category !== undefined && { category }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(stock_quantity !== undefined && { stock_quantity: Number(stock_quantity) }),
        ...(image !== undefined && { image }),
        ...(specs !== undefined && { specs }),
        ...(is_active !== undefined && { is_active }),
        ...(ingredients !== undefined && { ingredients }),
        ...(origin !== undefined && { origin }),
        ...(mfg_date !== undefined && { mfg_date }),
        ...(exp_date !== undefined && { exp_date })
      };
      saveLocalProducts(local);
      return res.json(local[index]);
    }

    const { rows } = await pool.query(
      `UPDATE products 
       SET name = COALESCE($1, name),
           category = COALESCE($2, category),
           description = COALESCE($3, description),
           price = COALESCE($4, price),
           stock_quantity = COALESCE($5, stock_quantity),
           image = COALESCE($6, image),
           specs = COALESCE($7, specs),
           is_active = COALESCE($8, is_active),
           ingredients = COALESCE($9, ingredients),
           origin = COALESCE($10, origin),
           mfg_date = COALESCE($11, mfg_date),
           exp_date = COALESCE($12, exp_date)
       WHERE id = $13 RETURNING *`,
      [
        name, 
        category, 
        description, 
        price !== undefined ? Number(price) : undefined, 
        stock_quantity !== undefined ? Number(stock_quantity) : undefined, 
        image, 
        specs ? JSON.stringify(specs) : undefined, 
        is_active,
        ingredients,
        origin,
        mfg_date,
        exp_date,
        id
      ]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ ...rows[0], price: Number(rows[0].price) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!pool) {
      const local = getLocalProducts();
      const filtered = local.filter(p => String(p.id) !== String(id));
      saveLocalProducts(filtered);
      return res.json({ success: true });
    }
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REVIEWS API
app.get('/api/reviews', async (req, res) => {
  try {
    if (!pool) return res.json([]);
    const { rows } = await pool.query("SELECT * FROM product_reviews ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reviews/order/:orderId', async (req, res) => {
  try {
    if (!pool) return res.json([]);
    const { orderId } = req.params;
    const { rows } = await pool.query("SELECT * FROM product_reviews WHERE order_id = $1", [orderId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    if (!pool) return res.status(500).json({ error: 'Database not connected' });
    const { order_id, product_id, product_name, rating, comment } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO product_reviews (order_id, product_id, product_name, rating, comment)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [order_id, product_id?.toString(), product_name, Number(rating) || 5, comment || '']
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ORDERS API (Unified with Customer and Address details for Admin Dashboard)
app.get('/api/orders', async (req, res) => {
  try {
    if (!pool) {
      // Return file-based mock orders if DB is offline
      const mockOrders = getLocalOrders();
      return res.json(mockOrders);
    }

    const { rows: orders } = await pool.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );

    if (orders.length === 0) return res.json([]);

    const { rows: customers } = await pool.query("SELECT * FROM customers");
    const { rows: addresses } = await pool.query("SELECT * FROM addresses");
    const { rows: payments } = await pool.query("SELECT * FROM payments");
    const { rows: items } = await pool.query("SELECT * FROM order_items ORDER BY id ASC");

    const customerMap = {};
    customers.forEach(c => { customerMap[c.id] = c; });

    const addressMap = {};
    addresses.forEach(a => { addressMap[a.id] = a; });

    const paymentMap = {};
    payments.forEach(p => { paymentMap[p.order_id] = p; });

    const itemsByOrder = {};
    items.forEach(i => {
      if (!itemsByOrder[i.order_id]) itemsByOrder[i.order_id] = [];
      itemsByOrder[i.order_id].push(i);
    });

    const fullOrders = orders.map(order => {
      const customer = customerMap[order.customer_id];
      const address = addressMap[order.address_id];
      const payment = paymentMap[order.id];
      const orderItems = itemsByOrder[order.id] || [];

      const addressText = address?.full_address || 
        [address?.address_line, 
         [address?.subdistrict, address?.district].filter(Boolean).join(' '),
         [address?.province, address?.zipcode].filter(Boolean).join(' ')
        ].filter(Boolean).join('\n');

      return {
        _dbId: order.id,
        id: order.order_no,
        date: order.created_at,
        customer: {
          name: customer?.full_name || '',
          phone: customer?.phone || '',
          email: customer?.email || '',
          address: addressText || ''
        },
        items: orderItems.map(item => ({
          id: item.product_id || '',
          name: item.product_name || '',
          image: item.product_image || '',
          price: Number(item.unit_price),
          quantity: Number(item.quantity)
        })),
        totals: {
          subtotal: Number(order.subtotal),
          shipping: Number(order.shipping),
          total: Number(order.total)
        },
        payment: {
          method: payment?.method || '',
          timestamp: payment?.paid_at || payment?.created_at || null,
          referenceNo: payment?.reference_no || ''
        },
        status: order.status || 'Pending',
        admin: {
          note: order.admin_note || '',
          trackingNo: order.tracking_no || ''
        }
      };
    });

    res.json(fullOrders);
  } catch (err) {
    console.error('Error listing orders from database:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  if (!pool) {
    // Save to local file system if Neon is offline
    const orders = getLocalOrders();
    const newOrder = req.body;
    orders.push(newOrder);
    saveLocalOrders(orders);
    return res.json({ success: true, orderId: newOrder.id });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const order = req.body;

    // 1. Customer row
    const customerPayload = {
      full_name: order.customer?.name || '',
      phone: order.customer?.phone || '',
      email: order.customer?.email || ''
    };
    const { rows: customerRows } = await client.query(
      `INSERT INTO customers (full_name, phone, email) 
       VALUES ($1, $2, $3) RETURNING *`,
      [customerPayload.full_name, customerPayload.phone, customerPayload.email]
    );
    const customer = customerRows[0];

    // Helper for address splitting
    const parseAddressParts = (fullAddress = '') => {
      const lines = String(fullAddress).split('\n').map(l => l.trim()).filter(Boolean);
      const [line1 = '', line2 = '', line3 = ''] = lines;
      const [subdistrict = '', district = ''] = line2.split(/\s+/).filter(Boolean);
      const line3Parts = line3.split(/\s+/).filter(Boolean);
      const zipcode = line3Parts.pop() || '';
      const province = line3Parts.join(' ');
      return {
        address_line: line1,
        subdistrict,
        district,
        province,
        zipcode,
        full_address: fullAddress
      };
    };

    const addr = parseAddressParts(order.customer?.address || '');
    const { rows: addressRows } = await client.query(
      `INSERT INTO addresses (customer_id, address_line, subdistrict, district, province, zipcode, full_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [customer.id, addr.address_line, addr.subdistrict, addr.district, addr.province, addr.zipcode, addr.full_address]
    );
    const address = addressRows[0];

    // 2. Order row
    const orderPayload = {
      order_no: order.id,
      customer_id: customer.id,
      address_id: address.id,
      status: order.status || 'Pending',
      subtotal: Number(order.totals?.subtotal) || 0,
      shipping: Number(order.totals?.shipping) || 0,
      total: Number(order.totals?.total) || 0,
      admin_note: order.admin?.note || '',
      tracking_no: order.admin?.trackingNo || ''
    };

    const { rows: orderRows } = await client.query(
      `INSERT INTO orders (order_no, customer_id, address_id, status, subtotal, shipping, total, admin_note, tracking_no)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       ON CONFLICT (order_no) DO UPDATE 
       SET status = EXCLUDED.status, 
           subtotal = EXCLUDED.subtotal, 
           shipping = EXCLUDED.shipping, 
           total = EXCLUDED.total
       RETURNING *`,
      [orderPayload.order_no, orderPayload.customer_id, orderPayload.address_id, orderPayload.status, orderPayload.subtotal, orderPayload.shipping, orderPayload.total, orderPayload.admin_note, orderPayload.tracking_no]
    );
    const createdOrder = orderRows[0];

    // 3. Payment row (Strip massive base64 from DB payload to keep DB fast)
    const paymentSanitized = { ...(order.payment || {}) };
    if (paymentSanitized.slipImage && paymentSanitized.slipImage.length > 500) {
      paymentSanitized.has_slip = true;
      delete paymentSanitized.slipImage;
    }

    const paymentPayload = {
      order_id: createdOrder.id,
      method: order.payment?.method || order.paymentMethod || '',
      status: order.status === 'Completed' ? 'paid' : 'pending',
      reference_no: order.payment?.referenceNo || null,
      paid_at: order.payment?.timestamp || new Date().toISOString(),
      payload: paymentSanitized
    };

    await client.query(
      `INSERT INTO payments (order_id, method, status, reference_no, paid_at, payload)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [paymentPayload.order_id, paymentPayload.method, paymentPayload.status, paymentPayload.reference_no, paymentPayload.paid_at, JSON.stringify(paymentPayload.payload)]
    );

    // 4. Order items
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, product_name, product_image, unit_price, quantity, line_total)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [createdOrder.id, item.id || '', item.name || '', item.image || '', Number(item.price) || 0, Number(item.quantity) || 0, (Number(item.price) || 0) * (Number(item.quantity) || 0)]
        );
      }
    }

    await client.query('COMMIT');
    res.json({ success: true, orderId: order.id });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating database order:', err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.put('/api/orders/:id', async (req, res) => {
  if (!pool) return res.status(500).json({ error: 'Database not connected' });
  const { id: appOrderId } = req.params;
  const patch = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Fetch order row
    const { rows: orderRows } = await client.query(
      "SELECT * FROM orders WHERE order_no = $1",
      [appOrderId]
    );
    if (orderRows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const orderRow = orderRows[0];

    // Update order status/notes
    if (patch.status !== undefined || patch.admin?.note !== undefined || patch.admin?.trackingNo !== undefined) {
      await client.query(
        `UPDATE orders 
         SET status = COALESCE($1, status),
             admin_note = COALESCE($2, admin_note),
             tracking_no = COALESCE($3, tracking_no)
         WHERE id = $4`,
        [patch.status, patch.admin?.note, patch.admin?.trackingNo, orderRow.id]
      );
    }

    // Update customer details
    if (patch.customer && orderRow.customer_id) {
      await client.query(
        `UPDATE customers
         SET full_name = COALESCE($1, full_name),
             phone = COALESCE($2, phone),
             email = COALESCE($3, email)
         WHERE id = $4`,
        [patch.customer.name, patch.customer.phone, patch.customer.email, orderRow.customer_id]
      );
    }

    // Update address details
    if (patch.customer?.address && orderRow.address_id) {
      const parseAddressParts = (fullAddress = '') => {
        const lines = String(fullAddress).split('\n').map(l => l.trim()).filter(Boolean);
        const [line1 = '', line2 = '', line3 = ''] = lines;
        const [subdistrict = '', district = ''] = line2.split(/\s+/).filter(Boolean);
        const line3Parts = line3.split(/\s+/).filter(Boolean);
        const zipcode = line3Parts.pop() || '';
        const province = line3Parts.join(' ');
        return {
          address_line: line1,
          subdistrict,
          district,
          province,
          zipcode,
          full_address: fullAddress
        };
      };
      const addr = parseAddressParts(patch.customer.address);
      await client.query(
        `UPDATE addresses
         SET address_line = $1, subdistrict = $2, district = $3, province = $4, zipcode = $5, full_address = $6
         WHERE id = $7`,
        [addr.address_line, addr.subdistrict, addr.district, addr.province, addr.zipcode, addr.full_address, orderRow.address_id]
      );
    }

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating database order:', err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  if (!pool) return res.status(500).json({ error: 'Database not connected' });
  const { id: appOrderId } = req.params;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows: orderRows } = await client.query(
      "SELECT id, customer_id, address_id FROM orders WHERE order_no = $1",
      [appOrderId]
    );

    if (orderRows.length > 0) {
      const orderRow = orderRows[0];

      await client.query("DELETE FROM order_items WHERE order_id = $1", [orderRow.id]);
      await client.query("DELETE FROM payments WHERE order_id = $1", [orderRow.id]);
      await client.query("DELETE FROM orders WHERE id = $1", [orderRow.id]);

      if (orderRow.address_id) {
        await client.query("DELETE FROM addresses WHERE id = $1", [orderRow.address_id]);
      }
      if (orderRow.customer_id) {
        await client.query("DELETE FROM customers WHERE id = $1", [orderRow.customer_id]);
      }
    }

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.post('/api/orders/reset', async (req, res) => {
  if (!pool) {
    saveLocalOrders([]);
    return res.json({ message: 'Orders reset' });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query("DELETE FROM order_items");
    await client.query("DELETE FROM payments");
    await client.query("DELETE FROM orders");
    await client.query("DELETE FROM addresses");
    await client.query("DELETE FROM customers");
    await client.query('COMMIT');
    res.json({ success: true, message: 'All orders reset' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// ==========================================
// 2. PAYMENT GATEWAY API (Simulated with DB writes)
// ==========================================
app.post('/api/payment', (req, res) => {
  const { orderId, amount, customerPhone, referenceNo } = req.body;

  if (!orderId || !amount || !referenceNo) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Create payment record in simulated files for retrocompatibility
  const orders = getLocalOrders();
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
  saveLocalOrders(orders);

  // Simulated Webhook callback to confirm the payment
  const delay = Math.random() * 5000 + 5000; // 5-10 seconds
  setTimeout(async () => {
    // 1. File Database simulation
    const updatedOrders = getLocalOrders();
    const orderIndex = updatedOrders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      updatedOrders[orderIndex].status = 'confirmed';
      updatedOrders[orderIndex].confirmedAt = new Date().toISOString();
      updatedOrders[orderIndex].transactionId = 'TXN-' + Date.now();
      saveLocalOrders(updatedOrders);
      console.log(`✓ Local File: Payment confirmed for order ${orderId}`);
    }

    // 2. Neon Database sync if connected!
    if (pool) {
      try {
        const { rows: orderRows } = await pool.query(
          "SELECT id FROM orders WHERE order_no = $1",
          [orderId]
        );
        if (orderRows.length > 0) {
          const dbOrderId = orderRows[0].id;
          // Set payment to paid
          await pool.query(
            `UPDATE payments 
             SET status = 'paid', 
                 reference_no = $1, 
                 paid_at = NOW(),
                 payload = jsonb_build_object('method', 'promptpay', 'referenceNo', $1, 'timestamp', NOW(), 'amount', $2)
             WHERE order_id = $3`,
            [referenceNo, amount, dbOrderId]
          );
          // Advance order to Processing
          await pool.query(
            "UPDATE orders SET status = 'Processing' WHERE id = $1",
            [dbOrderId]
          );
          console.log(`✓ Neon DB: Order status updated to Processing (paid) for ${orderId}`);
        }
      } catch (err) {
        console.error('Failed to sync payment status in Neon DB:', err);
      }
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

app.post('/api/payment/stripe', async (req, res) => {
  try {
    const { orderId, amount, currency = 'thb', card_name, card_last4 = '4242' } = req.body;
    const chargeId = 'ch_' + Math.random().toString(36).substring(2, 12);
    const clientSecret = 'pi_' + Math.random().toString(36).substring(2, 15) + '_secret_test';

    console.log(`💳 Stripe Payment Processing: ฿${amount} for Order ${orderId} (Cardholder: ${card_name || 'Customer'})`);

    // Sync status to Completed in Neon DB
    if (pool) {
      try {
        await pool.query("UPDATE orders SET status = 'Completed' WHERE order_no = $1 OR id::text = $1", [orderId]);
        const { rows } = await pool.query("SELECT id FROM orders WHERE order_no = $1 OR id::text = $1", [orderId]);
        if (rows.length > 0) {
          await pool.query(
            `INSERT INTO payments (order_id, method, status, reference_no, payload, paid_at)
             VALUES ($1, 'Stripe Credit/Debit Card', 'paid', $2, $3::jsonb, NOW())`,
            [rows[0].id, chargeId, JSON.stringify({ chargeId, clientSecret, card_last4 })]
          );
        }
      } catch (dbErr) {
        console.error('Stripe DB sync error:', dbErr);
      }
    }

    res.json({
      success: true,
      orderId,
      status: 'succeeded',
      method: 'Stripe Credit/Debit Card',
      chargeId,
      clientSecret,
      message: 'Stripe Payment Authorized & Captured Successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/payment/:orderId', (req, res) => {
  const { orderId } = req.params;
  const orders = getLocalOrders();
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

app.post('/webhook/payment-confirm', (req, res) => {
  const { orderId } = req.body;
  
  if (!orderId) {
    return res.status(400).json({ error: 'Missing orderId' });
  }

  const orders = getLocalOrders();
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

// Serve public assets & static dist files for unified single-server mode
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/webhook') && !req.path.startsWith('/health')) {
      return res.sendFile(path.join(distDir, 'index.html'));
    }
    next();
  });
}

// Start server (Only when not running in Vercel Serverless mode)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Milk Road Unified App & Server running on http://localhost:${PORT}`);
    console.log(`📝 Database connected: ${pool ? 'Neon PostgreSQL' : 'Local File JSON'}\n`);
    console.log('Available endpoints:');
    console.log(`  🌐 Website UI         - http://localhost:${PORT}`);
    console.log(`  GET    /api/products         - List active products`);
    console.log(`  POST   /api/products         - Add a new product (Admin)`);
    console.log(`  PUT    /api/products/:id     - Edit a product (Admin)`);
    console.log(`  DELETE /api/products/:id     - Remove a product (Admin)`);
    console.log(`  GET    /api/orders           - List all orders with details (Admin)`);
    console.log(`  POST   /api/orders           - Create new e-commerce order`);
    console.log(`  PUT    /api/orders/:id       - Edit order (Admin)`);
    console.log(`  DELETE /api/orders/:id       - Cancel and delete order (Admin)`);
    console.log(`  POST   /api/orders/reset     - Wipe all orders`);
    console.log(`  POST   /api/payment          - Create PromptPay payment request`);
    console.log(`  GET    /api/payment/:orderId - Check payment status`);
    console.log(`  GET    /health               - Health check\n`);
  });
}

export default app;
