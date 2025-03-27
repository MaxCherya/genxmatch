import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const DeliveryInfo: React.FC = () => {
    const { t } = useTranslation();

    const steps = [
        {
            img: 'https://media-public.canva.com/knbH4/MAFzn5knbH4/1/t.png',
            text: t('you_order'),
        },
        {
            img: 'https://media-public.canva.com/ZgPTM/MAFDGMZgPTM/1/t.png',
            text: t('nova_poshta_delivers'),
        },
        {
            img: 'https://media-public.canva.com/x8rfU/MAGZFIx8rfU/1/t.png',
            text: t('you_receive_and_pay'),
        },
    ];

    return (
        <div className="w-full h-full rounded-2xl flex flex-col items-center justify-center p-6 md:p-8">
            {/* Title */}
            <motion.h1
                className="font-bold text-2xl md:text-3xl mb-10 text-white relative text-center"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                viewport={{}}
            >
                {t('delivery_information')}
                <motion.span
                    className="absolute left-1/2 transform -translate-x-1/2 bottom-[-15px] w-16 h-1 bg-blue-500 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
                    viewport={{}}
                    style={{ transformOrigin: 'center' }}
                />
            </motion.h1>

            {/* Steps */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full max-w-6xl mx-auto justify-evenly">
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-800 to-black bg-opacity-50 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.6,
                            ease: 'easeOut',
                            delay: index * 0.2,
                        }}
                        viewport={{ margin: '-20%' }}
                    >
                        <img
                            src={step.img}
                            alt={step.text}
                            className="h-20 md:h-[105px] mb-4 object-contain rounded-md"
                        />
                        <p className="text-gray-200 text-sm md:text-base text-center font-medium">
                            {step.text}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Footer Note */}
            <motion.p
                className="mt-8 text-xs md:text-sm text-gray-300 text-center max-w-2xl"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{}}
            >
                {t('terms_of_delivery')}
            </motion.p>
        </div>
    );
};

export default DeliveryInfo;