import { Item } from "./catalog";

interface CartItem {
    id: string; // Use a unique ID for each cart entry
    item: Item;
    quantity: number;
}

// Helper to generate a unique ID (simple timestamp + random for this example)
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Fetch cart items from local storage
export const fetchCartItems = async (): Promise<CartItem[]> => {
    try {
        const cart = localStorage.getItem("cart");
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error("Error fetching cart items from local storage:", error);
        throw error;
    }
};

// Add item to cart in local storage
export const addCartItem = async (item: Item, quantity: number = 1): Promise<void> => {
    try {
        const cartItems = await fetchCartItems();
        const existingItem = cartItems.find((cartItem) => cartItem.item.id === item.id);

        if (existingItem) {
            // Update quantity if item already exists
            existingItem.quantity += quantity;
        } else {
            // Add new item to cart
            cartItems.push({ id: generateId(), item, quantity });
        }

        localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (error) {
        console.error("Error adding item to cart in local storage:", error);
        throw error;
    }
};

// Update cart item quantity in local storage
export const updateCartItemQuantity = async (cartItemId: string, quantity: number): Promise<void> => {
    try {
        const cartItems = await fetchCartItems();
        const itemIndex = cartItems.findIndex((cartItem) => cartItem.id === cartItemId);

        if (itemIndex !== -1) {
            if (quantity < 1) {
                // Remove item if quantity is 0
                cartItems.splice(itemIndex, 1);
            } else {
                cartItems[itemIndex].quantity = quantity;
            }
            localStorage.setItem("cart", JSON.stringify(cartItems));
        }
    } catch (error) {
        console.error("Error updating cart item in local storage:", error);
        throw error;
    }
};

// Remove cart item from local storage
export const removeCartItem = async (cartItemId: string): Promise<void> => {
    try {
        const cartItems = await fetchCartItems();
        const updatedCart = cartItems.filter((cartItem) => cartItem.id !== cartItemId);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
        console.error("Error removing cart item from local storage:", error);
        throw error;
    }
};

export function removeCartItems() {
    localStorage.removeItem("cart");
}