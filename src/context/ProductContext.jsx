import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const { data, error: err } = await supabase
                    .from('products')
                    .select('*')
                    .eq('is_active', true)
                    .order('created_at', { ascending: true }); // Ensure ordering is consistent

                if (err) throw err;
                
                // Set images array from Supabase or fallback to single image (backwards compatibility)
                const formattedData = data.map(p => ({
                    ...p,
                    price: Number(p.price),
                    // Convert images from text array to normal array if needed, handled by supabase JSONB natively though
                }));

                setProducts(formattedData);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProducts();
    }, []);

    const getProductById = (id) => {
        return products.find(p => p.id === Number(id));
    };

    return (
        <ProductContext.Provider value={{ products, isLoading, error, getProductById }}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    return useContext(ProductContext);
}
