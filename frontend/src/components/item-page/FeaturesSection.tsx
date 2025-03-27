import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

type Feature = {
    header: string;
    description: string;
};

type Props = {
    features: Feature[];
};

const FeatureSection: React.FC<Props> = ({ features }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const refs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const updateActiveIndex = () => {
            const centerY = window.innerHeight / 2;

            let closestIndex = null;
            let minDistance = Infinity;

            refs.current.forEach((ref, index) => {
                if (!ref) return;
                const rect = ref.getBoundingClientRect();
                const elementCenter = rect.top + rect.height / 2;
                const distance = Math.abs(centerY - elementCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = index;
                }
            });

            setActiveIndex(closestIndex);
        };

        window.addEventListener('scroll', updateActiveIndex, { passive: true });
        updateActiveIndex();

        return () => {
            window.removeEventListener('scroll', updateActiveIndex);
        };
    }, []);

    return (
        <div className="flex flex-col gap-8 w-full items-center py-8 md:gap-12 md:py-12">
            {features.map((feature, index) => {
                const ref = useRef<HTMLDivElement>(null);
                const isActive = index === activeIndex;

                return (
                    <motion.div
                        key={index}
                        ref={(el) => {
                            ref.current = el;
                            refs.current[index] = el;
                        }}
                        initial={{ opacity: 0.3, scale: 0.95, filter: 'blur(4px)' }}
                        animate={
                            isActive
                                ? { opacity: 1, scale: 1.05, filter: 'blur(0px)' }
                                : { opacity: 0.3, scale: 0.95, filter: 'blur(4px)' }
                        }
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className={clsx(
                            'flex flex-col w-full max-w-md mx-auto p-4 rounded-lg',
                            'md:max-w-4xl',
                            index % 2 === 0
                                ? 'items-start text-left'
                                : 'items-end text-right'
                        )}
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-2 md:text-2xl">
                            {feature.header}
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed md:text-base">
                            {feature.description}
                        </p>
                        <div
                            className={clsx(
                                'w-12 h-1 mt-3 bg-orange-400 rounded-full md:w-16 md:mt-4',
                                index % 2 === 0 ? 'mr-auto' : 'ml-auto'
                            )}
                        />
                    </motion.div>
                );
            })}
        </div>
    );
};

export default FeatureSection;