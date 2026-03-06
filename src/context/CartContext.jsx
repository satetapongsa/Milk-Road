import { createContext, useContext, useEffect, useReducer } from 'react';
import { CONFIG } from '../data/products';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existing = state.find(item => item.id === action.payload.id);
            if (existing) {
                return state.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...state, { ...action.payload, quantity: 1 }];
        }
        case 'REMOVE_ITEM':
            return state.filter(item => item.id !== action.payload);
        case 'UPDATE_QUANTITY': {
            const { id, change } = action.payload;
            return state.map(item => {
                if (item.id === id) {
                    const newQty = item.quantity + change;
                    return newQty > 0 ? { ...item, quantity: newQty } : null;
                }
                return item;
            }).filter(Boolean);
        }
        case 'CLEAR_CART':
            return [];
        case 'LOAD_CART':
            return action.payload;
        default:
            return state;
    }
};

export function CartProvider({ children }) {
    const [cart, dispatch] = useReducer(cartReducer, [], () => {
        const localData = localStorage.getItem('shopii_cart');
        return localData ? JSON.parse(localData) : [];
    });

    useEffect(() => {
        localStorage.setItem('shopii_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => dispatch({ type: 'ADD_ITEM', payload: product });
    const removeFromCart = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
    const updateQuantity = (id, change) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, change } });
    const clearCart = () => dispatch({ type: 'CLEAR_CART' });

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + (cart.length > 0 ? CONFIG.shippingCost : 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal, total }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
