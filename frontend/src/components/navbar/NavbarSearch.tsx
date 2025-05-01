import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import LoadingIndicator from "../general/LoadingIndicator";
import { Item } from "../../endpoints/catalog";

interface NavbarSearchProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    searchResults: Item[];
    loadingSearch: boolean;
    nextPageUrl: string | null;
    onResultClick: (item: Item) => void;
    onLoadMore: () => void;
    getProductName: (item: Item) => string;
    getProductDescription: (item: Item) => string;
}

const NavbarSearch: React.FC<NavbarSearchProps> = ({
    searchTerm,
    setSearchTerm,
    searchResults,
    loadingSearch,
    nextPageUrl,
    onResultClick,
    onLoadMore,
    getProductName,
    getProductDescription,
}) => {
    const { t } = useTranslation();

    return (
        <div className="relative w-full">
            <input
                type="text"
                placeholder={t("navbar.search_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-1.5 rounded-xl bg-gray-800/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            {searchTerm && (
                <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                    <X size={16} />
                </button>
            )}
            {(searchTerm.trim() && (searchResults.length > 0 || loadingSearch)) && (
                <div
                    role="listbox"
                    aria-label={t('navbar.search_results')}
                    className="absolute top-full mt-2 w-full bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl z-50 max-h-[400px] overflow-y-auto border border-gray-700/50"
                >
                    {loadingSearch ? (
                        <div className="flex justify-center items-center py-6">
                            <LoadingIndicator theme="dark" />
                        </div>
                    ) : (
                        <>
                            {searchResults.map((item) => (
                                <motion.div
                                    key={item.id}
                                    onClick={() => onResultClick(item)}
                                    className="flex items-center gap-4 px-4 py-3 hover:bg-gray-800/80 cursor-pointer transition-all duration-200 border-b border-gray-800/30 last:border-b-0"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {item.main_image ? (
                                        <img
                                            src={item.main_image}
                                            alt={getProductName(item)}
                                            className="w-16 h-16 object-cover rounded-lg shadow-sm flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                                            No Image
                                        </div>
                                    )}
                                    <div className="flex flex-col flex-grow min-w-0">
                                        <span className="text-sm font-semibold text-white truncate">
                                            {getProductName(item)}
                                        </span>
                                        <p className="text-xs text-gray-400 line-clamp-2">
                                            {getProductDescription(item)}
                                        </p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-sm font-medium text-green-400">₴{item.price_uah}</span>
                                            <span className="text-xs text-yellow-400">★ {item.rating}</span>
                                            <span className="text-xs text-gray-400">🛍️ {t('navbar.sold', { count: item.sold })}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {searchResults.length === 0 && searchTerm.trim().length >= 2 && (
                                <div className="px-4 py-3 text-sm text-gray-400 text-center">
                                    {t("navbar.no_results")}
                                </div>
                            )}
                            {nextPageUrl && (
                                <button
                                    onClick={onLoadMore}
                                    className="w-full text-center py-3 text-sm font-medium text-green-400 hover:bg-gray-800/50 rounded-b-xl transition-all duration-200"
                                >
                                    {t("navbar.load_more")}
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default NavbarSearch;