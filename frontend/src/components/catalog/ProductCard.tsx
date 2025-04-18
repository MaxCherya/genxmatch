// src/components/ProductCard.tsx
import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useToast } from "../../contexts/ToastContext";
import { addCartItem } from "../../endpoints/cart";
import PriceTag from "../item-page/PriceTag";

interface ProductCardProps {
    product: any;
    getProductName: (product: any) => string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, getProductName }) => {
    const { t, i18n } = useTranslation();
    const { addToast } = useToast();

    const handleAddToCart = async () => {
        try {
            await addCartItem(product);
            addToast(t('catalog.added_to_cart'), "success");
        } catch (error) {
            addToast(t('catalog.add_to_cart_error'), "error");
        }
    };

    return (
        <motion.div
            className="bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl rounded-xl p-4 shadow-[0_4px_30px_rgba(0,0,0,0.3)] border border-gray-800/50 flex flex-col justify-evenly"
            whileHover={{ y: -5, boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}
            transition={{ duration: 0.3 }}
        >
            <img
                src={product.main_image || "https://via.placeholder.com/300x192?text=No+Image"}
                alt={getProductName(product)}
                className="w-48 h-48 object-cover rounded-lg mb-4 self-center"
            />
            <h3 className="text-lg font-light tracking-wide mb-2">{getProductName(product)}</h3>
            <p className="text-gray-400 text-sm mb-2">
                {product.categories.map((cat: any) => {
                    switch (i18n.language) {
                        case "ukr": return cat.name_ua;
                        case "rus": return cat.name_rus;
                        case "eng":
                        default: return cat.name_eng;
                    }
                }).join(", ")}
            </p>
            <div className="flex flex-col gap-2">
                <PriceTag size="sm" current={product.price_uah} currency="₴" />
                <div className="flex flex-col gap-2">
                    <motion.button
                        className="flex-1 px-4 py-2 bg-blue-600/80 hover:bg-blue-500/80 rounded-lg text-white text-base font-light tracking-wide transition-all duration-200"
                        whileTap={{ scale: 0.95 }}
                    >
                        {t('catalog.view_details')}
                    </motion.button>
                    <motion.button
                        className="flex-1 px-4 py-2 bg-green-600/80 hover:bg-green-500/80 rounded-lg text-white text-base font-light tracking-wide transition-all duration-200"
                        onClick={handleAddToCart}
                        whileTap={{ scale: 0.95 }}
                    >
                        {t('catalog.add_to_cart')}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;