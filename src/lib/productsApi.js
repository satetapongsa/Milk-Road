const API_BASE = 'http://localhost:3001/api';

export const addProduct = async (productData) => {
    const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to add product');
    }
    return res.json();
};

export const updateProduct = async (id, productData) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update product');
    }
    return res.json();
};

export const deleteProduct = async (id) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete product');
    }
    return true;
};

export const refillAllStock = async (quantity = 1000) => {
    const res = await fetch(`${API_BASE}/admin/products/refill-stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to refill stock');
    }
    return res.json();
};

