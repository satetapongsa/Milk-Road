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
        console.warn('Failed to list orders from backend server, returning local orders:', err);
        return [];
    }
};

export const getOrderById = async (appOrderId) => {
    if (!appOrderId) return null;
    try {
        const orders = await listOrders();
        return orders.find(o => o.id === appOrderId) || null;
    } catch (err) {
        console.warn('Failed to get order by ID from server:', err);
        return null;
    }
};

export const createOrder = async (order) => {
    if (!order?.id) return order;
    try {
        const res = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            console.warn('Backend order creation returned non-ok status, using local receipt:', err);
        } else {
            const fetched = await getOrderById(order.id);
            if (fetched) return fetched;
        }
    } catch (err) {
        console.warn('Backend connection unavailable for order creation, using local fallback:', err);
    }
    return order;
};

export const updateOrderById = async (appOrderId, patch) => {
    if (!appOrderId) return null;
    try {
        const res = await fetch(`${API_BASE}/orders/${appOrderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patch)
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            console.warn('Failed to update order on server:', err);
        }
    } catch (err) {
        console.warn('Server connection error during updateOrderById:', err);
    }
    return null;
};

export const deleteOrderById = async (appOrderId) => {
    if (!appOrderId) return;
    try {
        await fetch(`${API_BASE}/orders/${appOrderId}`, {
            method: 'DELETE'
        });
    } catch (err) {
        console.warn('Server connection error during deleteOrderById:', err);
    }
};

export const clearOrders = async () => {
    try {
        await fetch(`${API_BASE}/orders/reset`, {
            method: 'POST'
        });
    } catch (err) {
        console.warn('Server connection error during clearOrders:', err);
    }
};
