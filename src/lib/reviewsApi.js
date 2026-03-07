import { isSupabaseEnabled, supabase } from './supabaseClient';

export const submitReview = async (reviewData) => {
    if (!isSupabaseEnabled || !supabase) {
        console.warn('Supabase not enabled, skipping review submit');
        return null;
    }

    try {
        const payload = {
            order_id: reviewData.order_id,
            product_id: reviewData.product_id?.toString() || '',
            product_name: reviewData.product_name || '',
            rating: typeof reviewData.rating === 'number' ? reviewData.rating : 5,
            comment: reviewData.comment || '',
        };

        const { data, error } = await supabase
            .from('product_reviews')
            .insert(payload)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (err) {
        console.error('Failed to submit review:', err);
        throw err;
    }
};

export const getReviewsByOrderId = async (orderId) => {
    if (!isSupabaseEnabled || !supabase) return [];

    try {
        const { data, error } = await supabase
            .from('product_reviews')
            .select('*')
            .eq('order_id', orderId);

        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error('Failed to get reviews:', err);
        return [];
    }
};

export const getAllReviews = async () => {
    if (!isSupabaseEnabled || !supabase) return [];

    try {
        const { data, error } = await supabase
            .from('product_reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error('Failed to get all reviews:', err);
        return [];
    }
};
