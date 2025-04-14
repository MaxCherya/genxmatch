import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { X, Filter } from "lucide-react";

// Mock product data (replace with API data later)
const mockProducts = [
    { id: 1, name: "RGB Floor Lamp", category: "Lighting", price: 120, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=300&auto=format&fit=crop" },
    { id: 2, name: "Smart Speaker", category: "Electronics", price: 80, image: "https://images.unsplash.com/photo-1605648916361-8d4e6a936e56?q=80&w=300&auto=format&fit=crop" },
    { id: 3, name: "Modern Sofa", category: "Furniture", price: 450, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9ec?q=80&w=300&auto=format&fit=crop" },
    { id: 4, name: "LED Strip Lights", category: "Lighting", price: 30, image: "https://images.unsplash.com/photo-1603217017497-50d2c4c9a2d6?q=80&w=300&auto=format&fit=crop" },
    { id: 5, name: "Wireless Headphones", category: "Electronics", price: 150, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop" },
    { id: 6, name: "Coffee Table", category: "Furniture", price: 200, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=300&auto=format&fit=crop" },
];

const Catalog: React.FC = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState(mockProducts);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Extract unique categories from products
    const categories = [...new Set(mockProducts.map((product) => product.category))];

    // Filter products based on selected categories and price range
    useEffect(() => {
        const filtered = mockProducts.filter((product) => {
            const inCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
            const inPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
            return inCategory && inPriceRange;
        });
        setProducts(filtered);
    }, [selectedCategories, priceRange]);

    // Handle category filter changes
    const handleCategoryChange = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    // Handle price range changes
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = Number(e.target.value);
        setPriceRange((prev) => {
            const newRange = [...prev] as [number, number];
            newRange[index] = value;
            return newRange;
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white">
            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6 p-6 md:p-8 lg:p-12">
                {/* Filter Sidebar (Desktop: Visible, Mobile: Collapsible) */}
                <div className="lg:w-1/4 mt-12">
                    {/* Filter Toggle Button (Mobile) */}
                    <button
                        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-white text-base font-light tracking-wide transition-all duration-200"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <Filter size={20} />
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

                                {/* Category Filter */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-light tracking-wide mb-4">{t('catalog.categories')}</h3>
                                    {categories.map((category) => (
                                        <label key={category} className="flex items-center gap-3 mb-3 text-gray-200 hover:text-white">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(category)}
                                                onChange={() => handleCategoryChange(category)}
                                                className="w-5 h-5 accent-blue-500 rounded"
                                            />
                                            <span className="text-base font-light">{category}</span>
                                        </label>
                                    ))}
                                </div>

                                {/* Price Filter */}
                                <div>
                                    <h3 className="text-lg font-light tracking-wide mb-4">{t('catalog.price')}</h3>
                                    <div className="flex items-center gap-3 mb-4">
                                        <input
                                            type="number"
                                            value={priceRange[0]}
                                            onChange={(e) => handlePriceChange(e, 0)}
                                            className="w-20 p-2 bg-gray-800/50 rounded-lg text-white text-base font-light focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min={0}
                                            max={priceRange[1]}
                                        />
                                        <span>-</span>
                                        <input
                                            type="number"
                                            value={priceRange[1]}
                                            onChange={(e) => handlePriceChange(e, 1)}
                                            className="w-20 p-2 bg-gray-800/50 rounded-lg text-white text-base font-light focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min={priceRange[0]}
                                            max={500}
                                        />
                                    </div>
                                    <input
                                        type="range"
                                        min={0}
                                        max={500}
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                        className="w-full accent-blue-500"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Product Grid */}
                <div className="flex-1 mt-0 lg:mt-12">
                    <h2 className="text-2xl md:text-3xl font-light tracking-wide mb-6">{t('navbar.catalog')}</h2>
                    {products.length === 0 ? (
                        <p className="text-gray-400 text-lg font-light">{t('catalog.no_products')}</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <motion.div
                                    key={product.id}
                                    className="bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl rounded-xl p-4 shadow-[0_4px_30px_rgba(0,0,0,0.3)] border border-gray-800/50"
                                    whileHover={{ y: -5, boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                    <h3 className="text-lg font-light tracking-wide mb-2">{product.name}</h3>
                                    <p className="text-gray-400 text-sm mb-2">{product.category}</p>
                                    <p className="text-xl font-light mb-4">${product.price}</p>
                                    <motion.button
                                        className="w-full px-4 py-2 bg-blue-600/80 hover:bg-blue-500/80 rounded-lg text-white text-base font-light tracking-wide transition-all duration-200"
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {t('catalog.view_details')}
                                    </motion.button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Catalog;