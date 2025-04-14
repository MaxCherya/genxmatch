import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useToast } from "../../contexts/ToastContext";

interface CartSummaryProps {
    totalPrice: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ totalPrice }) => {
    const { t } = useTranslation();
    const { addToast } = useToast();

    const handleCheckout = () => {
        // Placeholder for checkout logic
        addToast(t('cart.checkout_success'), "success");
    };

    return (
        <div className="bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl rounded-xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.3)] border border-gray-800/50">
            <h3 className="text-lg font-light tracking-wide mb-4">{t('cart.summary')}</h3>
            <div className="flex justify-between items-center mb-4">
                <span className="text-gray-200 text-base font-light">{t('cart.total')}</span>
                <span className="text-xl font-light">₴{totalPrice.toFixed(2)}</span>
            </div>
            <motion.button
                className="w-full px-4 py-2 bg-blue-600/80 hover:bg-blue-500/80 rounded-lg text-white text-base font-light tracking-wide transition-all duration-200"
                onClick={handleCheckout}
                whileTap={{ scale: 0.95 }}
            >
                {t('cart.checkout')}
            </motion.button>
        </div>
    );
};

export default CartSummary;