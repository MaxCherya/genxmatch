import React from "react";
import { useTranslation } from "react-i18next";

interface CategoryFilterProps {
    categories: string[];
    selectedCategories: string[];
    onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategories, onCategoryChange }) => {
    const { t } = useTranslation();

    return (
        <div className="mb-8">
            <h3 className="text-lg font-light tracking-wide mb-4">{t('catalog.categories')}</h3>
            {categories.map((category) => (
                <label key={category} className="flex items-center gap-3 mb-3 text-gray-200 hover:text-white">
                    <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => onCategoryChange(category)}
                        className="w-5 h-5 accent-blue-500 rounded"
                    />
                    <span className="text-base font-light">{category}</span>
                </label>
            ))}
        </div>
    );
};

export default CategoryFilter;