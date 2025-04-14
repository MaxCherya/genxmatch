import React from "react";
import { useTranslation } from "react-i18next";

interface PriceFilterProps {
    priceRange: [number, number];
    maxPrice: number;
    onPriceChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
    onRangeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ priceRange, maxPrice, onPriceChange, onRangeChange }) => {
    const { t } = useTranslation();

    return (
        <div>
            <h3 className="text-lg font-light tracking-wide mb-4">{t('catalog.price')}</h3>
            <div className="flex items-center gap-3 mb-4">
                <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => onPriceChange(e, 0)}
                    className="w-20 p-2 bg-gray-800/50 rounded-lg text-white text-base font-light focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={0}
                    max={priceRange[1]}
                />
                <span>-</span>
                <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => onPriceChange(e, 1)}
                    className="w-20 p-2 bg-gray-800/50 rounded-lg text-white text-base font-light focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={priceRange[0]}
                    max={maxPrice}
                />
            </div>
            <input
                type="range"
                min={0}
                max={maxPrice}
                value={priceRange[1]}
                onChange={onRangeChange}
                className="w-full accent-blue-500"
            />
        </div>
    );
};

export default PriceFilter;