// --- Mock Product Data ---
const products = [
    { id: 1, name: "Enterprise Laptop Pro X1", category: "Computers", price: 45900, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { id: 2, name: "Ergonomic Office Chair", category: "Furniture", price: 8500, image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { id: 3, name: "Wireless Noise Cancelling Headphones", category: "Audio", price: 5900, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { id: 4, name: "Mechanical Keyboard RGB", category: "Accessories", price: 3200, image: "https://images.unsplash.com/photo-1587829741301-dc798b91a603?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { id: 5, name: "4K Enterprise Monitor 27\"", category: "Monitors", price: 12500, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { id: 6, name: "Smart Watch Series 7", category: "Wearables", price: 11900, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { id: 7, name: "Professional Camera DSLR", category: "Cameras", price: 35900, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { id: 8, name: "Smartphone flagship 5G", category: "Mobile", price: 28900, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { id: 9, name: "Office Desk Lamp LED", category: "Furniture", price: 1200, image: "https://images.unsplash.com/photo-1534067783741-514d4dddb7b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { id: 10, name: "Portable SSD 1TB", category: "Storage", price: 4500, image: "https://images.unsplash.com/photo-1597872250969-bc7a2a838b3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { id: 11, name: "Gaming Mouse Wireless", category: "Accessories", price: 2100, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { id: 12, name: "Graphic Tablet Pro", category: "Electronics", price: 9500, image: "https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { id: 13, name: "Coffee Machine Automatic", category: "Home", price: 15900, image: "https://images.unsplash.com/photo-1517701604599-bb29b5dd7359?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { id: 14, name: "Air Purifier Smart", category: "Home", price: 6500, image: "https://images.unsplash.com/photo-1585771724684-382054863d61?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
];

// --- Config ---
const CONFIG = {
    currency: '฿',
    vatRate: 0.07,
    shippingCost: 50
};

// --- State ---
let cart = JSON.parse(localStorage.getItem('shopii_cart')) || [];

// --- Helpers ---
const el = (selector) => document.querySelector(selector);
const els = (selector) => document.querySelectorAll(selector);
const formatPrice = (price) => CONFIG.currency + price.toLocaleString('th-TH', { minimumFractionDigits: 2 });

const saveCart = () => {
    localStorage.setItem('shopii_cart', JSON.stringify(cart));
    updateCartUI();
};

// --- Core Actions ---

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(i => i.id === productId);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();

    // Badge Animation
    const badge = el('#cart-count');
    if (badge) {
        badge.classList.remove('bump');
        void badge.offsetWidth; // Reflow
        badge.classList.add('bump');
    }
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    if (window.location.pathname.includes('checkout.html')) loadCheckout();
}

function updateQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(id);
    } else {
        saveCart();
        if (window.location.pathname.includes('checkout.html')) loadCheckout();
    }
}

function updateCartUI() {
    const totalQty = cart.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    // Update Badges
    const badges = els('#cart-count, #cart-total-count');
    badges.forEach(b => b.textContent = totalQty);

    // Update Totals
    const subTotals = els('#cart-subtotal, #cart-total');
    subTotals.forEach(t => t.textContent = formatPrice(totalPrice));

    // Render Sidebar Items
    const container = el('#cart-items-container');
    if (container) {
        if (cart.length === 0) {
            container.innerHTML = `<div class="empty-cart-message">
                <i class="ri-shopping-basket-line" style="font-size: 32px; opacity: 0.5; margin-bottom: 8px;"></i>
                <p>ตะกร้าว่างเปล่า</p>
                <button class="btn btn-outline" onclick="closeCart()">เลือกสินค้า</button>
            </div>`;
        } else {
            container.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" class="cart-item-img">
                    <div class="cart-item-info">
                        <div>
                            <h4 class="cart-item-title">${item.name}</h4>
                            <div class="cart-item-price">${formatPrice(item.price)}</div>
                        </div>
                        <div class="cart-controls">
                            <div class="qty-control">
                                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                                <span class="qty-value">${item.quantity}</span>
                                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                            </div>
                            <button class="remove-item-btn" onclick="removeFromCart(${item.id})">ลบ</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
}

// --- Page Specific ---

// 1. Index Page
function initIndex() {
    renderProducts(products);

    // Search
    const searchInput = el('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = products.filter(p => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term));
            renderProducts(filtered);
        });
    }
}

function renderProducts(list) {
    const container = el('#products-container');
    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">ไม่พบสินค้าที่ค้นหา</p>';
        return;
    }

    container.innerHTML = list.map(product => `
        <div class="product-card">
            <img src="${product.image}" class="product-img" loading="lazy">
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">${formatPrice(product.price)}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <i class="ri-shopping-cart-2-line"></i> เพิ่มลงตะกร้า
                </button>
            </div>
        </div>
    `).join('');
}

// Sidebar Logic
const openCart = () => { el('.cart-sidebar').classList.add('open'); el('.cart-overlay').classList.add('open'); };
const closeCart = () => { el('.cart-sidebar').classList.remove('open'); el('.cart-overlay').classList.remove('open'); };

// 2. Checkout Page
function initCheckout() {
    loadCheckout();

    // Payment Toggles
    const options = els('input[name="payment"]');
    const ccFields = el('#credit-card-fields');

    options.forEach(opt => {
        opt.addEventListener('change', (e) => {
            els('.payment-option').forEach(p => p.classList.remove('selected'));
            e.target.closest('.payment-option').classList.add('selected');

            if (e.target.value === 'credit') {
                ccFields.classList.remove('hidden');
            } else {
                ccFields.classList.add('hidden');
            }
        });
    });
}

function loadCheckout() {
    const container = el('#checkout-items');
    if (!container) return;

    if (cart.length === 0) {
        window.location.href = 'index.html';
        return;
    }

    const total = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const grandTotal = total + CONFIG.shippingCost;

    container.innerHTML = cart.map(item => `
        <div class="summary-item">
            <div style="display:flex; align-items:center; gap:12px;">
                <img src="${item.image}" style="width:40px; height:40px; border-radius:4px; object-fit:cover;">
                <div>
                    <div>${item.name}</div>
                    <small style="color:var(--text-light)">x${item.quantity}</small>
                </div>
            </div>
            <strong>${formatPrice(item.price * item.quantity)}</strong>
        </div>
    `).join('');

    el('#checkout-subtotal').textContent = formatPrice(total);
    el('#checkout-total').textContent = formatPrice(grandTotal);
}

function processPayment() {
    const form = el('#shipping-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const btn = el('.confirm-btn');
    btn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> กำลังประมวลผล...';
    btn.disabled = true;

    setTimeout(() => {
        const receipt = {
            id: 'INV-' + Date.now().toString().slice(-6),
            date: new Date().toLocaleDateString('th-TH'),
            customer: el('#ship-name').value,
            items: cart,
            totals: {
                subtotal: cart.reduce((s, i) => s + (i.price * i.quantity), 0),
                shipping: CONFIG.shippingCost
            }
        };
        localStorage.setItem('shopii_receipt', JSON.stringify(receipt));
        cart = []; // Clear Cart
        saveCart();
        window.location.href = 'receipt.html';
    }, 2000);
}

// 3. Receipt Page
function initReceipt() {
    const data = JSON.parse(localStorage.getItem('shopii_receipt'));
    if (!data || !el('#invoice')) return; // Not receipt page or no data

    el('#receipt-id').textContent = data.id;
    el('#receipt-date').textContent = data.date;
    el('#receipt-customer').textContent = data.customer;

    const tbody = el('#receipt-items');
    tbody.innerHTML = data.items.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${formatPrice(item.price)}</td>
            <td>${formatPrice(item.price * item.quantity)}</td>
        </tr>
    `).join('');

    const sub = data.totals.subtotal;
    const vat = sub * CONFIG.vatRate;
    const total = sub + data.totals.shipping; // Simplified VAT logic for display

    el('#receipt-subtotal').textContent = formatPrice(sub);
    el('#receipt-vat').textContent = formatPrice(vat);
    el('#receipt-total').textContent = formatPrice(total);
}

// --- Bootstrap ---
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();

    const path = window.location.pathname;
    if (path.includes('checkout')) {
        initCheckout();
    } else if (path.includes('receipt')) {
        initReceipt();
    } else {
        initIndex(); // Default to index logic

        // Cart Toggle Events
        const btn = el('#cart-btn');
        if (btn) btn.addEventListener('click', openCart);
        const close = el('#close-cart');
        if (close) close.addEventListener('click', closeCart);
        const overlay = el('.cart-overlay');
        if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closeCart() });
    }
});

// Expose Global
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.closeCart = closeCart;
window.processPayment = processPayment;
window.checkout = () => window.location.href = 'checkout.html';
window.printReceipt = () => window.print();
