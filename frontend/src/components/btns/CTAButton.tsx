import React from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

type Props = {
    label?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
};

const CTAButton: React.FC<Props> = ({
    label,
    onClick,
    icon,
    size = 'md',
    fullWidth = false,
}) => {
    const { t } = useTranslation();
    const sizeClasses = {
        sm: 'text-sm px-4 py-2',
        md: 'text-base px-6 py-3',
        lg: 'text-lg px-8 py-4',
    };

    return (
        <button
            onClick={onClick}
            className={clsx(
                'bg-orange-600 cursor-pointer text-white font-semibold rounded-2xl shadow hover:bg-orange-500 transition-all flex items-center justify-center gap-2',
                sizeClasses[size],
                fullWidth && 'w-full'
            )}
        >
            {icon && <span className="text-xl">{icon}</span>}
            {label ?? t('CTAButton')}
        </button>
    );
};

export default CTAButton;