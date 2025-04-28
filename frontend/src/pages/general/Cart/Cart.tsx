import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { fetchCartItems } from "../../../endpoints/cart";
import CartItem from "../../../components/cart/CartItem";
import CartSummary from "../../../components/cart/CartSummary";
import LoadingSpinner from "../../../components/general/LoadingSpinner";
import { useToast } from "../../../contexts/ToastContext";
import { useCart } from "../../../contexts/CartContext";

const Cart: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const { refreshCart } = useCart();

    // Calculate total price
    const totalPrice = cartItems.reduce(
        (total, cartItem) => total + Number(cartItem.item.price_uah) * cartItem.quantity,
        0
    );

    // Check if any item has dimensions or weight
    const itemAnthropometryWarning = cartItems.some(cartItem => {
        const { item } = cartItem;
        return (
            (item.item_height && item.item_height > 0) ||
            (item.item_length && item.item_length > 0) ||
            (item.item_width && item.item_width > 0) ||
            (item.item_weight && item.item_weight > 0)
        );
    });

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
        refreshCart();
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

    // Handle checkout button click
    const handleCheckout = () => {
        navigate('/checkout', {
            state: {
                cartItems: cartItems,
                itemAnthropometryWarning: itemAnthropometryWarning,
            }
        });
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
                            <CartSummary
                                totalPrice={totalPrice}
                                itemAnthropometryWarning={itemAnthropometryWarning}
                                onCheckout={handleCheckout} // Pass checkout handler
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;