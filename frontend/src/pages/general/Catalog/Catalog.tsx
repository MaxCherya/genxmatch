import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    fetchItemsPaginated,
    fetchCatalogFilters,
    Category,
    Item
} from "../../../endpoints/catalog";
import FilterSidebar from "../../../components/catalog/FilterSidebar";
import CategoryFilter from "../../../components/catalog/CategoryFilter";
import PriceFilter from "../../../components/catalog/PriceFilter";
import ProductCard from "../../../components/catalog/ProductCard";
import LoadingSpinner from "../../../components/general/LoadingSpinner";
import { useToast } from "../../../contexts/ToastContext";
import Cookies from 'js-cookie';
import { checkIsPotato } from "../../../endpoints/routing";
import { useNavigate } from "react-router-dom";

const Catalog: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { addToast } = useToast();

    const [products, setProducts] = useState<Item[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOption, setSortOption] = useState<"popularity" | "rating" | "price_asc" | "price_desc">("popularity");
    const [isPotato, setIsPotato] = useState<boolean>(true)

    const navigate = useNavigate();

    const getCategoryName = (cat: Category) => {
        switch (i18n.language) {
            case "ukr": return cat.name_ua;
            case "rus": return cat.name_rus;
            case "eng":
            default: return cat.name_eng;
        }
    };

    const getProductName = (product: Item) => {
        switch (i18n.language) {
            case "ukr": return product.name_ua;
            case "rus": return product.name_rus;
            case "eng":
            default: return product.name_eng;
        }
    };

    useEffect(() => {
        const addButton = async () => {
            const access = Cookies.get('access');
            const refresh = Cookies.get('refresh');

            if (access && refresh) {
                const res = await checkIsPotato();
                if (res.success) {
                    setIsPotato(true)
                }
            } else {
                return
            }
        }

        addButton()
    }, [])

    useEffect(() => {
        const loadFilters = async () => {
            try {
                const res = await fetchCatalogFilters();
                setCategories(res.categories);
                setMaxPrice(res.max_price || 1000);
                setPriceRange([0, res.max_price || 1000]);
            } catch (e) {
                addToast(t("catalog.filter_error"), "error");
            }
        };
        loadFilters();
    }, []);

    useEffect(() => {
        const loadItems = async () => {
            setLoading(true);
            try {
                const res = await fetchItemsPaginated({
                    page: currentPage,
                    minPrice: priceRange[0],
                    maxPrice: priceRange[1],
                    categories: selectedCategories,
                    sort: sortOption,
                });
                setProducts(res.results);
                const pageSize = res.results.length > 0 ? res.results.length : 1;
                setTotalPages(Math.ceil(res.count / pageSize));
            } catch (err) {
                addToast(t("catalog.fetch_error"), "error");
            } finally {
                setLoading(false);
            }
        };
        loadItems();
    }, [selectedCategories, priceRange, currentPage, sortOption]);

    const handleCategoryChange = (categoryId: number) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
        setCurrentPage(1);
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = Number(e.target.value);
        setPriceRange((prev) => {
            const newRange: [number, number] = [...prev];
            newRange[index] = value;
            return newRange;
        });
        setCurrentPage(1);
    };

    const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPriceRange([priceRange[0], Number(e.target.value)]);
        setCurrentPage(1);
    };

    const parentCategories = categories.filter(c => c.subcategories.length > 0);

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const range: (number | "...")[] = [];
        const delta = 1;

        const start = Math.max(2, currentPage - delta);
        const end = Math.min(totalPages - 1, currentPage + delta);

        if (start > 2) range.push(1, "...");
        else for (let i = 1; i < start; i++) range.push(i);

        for (let i = start; i <= end; i++) range.push(i);

        if (end < totalPages - 1) range.push("...", totalPages);
        else for (let i = end + 1; i <= totalPages; i++) range.push(i);

        return (
            <div className="flex justify-center gap-2 mt-8 flex-wrap">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-30"
                >
                    {t("pagination.prev", "Prev")}
                </button>

                {range.map((p, i) =>
                    typeof p === "number" ? (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(p)}
                            className={`px-3 py-1 border rounded text-sm ${p === currentPage ? "bg-indigo-600 text-white border-indigo-600" : "text-white"}`}
                        >
                            {p}
                        </button>
                    ) : (
                        <span key={i} className="px-2 text-gray-400">…</span>
                    )
                )}

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-30"
                >
                    {t("pagination.next", "Next")}
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white relative">
            <LoadingSpinner isLoading={loading} />

            <div className="flex flex-col lg:flex-row gap-6 p-6 md:p-8 lg:p-12">
                <FilterSidebar isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen}>
                    <CategoryFilter
                        categories={parentCategories}
                        selectedCategories={selectedCategories}
                        onCategoryChange={handleCategoryChange}
                        getLabel={getCategoryName}
                    />
                    <PriceFilter
                        priceRange={priceRange}
                        maxPrice={maxPrice}
                        onPriceChange={handlePriceChange}
                        onRangeChange={handleRangeChange}
                    />
                </FilterSidebar>

                {isPotato && (
                    <div className="fixed bg-white rounded-4xl p-3 bottom-4 right-4">
                        <button onClick={() => navigate('/add-product')} className="text-black">{t('potato.add_product')}</button>
                    </div>
                )}

                <div className="flex-1 mt-0 lg:mt-12">
                    <div className="flex flex-row justify-between w-full mb-6">
                        <h2 className="text-2xl md:text-3xl font-light tracking-wide">{t('navbar.catalog')}</h2>
                        <div className="flex justify-end">
                            <select
                                value={sortOption}
                                onChange={(e) => {
                                    setSortOption(e.target.value as any);
                                    setCurrentPage(1);
                                }}
                                className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-1 text-sm"
                            >
                                <option value="popularity">{t("catalog.sort.popularity", "Most Popular")}</option>
                                <option value="rating">{t("catalog.sort.rating", "Highest Rated")}</option>
                                <option value="price_asc">{t("catalog.sort.price_asc", "Price: Low to High")}</option>
                                <option value="price_desc">{t("catalog.sort.price_desc", "Price: High to Low")}</option>
                            </select>
                        </div>
                    </div>
                    {products.length === 0 && !loading ? (
                        <p className="text-gray-400 text-lg font-light">{t('catalog.no_products')}</p>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        getProductName={getProductName}
                                    />
                                ))}
                            </div>
                            {renderPagination()}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Catalog;