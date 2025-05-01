import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import LoadingIndicator from "../general/LoadingIndicator";
import LanguageSwitcher from "../general/LanguageSwitcher";
import { Item } from "../../endpoints/catalog";

interface Category {
    name: string;
    icon: string;
    action: () => void;
    path?: string;
    highlight?: boolean;
}

interface NavbarMobileMenuProps {
    isOpen: boolean;
    closeMenu: () => void;
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    searchResults: Item[];
    loadingSearch: boolean;
    nextPageUrl: string | null;
    onResultClick: (item: Item) => void;
    onLoadMore: () => void;
    categories: Category[];
    cartCount: number;
    getProductName: (item: Item) => string;
    getProductDescription: (item: Item) => string;
}

const NavbarMobileMenu: React.FC<NavbarMobileMenuProps> = ({
    isOpen,
    closeMenu,
    searchTerm,
    setSearchTerm,
    searchResults,
    loadingSearch,
    nextPageUrl,
    onResultClick,
    onLoadMore,
    categories,
    cartCount,
    getProductName,
    getProductDescription,
}) => {
    const { t } = useTranslation();
    const location = useLocation();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute top-[60px] left-0 right-0 bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl lg:hidden border-t border-gray-800/80"
                >
                    <div className="flex flex-col p-6 gap-5">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t('navbar.search_placeholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {(searchTerm.trim() && (searchResults.length > 0 || loadingSearch)) && (
                            <div
                                role="listbox"
                                aria-label={t('navbar.search_results')}
                                className="w-full bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl max-h-[400px] overflow-y-auto border border-gray-700/50"
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
                                                        <span className="text-sm font-medium text-blue-400">₴{item.price_uah}</span>
                                                        <span className="text-xs text-yellow-400">★ {item.rating}</span>
                                                        <span className="text-xs text-gray-400">🛍️ {t('navbar.sold', { count: item.sold })}</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                        {searchResults.length === 0 && searchTerm.trim().length >= 2 && (
                                            <div className="px-4 py-3 text-sm text-gray-400 text-center">
                                                {t('navbar.no_results')}
                                            </div>
                                        )}
                                        {nextPageUrl && (
                                            <button
                                                onClick={onLoadMore}
                                                className="w-full text-center py-3 text-sm font-medium text-blue-400 hover:bg-gray-800/50 rounded-b-xl transition-all duration-200"
                                            >
                                                {t('navbar.load_more')}
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {categories.map((category) => {
                            const isActive = category.highlight || (category.path && location.pathname.startsWith(category.path));
                            return (
                                <motion.button
                                    key={category.name}
                                    onClick={() => {
                                        category.action();
                                        closeMenu();
                                    }}
                                    className={clsx(
                                        "group flex cursor-pointer items-center gap-2 text-sm md:text-base font-light tracking-wide transition-all duration-300 relative",
                                        isActive && "text-blue-400"
                                    )}
                                    whileHover={{ y: -2 }}
                                    transition={{ duration: 0.1 }}
                                >
                                    <span className={clsx(
                                        "font-[Advent_pro] font-bold text-xl uppercase transition duration-300",
                                        isActive ? "text-blue-400" : "text-gray-400/70 hover:text-white"
                                    )}>
                                        {category.name}
                                    </span>
                                    {category.name.toLowerCase().includes("cart") && cartCount > 0 && (
                                        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                            {cartCount}
                                        </span>
                                    )}
                                </motion.button>
                            );
                        })}

                        <div className="border-t border-gray-800/50 pt-4">
                            <LanguageSwitcher isMobile />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NavbarMobileMenu;