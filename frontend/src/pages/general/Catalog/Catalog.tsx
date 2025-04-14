import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fetchItems } from "../../../endpoints/catalog";
import FilterSidebar from "../../../components/catalog/FilterSidebar";
import CategoryFilter from "../../../components/catalog/CategoryFilter";
import PriceFilter from "../../../components/catalog/PriceFilter";
import ProductCard from "../../../components/catalog/ProductCard";
import LoadingSpinner from "../../../components/general/LoadingSpinner";
import { useToast } from "../../../contexts/ToastContext";

const Catalog: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [products, setProducts] = useState<any[]>([]);
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    const categories = [...new Set(allProducts.flatMap((product) => product.categories.map((cat: any) => cat.name)))];

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const data = await fetchItems();
                setAllProducts(data);
                setProducts(data);

                // Calculate max price for the price range filter
                const prices = data.map((item: any) => Number(item.price_uah));
                const max = Math.ceil(Math.max(...prices));
                setMaxPrice(max > 0 ? max : 1000);
                setPriceRange([0, max > 0 ? max : 1000]);
            } catch (error) {
                addToast(t('catalog.fetch_error'), "error");
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [t, addToast]);

    // Filter products based on selected categories and price range
    useEffect(() => {
        const filtered = allProducts.filter((product) => {
            const productCategories = product.categories.map((cat: any) => cat.name);
            const inCategory = selectedCategories.length === 0 || selectedCategories.some((cat) => productCategories.includes(cat));
            const inPriceRange = Number(product.price_uah) >= priceRange[0] && Number(product.price_uah) <= priceRange[1];
            return inCategory && inPriceRange;
        });
        setProducts(filtered);
    }, [selectedCategories, priceRange, allProducts]);

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

    const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPriceRange([priceRange[0], Number(e.target.value)]);
    };

    // Determine the name field based on the current language
    const getProductName = (product: any) => {
        switch (i18n.language) {
            case "ukr":
                return product.name_ua;
            case "rus":
                return product.name_rus;
            case "eng":
            default:
                return product.name_eng;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white relative">
            {/* Loading Spinner */}
            <LoadingSpinner isLoading={loading} />

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6 p-6 md:p-8 lg:p-12">
                {/* Filter Sidebar */}
                <FilterSidebar isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen}>
                    <CategoryFilter
                        categories={categories}
                        selectedCategories={selectedCategories}
                        onCategoryChange={handleCategoryChange}
                    />
                    <PriceFilter
                        priceRange={priceRange}
                        maxPrice={maxPrice}
                        onPriceChange={handlePriceChange}
                        onRangeChange={handleRangeChange}
                    />
                </FilterSidebar>

                {/* Product Grid */}
                <div className="flex-1 mt-0 lg:mt-12">
                    <h2 className="text-2xl md:text-3xl font-light tracking-wide mb-6">{t('navbar.catalog')}</h2>
                    {products.length === 0 && !loading ? (
                        <p className="text-gray-400 text-lg font-light">{t('catalog.no_products')}</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    getProductName={getProductName}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Catalog;