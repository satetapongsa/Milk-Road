import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE } from '../config';

const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch(`${API_BASE}/products`);
                if (!res.ok) throw new Error('Failed to fetch products from backend');
                const data = await res.json();
                
                // Set images array or fallback (backwards compatibility)
                const formattedData = data.map(p => ({
                    ...p,
                    price: Number(p.price)
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
