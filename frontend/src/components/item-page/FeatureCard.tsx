import React from 'react';

type Props = {
    icon: string;
    title: string;
};

const FeatureCard: React.FC<Props> = ({ icon, title }) => {
    return (
        <div className="flex items-center gap-4 bg-gray-100 rounded-xl p-4 shadow-md hover:shadow-lg transition">
            <span className="text-3xl">{icon}</span>
            <span className="text-lg font-medium text-gray-800">{title}</span>
        </div>
    );
};

export default FeatureCard;