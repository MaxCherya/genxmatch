import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useLocation } from "react-router-dom";

interface Category {
    name: string;
    icon: string;
    action: () => void;
    path?: string; // Added for active route comparison
    highlight?: boolean;
}

interface NavbarCategoryLinksProps {
    categories: Category[];
    cartCount: number;
}

const NavbarCategoryLinks: React.FC<NavbarCategoryLinksProps> = ({ categories, cartCount }) => {
    const location = useLocation();

    return (
        <div className="flex-shrink-0 flex gap-3">
            {categories.map((category) => {
                const isActive = category.highlight || (category.path && location.pathname.startsWith(category.path));

                return (
                    <motion.button
                        key={category.name}
                        onClick={category.action}
                        className={clsx(
                            "group flex cursor-pointer items-center gap-2 text-sm md:text-base tracking-wide transition-all duration-300 relative",
                            isActive && "text-blue-400"
                        )}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.1 }}
                    >
                        <span
                            className={clsx(
                                "uppercase transition duration-300 text-base font-extrabold",
                                isActive ? "text-blue-400" : "text-gray-400/70 hover:text-white"
                            )}
                        >
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
        </div>
    );
};

export default NavbarCategoryLinks;