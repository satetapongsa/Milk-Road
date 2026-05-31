import { API_BASE } from '../config';

const sortOrders = (orders) =>
  [...orders].sort((a, b) => {
    const da = new Date(a?.payment?.timestamp || a?.date || 0).getTime();
    const db = new Date(b?.payment?.timestamp || b?.date || 0).getTime();
    return db - da;
  });

export const listOrders = async () => {
    try {
        const res = await fetch(`${API_BASE}/orders`);
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        return sortOrders(data);
    } catch (err) {
        console.error('Failed to list orders:', err);
        return [];
    }
};

export const getOrderById = async (appOrderId) => {
    if (!appOrderId) return null;
    try {
        const orders = await listOrders();
        return orders.find(o => o.id === appOrderId) || null;
    } catch (err) {
        console.error('Failed to get order by ID:', err);
        return null;
    }
};

export const createOrder = async (order) => {
    if (!order?.id) throw new Error('Invalid order payload');
    const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create order');
    }
    return getOrderById(order.id);
};

export const updateOrderById = async (appOrderId, patch) => {
    if (!appOrderId) throw new Error('Missing appOrderId');
    const res = await fetch(`${API_BASE}/orders/${appOrderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update order');
    }
    return getOrderById(appOrderId);
};

export const deleteOrderById = async (appOrderId) => {
    if (!appOrderId) return;
    const res = await fetch(`${API_BASE}/orders/${appOrderId}`, {
        method: 'DELETE'
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete order');
    }
};

export const clearOrders = async () => {
    const res = await fetch(`${API_BASE}/orders/reset`, {
        method: 'POST'
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to clear orders');
    }
};
