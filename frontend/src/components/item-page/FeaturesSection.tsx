import React from 'react';
import clsx from 'clsx';

type Feature = {
    header: string;
    description: string;
};

type Props = {
    features: Feature[];
};

const FeatureSection: React.FC<Props> = ({ features }) => {
    return (
        <div className="flex flex-col gap-8 w-full items-center py-8 md:gap-12 md:py-12">
            {features.map((feature, index) => (
                <div
                    key={index}
                    className={clsx(
                        'flex flex-col w-full max-w-md mx-auto p-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
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
                            'w-12 h-1 mt-3 bg-blue-500 rounded-full md:w-16 md:mt-4',
                            index % 2 === 0 ? 'mr-auto' : 'ml-auto' // Bar follows alignment
                        )}
                    />
                </div>
            ))}
        </div>
    );
};

export default FeatureSection;