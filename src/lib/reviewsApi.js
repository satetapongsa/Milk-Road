import { API_BASE } from '../config';

export const submitReview = async (reviewData) => {
    try {
        const res = await fetch(`${API_BASE}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviewData)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to submit review');
        }
        return res.json();
    } catch (err) {
        console.error('Failed to submit review:', err);
        throw err;
    }
};

export const getReviewsByOrderId = async (orderId) => {
    try {
        const res = await fetch(`${API_BASE}/reviews/order/${orderId}`);
        if (!res.ok) throw new Error('Failed to fetch reviews for order');
        return res.json();
    } catch (err) {
        console.error('Failed to get reviews:', err);
        return [];
    }
};

export const getAllReviews = async () => {
    try {
        const res = await fetch(`${API_BASE}/reviews`);
        if (!res.ok) throw new Error('Failed to fetch reviews');
        return res.json();
    } catch (err) {
        console.error('Failed to get all reviews:', err);
        return [];
    }
};
