import React, { useEffect, useState } from "react";
import { CategoriesBackend } from "../../endpoints/potato";
import { getCategories } from "../../endpoints/potato";

interface CategoriesSelectorProps {
    selected: number[];
    onChange: (selected: number[]) => void;
}

const CategoriesSelector: React.FC<CategoriesSelectorProps> = ({
    selected,
    onChange,
}) => {
    const [categories, setCategories] = useState<CategoriesBackend[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        getCategories()
            .then((data) => {
                setCategories(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch categories", err);
                setLoading(false);
            });
    }, []);

    const toggleSelection = (id: number) => {
        const updated = selected.includes(id)
            ? selected.filter((item) => item !== id)
            : [...selected, id];
        onChange(updated);
    };

    const isSelected = (id: number) => selected.includes(id);

    const renderCategories = (
        cats: CategoriesBackend[],
        level: number = 0
    ): React.ReactNode =>
        cats.map((cat) => (
            <div key={cat.id} className={`ml-${level * 4} space-y-1`}>
                <label className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isSelected(cat.id)}
                        onChange={() => toggleSelection(cat.id)}
                        className="accent-blue-600"
                    />
                    <span className="text-gray-800">{cat.name_ua}</span>
                </label>
                {cat.subcategories?.length > 0 && (
                    <div className="ml-4 border-l border-gray-200 pl-4">
                        {renderCategories(cat.subcategories, level + 1)}
                    </div>
                )}
            </div>
        ));

    return (
        <div className="p-4 bg-white rounded-xl shadow-md max-w-3xl w-full">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
                Select Categories
            </h2>
            {loading ? (
                <p className="text-sm text-gray-500">Loading categories...</p>
            ) : (
                <div className="space-y-2">{renderCategories(categories)}</div>
            )}
        </div>
    );
};

export default CategoriesSelector;