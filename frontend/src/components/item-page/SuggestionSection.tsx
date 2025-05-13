import React, { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "../catalog/ProductCard";
import { Item } from "../../endpoints/catalog";
import { useTranslation } from "react-i18next";

interface SuggestionsSectionProps {
    suggestions: Item[];
}

const ITEMS_PER_PAGE = 3;

const SuggestionsSection: React.FC<SuggestionsSectionProps> = ({ suggestions }) => {
    const [currentPage, setCurrentPage] = useState(0);

    const { t, i18n } = useTranslation();

    const getProductName = (product: Item) => {
        switch (i18n.language) {
            case "ukr":
                return product.name_ua;
            case "rus":
                return product.name_rus;
            case "eng":
            default:
                return product.name_eng;
        }
    };

    if (!suggestions.length) return null;

    const totalPages = Math.ceil(suggestions.length / ITEMS_PER_PAGE);

    const paginatedSuggestions = suggestions.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    );

    const handleNext = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const handlePrevious = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    return (
        <div className="w-full py-12 px-6">
            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-3xl text-white text-center font-bold mb-10"
            >
                {t('suggestions.header')}
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-8">
                {paginatedSuggestions.map((product) => (
                    <ProductCard key={product.id} product={product} getProductName={getProductName} />
                ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4">
                    <button
                        onClick={handlePrevious}
                        className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm"
                    >
                        {t('suggestions.previous')}
                    </button>
                    <span className="text-black text-sm">
                        {currentPage + 1} / {totalPages}
                    </span>
                    <button
                        onClick={handleNext}
                        className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm"
                    >
                        {t('suggestions.next')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SuggestionsSection;