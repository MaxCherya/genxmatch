import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Category } from "../../endpoints/catalog";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface CategoryFilterProps {
    categories: Category[];
    selectedCategories: number[];
    onCategoryChange: (categoryId: number) => void;
    getLabel: (cat: Category) => string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
    categories,
    selectedCategories,
    onCategoryChange,
    getLabel
}) => {
    const { t } = useTranslation();
    const [openSections, setOpenSections] = useState<number[]>([]);

    const toggleSection = (id: number) => {
        setOpenSections((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );
    };

    return (
        <div className="mb-8">
            <h3 className="text-lg font-light tracking-wide mb-4">{t("catalog.categories")}</h3>

            {categories.map((parent) => {
                const isOpen = openSections.includes(parent.id);
                const hasSub = parent.subcategories.length > 0;

                return (
                    <div key={parent.id} className="mb-2">
                        <div
                            onClick={() => toggleSection(parent.id)}
                            className="flex justify-between items-center cursor-pointer text-white font-semibold text-base border-b border-gray-700 py-1"
                        >
                            <span>{getLabel(parent)}</span>
                            {hasSub ? (
                                isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                            ) : null}
                        </div>

                        <AnimatePresence initial={false}>
                            {isOpen && hasSub && (
                                <motion.div
                                    key="dropdown"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                    className="overflow-hidden pl-4"
                                >
                                    <div className="space-y-2 mt-2">
                                        {parent.subcategories.map((sub) => (
                                            <label
                                                key={sub.id}
                                                className="flex items-center space-x-2 text-sm text-gray-300"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(sub.id)}
                                                    onChange={() => onCategoryChange(sub.id)}
                                                    className="form-checkbox text-indigo-500 focus:ring-indigo-500"
                                                />
                                                <span>{getLabel(sub)}</span>
                                            </label>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
};

export default CategoryFilter;