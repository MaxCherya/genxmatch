import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from "react-i18next";

type Props = {
    validCoupons?: string[]; // Fake accepted codes (e.g. ["SALE10"])
    onApply?: (code: string) => void;
};

const CouponInput: React.FC<Props> = ({
    validCoupons = [],
    onApply,
}) => {
    const [code, setCode] = useState('');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const { t } = useTranslation();

    const handleApply = () => {
        if (!code) return;

        const isValid = validCoupons.includes(code.trim().toUpperCase());

        if (isValid) {
            setStatus('success');
            onApply?.(code.trim());
        } else {
            setStatus('error');
        }
    };

    return (
        <div className="w-full max-w-md space-y-2">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                        setCode(e.target.value);
                        setStatus('idle');
                    }}
                    placeholder={t('enter_promo')}
                    className="flex-grow px-4 py-2 text-sm outline-none"
                />
                <button
                    onClick={handleApply}
                    className="bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition"
                >
                    {t('apply')}
                </button>
            </div>

            {status === 'success' && (
                <div className="flex items-center text-green-600 text-sm gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {t('coupon_applied_success')}
                </div>
            )}

            {status === 'error' && (
                <div className="flex items-center text-red-500 text-sm gap-2">
                    <XCircle className="w-4 h-4" />
                    {t('coupon_applied_no_success')}
                </div>
            )}
        </div>
    );
};

export default CouponInput;