import React from "react";
import clsx from "clsx";
import { useTranslation, Trans } from "react-i18next";

type Props = {
    theme?: 'dark' | 'light';
    numberOfOrder: number | string;
};

const OrderSuccess: React.FC<Props> = ({
    theme = 'light',
    numberOfOrder
}) => {
    const { t } = useTranslation();
    const isDark = theme === 'dark';

    return (
        <div
            className={clsx(
                "relative max-w-md mx-auto text-center p-10 rounded-3xl shadow-2xl overflow-hidden",
                "transform transition-all duration-500 hover:scale-105",
                isDark ? "bg-gradient-to-br from-[#1a1a1a] to-[#111] text-white" : "bg-gradient-to-br from-white to-gray-100 text-black"
            )}
        >
            {/* Background decorative element */}
            <div className={clsx(
                "absolute inset-0 opacity-10 pointer-events-none",
                isDark ? "bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')]" : "bg-[url('https://www.transparenttextures.com/patterns/light-wool.png')]"
            )} />

            {/* Animated Checkmark */}
            <div className="relative flex justify-center mb-6">
                <div className="text-5xl animate-bounce-short">✅</div>
                <div className={clsx(
                    "absolute w-24 h-24 rounded-full blur-xl animate-pulse",
                    isDark ? "bg-green-900/30" : "bg-green-300/30"
                )} />
            </div>

            {/* Title */}
            <h1 className={clsx(
                "text-3xl font-extrabold mb-3 bg-clip-text",
                isDark ? "text-transparent bg-gradient-to-r from-green-400 to-teal-500" : "text-transparent bg-gradient-to-r from-green-600 to-teal-700"
            )}>
                {t('order_confirmed_title', 'Your Order is Confirmed!')}
            </h1>

            {/* Order Confirmation Text */}
            <p className="text-lg mb-6 font-medium leading-relaxed">
                <Trans
                    i18nKey="order_success_text"
                    defaults="Thank you for your order! Your order number is <strong>#{{order}}</strong>."
                    values={{ order: numberOfOrder }}
                    components={{ strong: <strong className="text-green-500 font-bold tracking-wide" /> }}
                />
            </p>

            {/* Note */}
            <p className={clsx(
                "text-sm italic px-4 py-2 rounded-lg",
                isDark ? "text-gray-300 bg-gray-800/50" : "text-gray-600 bg-gray-200/50"
            )}>
                {t(
                    'order_success_note',
                    "We might contact you if there are any questions about delivery. Otherwise, expect a message from the delivery service with tracking details."
                )}
            </p>

            {/* Decorative Border */}
            <div className={clsx(
                "absolute inset-0 rounded-3xl border-2 border-dashed pointer-events-none",
                isDark ? "border-green-500/20" : "border-green-600/20"
            )} />
        </div>
    );
};

export default OrderSuccess;