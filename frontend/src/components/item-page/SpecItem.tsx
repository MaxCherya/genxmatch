import React from 'react';

type Props = {
    label: string;
    value: string;
};

const SpecItem: React.FC<Props> = ({ label, value }) => {
    return (
        <div className="flex justify-between text-gray-800 text-sm sm:text-base border-b pb-2">
            <span className="font-medium">{label}</span>
            <span>{value}</span>
        </div>
    );
};

export default SpecItem;