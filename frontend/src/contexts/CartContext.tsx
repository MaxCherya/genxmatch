import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchCartItems } from "../endpoints/cart";

const CartContext = createContext<{
    cartCount: number;
    refreshCart: () => void;
}>({
    cartCount: 0,
    refreshCart: () => { },
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

    useEffect(() => {
        refreshCart();
    }, []);

    return (
        <CartContext.Provider value={{ cartCount, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
};