declare global {
    interface Window {
        fbq: (...args: any[]) => void;
    }
}

import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import OrderSuccess from "../../../components/OrderConfirmation/OrderSuccess";
import { useTranslation } from "react-i18next";

const OrderConfirmation: React.FC = () => {
    const location = useLocation();
    const orderId = location.state?.orderId;
    const { t } = useTranslation();

    // 📦 Assume we get order total and currency from location or elsewhere
    const orderTotal = location.state?.orderTotal || 199.99;
    const currency = location.state?.currency || 'UAH';

    useEffect(() => {
        if (orderId && typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'Purchase', {
                value: orderTotal,
                currency: currency,
            });
        }
    }, [orderId, orderTotal, currency]);

    return (
        <div className="w-screen p-5 bg-black h-screen flex flex-col items-center justify-center">
            {orderId ? (
                <OrderSuccess theme="dark" numberOfOrder={orderId} />
            ) : (
                <div className="relative max-w-md mx-auto text-center p-10 rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#111] text-white transform transition-all duration-500 hover:scale-105">
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')]" />
                    <div className="relative flex justify-center mb-6">
                        <div className="text-5xl animate-pulse">🔔</div>
                        <div className="absolute w-24 h-24 rounded-full blur-xl animate-pulse bg-yellow-900/30" />
                    </div>
                    <h1 className="text-3xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                        {t('oops_no_order_details')}
                    </h1>
                    <p className="text-lg mb-6 font-medium leading-relaxed text-gray-300">
                        {t('we_couldnt_retrieve_your_orders_details')}
                    </p>
                    <div className="absolute inset-0 rounded-3xl border-2 border-dashed border-yellow-500/20 pointer-events-none" />
                </div>
            )}
        </div>
    );
};

export default OrderConfirmation;