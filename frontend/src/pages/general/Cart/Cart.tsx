import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fetchCartItems } from "../../../endpoints/cart";
import CartItem from "../../../components/cart/CartItem";
import CartSummary from "../../../components/cart/CartSummary";
import LoadingSpinner from "../../../components/general/LoadingSpinner";
import { useToast } from "../../../contexts/ToastContext";

const Cart: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { addToast } = useToast();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Calculate total price
    const totalPrice = cartItems.reduce(
        (total, cartItem) => total + Number(cartItem.item.price_uah) * cartItem.quantity,
        0
    );

    // Fetch cart items
    const loadCartItems = async () => {
        setLoading(true);
        try {
            const data = await fetchCartItems();
            setCartItems(data);
        } catch (error) {
            addToast(t('cart.fetch_error'), "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCartItems();
    }, []);

    // Determine the product name based on the current language
    const getProductName = (item: any) => {
        switch (i18n.language) {
            case "ukr":
                return item.name_ua;
            case "rus":
                return item.name_rus;
            case "eng":
            default:
                return item.name_eng;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white relative">
            {/* Loading Spinner */}
            <LoadingSpinner isLoading={loading} />

            {/* Main Content */}
            <div className="p-6 md:p-8 lg:p-12">
                <h2 className="text-2xl md:text-3xl font-light tracking-wide mb-6 mt-0 lg:mt-12">{t('navbar.cart')}</h2>
                {cartItems.length === 0 && !loading ? (
                    <p className="text-gray-400 text-lg font-light">{t('cart.empty')}</p>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Cart Items */}
                        <div className="flex-1 flex flex-col gap-4">
                            {cartItems.map((cartItem) => (
                                <CartItem
                                    key={cartItem.id}
                                    cartItem={cartItem}
                                    getProductName={getProductName}
                                    onUpdate={loadCartItems}
                                />
                            ))}
                        </div>
                        {/* Cart Summary */}
                        <div className="lg:w-1/3">
                            <CartSummary totalPrice={totalPrice} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;