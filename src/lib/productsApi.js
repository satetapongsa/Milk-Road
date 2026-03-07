import { supabase, isSupabaseEnabled } from './supabaseClient';

export const addProduct = async (productData) => {
    if (!isSupabaseEnabled || !supabase) throw new Error("Supabase is not configured");
    
    // Clean up empty fields and ensure types
    const payload = {
        name: productData.name,
        category: productData.category,
        description: productData.description || '',
        price: Number(productData.price) || 0,
        stock_quantity: Number(productData.stock_quantity) || 0,
        image: productData.image || '/images/placeholder.png',
        is_active: productData.is_active !== false // default true
    };

    const { data, error } = await supabase
        .from('products')
        .insert([payload])
        .select()
        .single();
        
    if (error) throw error;
    return data;
};

export const updateProduct = async (id, productData) => {
    if (!isSupabaseEnabled || !supabase) throw new Error("Supabase is not configured");
    
    const payload = { ...productData };
    if (payload.price !== undefined) payload.price = Number(payload.price);
    if (payload.stock_quantity !== undefined) payload.stock_quantity = Number(payload.stock_quantity);

    const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
        
    if (error) throw error;
    return data;
};

export const deleteProduct = async (id) => {
    if (!isSupabaseEnabled || !supabase) throw new Error("Supabase is not configured");
    
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
    if (error) throw error;
    return true;
};
