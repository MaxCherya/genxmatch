import React, { useEffect, useState } from "react";
import LanguageSwitcher from "../general/LanguageSwitcher";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
    isFullscreen?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isFullscreen = false }) => {
    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

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

    // Hide navbar if fullscreen is active
    if (isFullscreen) return null;

    return (
        <AnimatePresence>
            {show && (
                <motion.nav
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed top-0 left-0 right-0 h-[7svh] z-50 px-4 py-2 bg-black/80 flex justify-end items-center align-middle pointer-events-none backdrop-blur"
                >
                    <div className="pointer-events-auto">
                        <LanguageSwitcher />
                    </div>
                </motion.nav>
            )}
        </AnimatePresence>
    );
};

export default Navbar;