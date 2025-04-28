// CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchCartItems, removeCartItems } from "../endpoints/cart";

const CartContext = createContext<{
    cartCount: number;
    refreshCart: () => void;
    clearCart: () => void;         // ← add clearCart
}>({
    cartCount: 0,
    refreshCart: () => { },
    clearCart: () => { },
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);

    const refreshCart = async () => {
        try {
            const data = await fetchCartItems();
            setCartCount(data.length);
        } catch (error) {
            console.error("Failed to refresh cart", error);
        }
    };

    const clearCart = () => {
        // 1) Remove from localStorage (or your persistence)
        removeCartItems();
        // 2) Refresh the count so everywhere picks up “0”
        setCartCount(0);
    };

    useEffect(() => {
        refreshCart();
    }, []);

    return (
        <CartContext.Provider value={{ cartCount, refreshCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};