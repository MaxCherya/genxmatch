import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from '/assets/logo.png';

import { FaCircleUser } from "react-icons/fa6";

import LanguageSwitcher from "../general/LanguageSwitcher";
import { useCart } from "../../contexts/CartContext";
import { searchItems } from "../../endpoints/catalog";
import type { Item } from "../../endpoints/catalog";

import NavbarSearch from "./NavbarSearch";
import NavbarCategoryLinks from "./NavbarCategoryLinks";
import NavbarMobileMenu from "./NavbarMobileMenu";
import NavbarUserMenu from "./NavbarUserMenu";

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
    const [showUserMenu, setShowUserMenu] = useState(false);

    const { cartCount } = useCart();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const getProductName = (product: Item) => {
        switch (i18n.language) {
            case "ukr": return product.name_ua;
            case "rus": return product.name_rus;
            case "eng":
            default: return product.name_eng;
        }
    };

    const getProductDescription = (product: Item) => {
        switch (i18n.language) {
            case "ukr": return product.short_description_ua;
            case "rus": return product.short_description_rus;
            case "eng":
            default: return product.short_description_eng;
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            setShow(currentY <= lastScrollY || currentY < 50);
            setLastScrollY(currentY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (searchTerm.trim().length >= 2) {
                setLoadingSearch(true);
                try {
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
        { name: t('navbar.catalog'), icon: "📚", action: () => navigate('/catalog'), path: "/catalog" },
        { name: t('navbar.contact_us'), icon: "✉️", action: () => console.log("Contact Us clicked") },
        { name: t('navbar.cart'), icon: "🛒", action: () => navigate('/cart'), path: "/cart", highlight: cartCount > 0 },
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
                    <div className="hidden lg:flex w-full items-center justify-between">
                        {/* Left: Logo */}
                        <motion.div
                            className="flex-shrink-0"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img
                                className="w-28 md:w-32 drop-shadow-lg transition-transform duration-300"
                                src={logo}
                                alt="Logo"
                            />
                        </motion.div>

                        {/* Center: Search + Profile + Links */}
                        <div className="flex items-center gap-2 flex-grow justify-center">
                            <FaCircleUser className="w-6 h-6 text-gray-400 cursor-pointer" onClick={() => setShowUserMenu(!showUserMenu)} />
                            {showUserMenu && (
                                <NavbarUserMenu onClose={() => setShowUserMenu(!showUserMenu)} />
                            )}
                            <div className="relative w-full max-w-[23svw]">
                                <NavbarSearch
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    searchResults={searchResults}
                                    loadingSearch={loadingSearch}
                                    nextPageUrl={nextPageUrl}
                                    onResultClick={(item) => {
                                        navigate(`/product-page/${item.id}`);
                                        setSearchTerm('');
                                        setSearchResults([]);
                                    }}
                                    onLoadMore={async () => {
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
                                    getProductName={getProductName}
                                    getProductDescription={getProductDescription}
                                />
                            </div>

                            <div className="flex items-center ml-2">
                                <NavbarCategoryLinks categories={categories} cartCount={cartCount} />
                            </div>
                        </div>

                        {/* Right: Language */}
                        <div className="flex items-center gap-4 flex-shrink-0">
                            <LanguageSwitcher />
                        </div>
                    </div>

                    {/* Mobile layout */}
                    <div className="flex lg:hidden w-full items-center justify-between">
                        <img className="w-18 drop-shadow-md" src={logo} alt="Logo" />
                        <div className="flex flex-row items-center gap-2">
                            <FaCircleUser className="w-5 h-5 text-gray-400 cursor-pointer" onClick={() => setShowUserMenu(!showUserMenu)} />
                            {showUserMenu && (
                                <NavbarUserMenu onClose={() => setShowUserMenu(!showUserMenu)} />
                            )}
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
                    </div>

                    {/* Mobile menu */}
                    <NavbarMobileMenu
                        isOpen={isMobileMenuOpen}
                        closeMenu={() => setIsMobileMenuOpen(false)}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        searchResults={searchResults}
                        loadingSearch={loadingSearch}
                        nextPageUrl={nextPageUrl}
                        onResultClick={(item) => {
                            navigate(`/product-page/${item.id}`);
                            setSearchTerm('');
                            setSearchResults([]);
                            setIsMobileMenuOpen(false);
                        }}
                        onLoadMore={async () => {
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
                        categories={categories}
                        cartCount={cartCount}
                        getProductName={getProductName}
                        getProductDescription={getProductDescription}
                    />
                </motion.nav>
            )}
        </AnimatePresence>
    );
};

export default Navbar;