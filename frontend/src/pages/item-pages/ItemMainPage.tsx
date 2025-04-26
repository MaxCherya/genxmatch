import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useToast } from "../../contexts/ToastContext";
import { useCart } from "../../contexts/CartContext";
import { fetchItemById, Item } from "../../endpoints/catalog";
import { addCartItem } from "../../endpoints/cart"; // ✅ import correctly
import FeatureSection from "../../components/item-page/FeaturesSection";
import PriceTag from "../../components/item-page/PriceTag";
import ReviewStars from "../../components/item-page/ReviewStars";
import SpecItem from "../../components/item-page/SpecItem";
import VideoPlayer from "../../components/item-page/VideoPlayer";
import HeroImagesCarousel from "../../components/imgs/HeroImagesCarousel/HeroImagesCarousel";
import ScrollProgressCircle from "../../components/general/ScrollProgressCircle";
import LoadingSpinner from "../../components/general/LoadingSpinner";

interface Props {
    setIsFullscreen?: (value: boolean) => void;
    isFullscreen?: boolean;
}

const ItemMainPage: React.FC<Props> = ({ setIsFullscreen, isFullscreen = false }) => {
    const { t, i18n } = useTranslation();
    const { addToast } = useToast();
    const { refreshCart } = useCart();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [product, setProduct] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!id) return;
        const numericId = parseInt(id, 10);
        if (!isNaN(numericId)) {
            fetchItemById(numericId)
                .then((data) => {
                    setProduct(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Failed to fetch item', err);
                    setError(true);
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p className="text-lg">{t("catalog.no_product_data")}</p>
            </div>
        );
    }

    const getProductName = () => {
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

    const getDescription = () => {
        switch (i18n.language) {
            case "ukr":
                return `${product.description_p1_ua}\n\n${product.description_p2_ua}`;
            case "rus":
                return `${product.description_p1_rus}\n\n${product.description_p2_rus}`;
            case "eng":
            default:
                return `${product.description_p1_eng}\n\n${product.description_p2_eng}`;
        }
    };

    const getShortDescription = () => {
        switch (i18n.language) {
            case "ukr":
                return `${product.short_description_ua}`;
            case "rus":
                return `${product.short_description_rus}`;
            case "eng":
            default:
                return `${product.short_description_eng}`;
        }
    };

    const getFeatures = () => {
        const featureKeys = ["feature_1", "feature_2", "feature_3", "feature_4"];
        const prod = product as { [key: string]: any };

        return featureKeys.map((key) => ({
            header:
                i18n.language === "ukr"
                    ? prod[`${key}_header_ua`]
                    : i18n.language === "rus"
                        ? prod[`${key}_header_rus`]
                        : prod[`${key}_header_eng`],
            description:
                i18n.language === "ukr"
                    ? prod[`${key}_ua`]
                    : i18n.language === "rus"
                        ? prod[`${key}_rus`]
                        : prod[`${key}_eng`],
        }));
    };

    const handleAddToCart = async () => {
        try {
            await addCartItem(product);
            refreshCart();
            addToast(t("catalog.added_to_cart"), "success");
        } catch (error) {
            addToast(t("catalog.add_to_cart_error"), "error");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white overflow-hidden">
            <ScrollProgressCircle isFullscreen={isFullscreen} />

            <div
                className={`min-h-screen z-10 gap-8 p-6 md:p-8 lg:p-12 max-w-7xl mx-auto mt-10 ${isFullscreen ? 'block' : 'flex flex-col items-center justify-center lg:flex-row'
                    }`}
            >
                {product.gallery && (
                    <div className="aspect-[4/3] sm:aspect-[5/3] md:aspect-[16/9] z-[9999]">
                        <HeroImagesCarousel
                            images={product.gallery}
                            setIsFullscreen={setIsFullscreen}
                        />
                    </div>
                )}

                {/* Right Section */}
                <div className="flex flex-col gap-6 xl:min-h-[500px] max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl rounded-xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.3)] border border-gray-800/50"
                    >
                        <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-1">
                            {getProductName()}
                        </h1>
                        <p className="text-gray-400 text-sm mb-4">
                            {product.categories
                                .map((cat: any) =>
                                    i18n.language === "ukr"
                                        ? cat.name_ua
                                        : i18n.language === "rus"
                                            ? cat.name_rus
                                            : cat.name_eng
                                )
                                .join(", ")}
                        </p>
                        <PriceTag
                            size="lg"
                            current={parseFloat(product.price_uah)}
                            old={
                                product.old_price_uah
                                    ? parseFloat(product.old_price_uah)
                                    : undefined
                            }
                            currency="₴"
                        />
                        <p className="text-gray-300 text-base leading-relaxed mt-4 mb-6 whitespace-pre-line">
                            {getShortDescription()}
                        </p>
                        <div className="flex flex-col items-center gap-1 my-4">
                            <ReviewStars rating={parseFloat(product.rating)} readOnly={true} />
                            <p className="text-gray-400 text-sm">
                                {product.sold} {t("catalog.items_sold")}
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <motion.button
                                className="flex-1 cursor-pointer px-4 py-2 bg-green-600/80 hover:bg-green-500/80 rounded-lg text-white text-base font-light tracking-wide transition-all duration-200"
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAddToCart}
                            >
                                {t("catalog.add_to_cart")}
                            </motion.button>
                            <motion.button
                                className="flex-1 cursor-pointer px-4 py-2 bg-gray-600/80 hover:bg-gray-500/80 rounded-lg text-white text-base font-light tracking-wide transition-all duration-200"
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(-1)}
                            >
                                {t("catalog.back_to_catalog")}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Specifications */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative flex flex-col items-center z-10 w-screen bg-white backdrop-blur-xl rounded-xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.3)] border border-gray-800/50"
            >
                <h2 className="text-3xl text-gray-800 font-bold tracking-wide mb-12">
                    {t("specifications_and_features")}
                </h2>
                <div className="flex flex-col items-center max-w-3xl">
                    <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
                        {getDescription()}
                    </p>
                    <hr className="w-full max-w-3xl h-[3px] bg-black border-none rounded-full my-12" />
                    <div className="flex flex-col gap-2 w-full">
                        {product.characteristics.map((spec: any, index: number) => (
                            <SpecItem
                                key={index}
                                label={
                                    i18n.language === "ukr"
                                        ? spec.key_ua
                                        : i18n.language === "rus"
                                            ? spec.key_rus
                                            : spec.key_eng
                                }
                                value={
                                    i18n.language === "ukr"
                                        ? spec.value_ua
                                        : i18n.language === "rus"
                                            ? spec.value_rus
                                            : spec.value_eng
                                }
                            />
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Video Section */}
            {product.video && (
                <div className="relative w-full bg-black pt-12 z-10 flex flex-col items-center px-4 text-black">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ margin: '-10%' }}
                        className="text-3xl text-gray-400 sm:text-4xl font-bold text-center mb-12"
                    >
                        {t('video_demo')}
                    </motion.h2>
                    <div className="w-full max-w-3xl">
                        <VideoPlayer
                            src={product.video}
                            poster={product.video_poster || undefined}
                            loop={true}
                            muted={true}
                            autoplay={true}
                        />
                    </div>
                </div>
            )}

            {/* Features Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mx-auto pb-12 px-6 z-10 bg-gradient-to-b from-black to-gray-900"
            >
                <FeatureSection features={getFeatures()} theme="light" />
            </motion.div>
        </div>
    );
};

export default ItemMainPage;