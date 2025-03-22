import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Props = {
    quantity: number;
    threshold?: number;
};

const LowStockWarning: React.FC<Props> = ({ quantity, threshold = 5 }) => {
    if (quantity >= threshold) return null;
    const { t } = useTranslation();

    return (
        <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 text-sm px-3 py-2 rounded-md mt-2 animate-pulse">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span>{t('low_stock_warning', { count: quantity })}</span>
        </div>
    );
};

export default LowStockWarning;