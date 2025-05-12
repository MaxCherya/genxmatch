import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Product {
    id: number;
    name_ua: string;
    name_eng: string;
    name_rus: string;
    short_description_ua: string;
    short_description_eng: string;
    short_description_rus: string;
    artiqul_original: string;
    main_image: string;
    price_uah: string;
    rating: string;
    sold: number;
}

interface LastViewedProps {
    products: Product[];
}

const LastViewed: React.FC<LastViewedProps> = ({ products }) => {
    const { t, i18n } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const getProductName = (product: Product) => {
        switch (i18n.language) {
            case 'ukr':
                return product.name_ua || product.name_eng;
            case 'rus':
                return product.name_rus || product.name_eng;
            case 'eng':
            default:
                return product.name_eng;
        }
    };

    const getProductDescription = (product: Product) => {
        switch (i18n.language) {
            case 'ukr':
                return product.short_description_ua || product.short_description_eng;
            case 'rus':
                return product.short_description_rus || product.short_description_eng;
            case 'eng':
            default:
                return product.short_description_eng;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-gray-900/90 rounded-xl p-4 mb-1">
                <h2 className="text-2xl font-semibold text-white">{t('last_viewed.title')}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentItems.length === 0 ? (
                    <div className="col-span-full">
                        <div className="bg-gray-900/90 rounded-xl p-4">
                            <p className="text-center text-gray-400 text-sm py-6">
                                {t('last_viewed.no_products')}
                            </p>
                        </div>
                    </div>
                ) : (
                    currentItems.map((product) => (
                        <motion.div
                            key={product.id}
                            className="bg-gray-900/90 rounded-xl p-4 flex flex-col items-center min-h-[400px] border border-gray-800/50 shadow-lg"
                            whileHover={{ y: -5, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="w-48 h-48 mb-4">
                                {product.main_image ? (
                                    <img
                                        src={product.main_image}
                                        alt={getProductName(product)}
                                        className="w-full h-full object-contain rounded-lg"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                                        {t('last_viewed.no_image')}
                                    </div>
                                )}
                            </div>
                            <div className="text-center flex flex-col items-center flex-grow">
                                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 h-12">
                                    {getProductName(product)}
                                </h3>
                                <p className="text-sm text-gray-400 mb-4 line-clamp-2 h-10">
                                    {getProductDescription(product) || t('last_viewed.no_description')}
                                </p>
                                <div className="mt-auto text-center">
                                    <span className="text-xl font-medium text-green-400 block mb-2">
                                        ₴{product.price_uah}
                                    </span>
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-lg text-yellow-400">★ {product.rating}</span>
                                        <span className="text-sm text-gray-400">
                                            🛍️ {product.sold}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {products.length > itemsPerPage && (
                <div className="mt-8 flex justify-center space-x-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <motion.button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === index + 1
                                ? 'bg-blue-600/80 text-white'
                                : 'bg-gray-800/70 text-gray-400 hover:bg-gray-700/70'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {index + 1}
                        </motion.button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LastViewed;