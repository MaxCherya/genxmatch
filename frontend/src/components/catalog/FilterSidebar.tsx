import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FilterSidebarProps {
    isFilterOpen: boolean;
    setIsFilterOpen: (open: boolean) => void;
    children: React.ReactNode;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ isFilterOpen, setIsFilterOpen, children }) => {
    const { t } = useTranslation();

    return (
        <div className="lg:w-1/4 mt-12">
            {/* Filter Toggle Button (Mobile) */}
            <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg text-base font-light tracking-wide transition-all duration-200 
    ${isFilterOpen ? 'bg-cyan-700/80 text-white ring-2 ring-cyan-400' : 'bg-gray-800/50 text-white hover:bg-gray-700/50'}`}
            >
                <motion.div
                    animate={{ rotate: isFilterOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <Filter size={20} />
                </motion.div>
                <span>{t('catalog.filters')}</span>
            </button>

            {/* Filter Content */}
            <AnimatePresence>
                {(isFilterOpen || window.innerWidth >= 1024) && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="lg:block bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl rounded-xl p-6 mt-4 lg:mt-0 shadow-[0_4px_30px_rgba(0,0,0,0.3)] border border-gray-800/50 overflow-hidden"
                    >
                        {/* Close Button (Mobile) */}
                        <button
                            className="lg:hidden flex items-center justify-end w-full text-gray-200 hover:text-white"
                            onClick={() => setIsFilterOpen(false)}
                        >
                            <X size={20} />
                        </button>

                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FilterSidebar;