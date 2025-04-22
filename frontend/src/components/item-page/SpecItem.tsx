import React from 'react';

type Props = {
    label: string;
    value: string;
    theme?: 'light' | 'dark';
};

const SpecItem: React.FC<Props> = ({ label, value, theme = 'light' }) => {
    const textColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-800';
    const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';

    return (
        <div className={`flex justify-between text-sm sm:text-base pb-2 border-b ${textColor} ${borderColor}`}>
            <span className="font-medium">{label}</span>
            <span>{value}</span>
        </div>
    );
};

export default SpecItem;