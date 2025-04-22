import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useToast } from "../../contexts/ToastContext";
import { updateCartItemQuantity, removeCartItem } from "../../endpoints/cart";

interface CartItemProps {
    cartItem: any;
    getProductName: (item: any) => string;
    onUpdate: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ cartItem, getProductName, onUpdate }) => {
    const { t, i18n } = useTranslation();
    const { addToast } = useToast();
    const [quantity, setQuantity] = React.useState(cartItem.quantity);
    const [isUpdating, setIsUpdating] = React.useState(false);

    const handleQuantityChange = async (newQuantity: number) => {
        if (newQuantity < 1) return;
        setIsUpdating(true);
        try {
            await updateCartItemQuantity(cartItem.id, newQuantity);
            setQuantity(newQuantity);
            onUpdate();
        } catch (error) {
            addToast(t('cart.update_error'), "error");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRemove = async () => {
        setIsUpdating(true);
        try {
            await removeCartItem(cartItem.id);
            onUpdate();
            addToast(t('cart.item_removed'), "success");
        } catch (error) {
            addToast(t('cart.remove_error'), "error");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <motion.div
            className="bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl rounded-xl p-4 shadow-[0_4px_30px_rgba(0,0,0,0.3)] border border-gray-800/50 flex flex-col sm:flex-row items-center gap-4"
            whileHover={{ y: -5, boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}
            transition={{ duration: 0.3 }}
        >
            <img
                src={cartItem.item.main_image || "https://via.placeholder.com/300x192?text=No+Image"}
                alt={getProductName(cartItem.item)}
                className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-light tracking-wide mb-2">{getProductName(cartItem.item)}</h3>
                <p className="text-gray-400 text-sm mb-2">
                    {cartItem.item.categories
                        .map((cat: any) => {
                            switch (i18n.language) {
                                case "ukr": return cat.name_ua;
                                case "rus": return cat.name_rus;
                                case "eng":
                                default: return cat.name_eng;
                            }
                        })
                        .join(", ")
                    }
                </p>
                <p className="text-xl font-light mb-2">₴{cartItem.item.price_uah}</p>
            </div>
            <div className="flex items-center gap-2">
                <motion.button
                    className="px-3 py-1 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-white disabled:opacity-50"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1 || isUpdating}
                    whileTap={{ scale: 0.95 }}
                >
                    -
                </motion.button>
                <span className="text-lg font-light">{quantity}</span>
                <motion.button
                    className="px-3 py-1 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-white disabled:opacity-50"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={isUpdating}
                    whileTap={{ scale: 0.95 }}
                >
                    +
                </motion.button>
            </div>
            <motion.button
                className="px-4 py-2 bg-red-600/80 hover:bg-red-500/80 rounded-lg text-white text-base font-light tracking-wide transition-all duration-200 disabled:opacity-50"
                onClick={handleRemove}
                disabled={isUpdating}
                whileTap={{ scale: 0.95 }}
            >
                {t('cart.remove')}
            </motion.button>
        </motion.div>
    );
};

export default CartItem;