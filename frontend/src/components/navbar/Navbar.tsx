import React, { useEffect, useState } from "react";
import LanguageSwitcher from "../general/LanguageSwitcher";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from '/assets/logo.png';

interface NavbarProps {
    isFullscreen?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isFullscreen = false }) => {
    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { t } = useTranslation();

    const navigate = useNavigate();

    const categories = [
        { name: t('navbar.catalog'), icon: "📚", action: () => navigate('/catalog') },
        { name: t('navbar.contact_us'), icon: "✉️", action: () => console.log("Contact Us clicked") },
        { name: t('navbar.cart'), icon: "🛒", action: () => navigate('/cart') },
    ];

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

    if (isFullscreen) return null;

    return (
        <AnimatePresence>
            {show && (
                <motion.nav
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.3)] h-[60px] md:h-[70px] flex items-center justify-between px-4 md:px-8 lg:px-12 border-b border-gray-800/50"
                >
                    {/* Logo or Brand */}
                    <motion.div
                        className="flex items-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <img
                            className="w-16 md:w-[108px] drop-shadow-md"
                            src={logo}
                            alt="Logo"
                        />
                    </motion.div>

                    {/* Desktop Categories */}
                    <div className="hidden lg:flex flex-1 justify-center gap-8">
                        {categories.map((category) => (
                            <motion.button
                                key={category.name}
                                onClick={category.action}
                                className="group flex cursor-pointer items-center gap-2 text-sm md:text-base font-light tracking-wide transition-all duration-300"
                                whileHover={{ y: -2 }}
                                transition={{ duration: 0.1 }}
                            >
                                <span
                                    className="font-[Rubik_Mono_One] uppercase text-gray-400/70 hover:text-white transition duration-300"
                                >
                                    {category.name}
                                </span>
                            </motion.button>
                        ))}
                    </div>

                    {/* Language Switcher (Desktop) */}
                    <div className="hidden lg:flex items-center">
                        <LanguageSwitcher />
                    </div>

                    {/* Hamburger Menu Button (Mobile) */}
                    <motion.button
                        className="lg:hidden text-gray-200 p-2 rounded-full hover:bg-gray-700/30 transition-all duration-200"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </motion.button>

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
                                    {categories.map((category) => (
                                        <motion.button
                                            key={category.name}
                                            onClick={() => {
                                                category.action();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="flex items-center justify-start gap-3 w-full py-2 text-gray-200 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                                            whileHover={{ x: 5 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <span
                                                className="font-[Rubik_Mono_One] uppercase font-light text-gray-400 transition duration-300"
                                            >
                                                {category.name}
                                            </span>
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