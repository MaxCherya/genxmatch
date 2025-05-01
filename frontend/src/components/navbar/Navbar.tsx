import React, { useEffect, useState } from "react";
import LanguageSwitcher from "../general/LanguageSwitcher";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from '/assets/logo.png';
import { useCart } from "../../contexts/CartContext";
import clsx from "clsx";
import { searchItems } from "../../endpoints/catalog";
import { Item } from "../../endpoints/catalog";
import LoadingIndicator from "../general/LoadingIndicator";

interface NavbarProps {
    isFullscreen?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isFullscreen = false }) => {
    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Item[]>([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);

    const { cartCount } = useCart();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    // Get product name based on current language
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

    // Get product description based on current language
    const getProductDescription = (product: Item) => {
        switch (i18n.language) {
            case "ukr":
                return product.short_description_ua;
            case "rus":
                return product.short_description_rus;
            case "eng":
            default:
                return product.short_description_eng;
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            if (currentY > lastScrollY && currentY > 50) {
                setShow(false);
            } else {
                setShow(true);
            }
            setLastScrollY(currentY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (searchTerm.trim().length >= 2) {
                try {
                    setLoadingSearch(true);
                    const res = await searchItems(searchTerm.trim(), 1);
                    setSearchResults(res.results);
                    setNextPageUrl(res.next || null);
                } catch (err) {
                    console.error("Search failed", err);
                    setSearchResults([]);
                    setNextPageUrl(null);
                } finally {
                    setLoadingSearch(false);
                }
            } else {
                setSearchResults([]);
                setNextPageUrl(null);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [searchTerm]);

    if (isFullscreen) return null;

    const categories = [
        { name: t('navbar.catalog'), icon: "📚", action: () => navigate('/catalog') },
        { name: t('navbar.contact_us'), icon: "✉️", action: () => console.log("Contact Us clicked") },
        { name: t('navbar.cart'), icon: "🛒", action: () => navigate('/cart'), highlight: cartCount > 0 },
    ];

    return (
        <AnimatePresence>
            {show && (
                <motion.nav
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.3)] h-[60px] md:h-[70px] flex items-center px-4 md:px-8 lg:px-12 border-b border-gray-800/50"
                >
                    {/* Desktop layout */}
                    <div className="hidden lg:flex w-full items-center justify-between gap-8">
                        {/* Logo */}
                        <motion.div
                            className="flex-shrink-0"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img className="w-16 md:w-[108px] drop-shadow-md" src={logo} alt="Logo" />
                        </motion.div>

                        {/* Search + Nav */}
                        <div className="flex items-center gap-8 flex-grow justify-center max-w-[70%]">
                            <div className="flex-grow max-w-md relative">
                                <input
                                    type="text"
                                    placeholder={t('navbar.search_placeholder')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-1.5 rounded-xl bg-gray-800/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
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
                                                        onClick={() => {
                                                            navigate(`/product-page/${item.id}`);
                                                            setSearchTerm('');
                                                            setSearchResults([]);
                                                        }}
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
                                                {searchResults.length === 0 && !loadingSearch && searchTerm.trim().length >= 2 && (
                                                    <div className="px-4 py-3 text-sm text-gray-400 text-center">
                                                        {t('navbar.no_results')}
                                                    </div>
                                                )}
                                                {nextPageUrl && (
                                                    <button
                                                        onClick={async () => {
                                                            if (!nextPageUrl) return;
                                                            setLoadingSearch(true);
                                                            try {
                                                                const nextPage = new URL(nextPageUrl).searchParams.get('page');
                                                                const res = await searchItems(searchTerm.trim(), Number(nextPage));
                                                                setSearchResults((prev) => [...prev, ...res.results]);
                                                                setNextPageUrl(res.next || null);
                                                            } catch (err) {
                                                                console.error('Load more failed:', err);
                                                            } finally {
                                                                setLoadingSearch(false);
                                                            }
                                                        }}
                                                        className="w-full text-center py-3 text-sm font-medium text-green-400 hover:bg-gray-800/50 rounded-b-xl transition-all duration-200"
                                                    >
                                                        {t('navbar.load_more')}
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex-shrink-0 flex gap-6">
                                {categories.map((category) => (
                                    <motion.button
                                        key={category.name}
                                        onClick={category.action}
                                        className={clsx(
                                            "group flex cursor-pointer items-center gap-2 text-sm md:text-base font-light tracking-wide transition-all duration-300 relative",
                                            category.highlight && "text-green-400"
                                        )}
                                        whileHover={{ y: -2 }}
                                        transition={{ duration: 0.1 }}
                                    >
                                        <span className={clsx("font-[Rubik_Mono_One] uppercase transition duration-300",
                                            category.highlight ? "text-green-400" : "text-gray-400/70 hover:text-white"
                                        )}>
                                            {category.name}
                                        </span>
                                        {category.name === t('navbar.cart') && cartCount > 0 && (
                                            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                                {cartCount}
                                            </span>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Language Switcher */}
                        <div className="flex-shrink-0">
                            <LanguageSwitcher />
                        </div>
                    </div>

                    {/* Mobile: Logo + Hamburger */}
                    <div className="flex lg:hidden w-full items-center justify-between">
                        <img className="w-18 drop-shadow-md" src={logo} alt="Logo" />
                        <motion.button
                            className="relative text-gray-200 p-2 rounded-full hover:bg-gray-700/30 transition-all duration-200"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            {!isMobileMenuOpen && cartCount > 0 && (
                                <span className="absolute top-1 right-1 bg-red-500 w-2.5 h-2.5 rounded-full animate-pulse" />
                            )}
                        </motion.button>
                    </div>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {isMobileMenuOpen && (
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
                                            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
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
                                                            onClick={() => {
                                                                navigate(`/product-page/${item.id}`);
                                                                setSearchTerm('');
                                                                setSearchResults([]);
                                                                setIsMobileMenuOpen(false);
                                                            }}
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
                                                    {searchResults.length === 0 && !loadingSearch && searchTerm.trim().length >= 2 && (
                                                        <div className="px-4 py-3 text-sm text-gray-400 text-center">
                                                            {t('navbar.no_results')}
                                                        </div>
                                                    )}
                                                    {nextPageUrl && (
                                                        <button
                                                            onClick={async () => {
                                                                if (!nextPageUrl) return;
                                                                setLoadingSearch(true);
                                                                try {
                                                                    const nextPage = new URL(nextPageUrl).searchParams.get('page');
                                                                    const res = await searchItems(searchTerm.trim(), Number(nextPage));
                                                                    setSearchResults((prev) => [...prev, ...res.results]);
                                                                    setNextPageUrl(res.next || null);
                                                                } catch (err) {
                                                                    console.error('Load more failed:', err);
                                                                } finally {
                                                                    setLoadingSearch(false);
                                                                }
                                                            }}
                                                            className="w-full text-center py-3 text-sm font-medium text-green-400 hover:bg-gray-800/50 rounded-b-xl transition-all duration-200"
                                                        >
                                                            {t('navbar.load_more')}
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                    {categories.map((category) => (
                                        <motion.button
                                            key={category.name}
                                            onClick={() => {
                                                category.action();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className={clsx(
                                                "group flex cursor-pointer items-center gap-2 text-sm md:text-base font-light tracking-wide transition-all duration-300 relative",
                                                category.highlight && "text-green-400"
                                            )}
                                            whileHover={{ y: -2 }}
                                            transition={{ duration: 0.1 }}
                                        >
                                            <span className={clsx(
                                                "font-[Rubik_Mono_One] uppercase transition duration-300",
                                                category.highlight ? "text-green-400" : "text-gray-400/70 hover:text-white"
                                            )}>
                                                {category.name}
                                            </span>
                                            {category.name === t('navbar.cart') && cartCount > 0 && (
                                                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </motion.button>
                                    ))}
                                    <div className="border-t border-gray-800/50 pt-4">
                                        <LanguageSwitcher isMobile />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.nav>
            )}
        </AnimatePresence>
    );
};

export default Navbar;