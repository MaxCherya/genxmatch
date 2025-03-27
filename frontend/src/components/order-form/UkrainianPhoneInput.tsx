import React, { useState } from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

interface Props {
    value: string | undefined;
    onChange: (value: string | undefined) => void;
    theme?: 'light' | 'dark';
    showError?: boolean;
}

const UkrainianPhoneInput: React.FC<Props> = ({
    value,
    onChange,
    theme = 'light',
    showError = true,
}) => {
    const [_touched, setTouched] = useState(false);
    const { t } = useTranslation();

    const isInvalid =
        showError && (!value || !value.startsWith('+380') || !isValidPhoneNumber(value, 'UA'));

    return (
        <div className="w-full">
            <label
                className={clsx(
                    'block mb-1 font-medium text-sm',
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                )}
            >
                {t('phone_number')} <span className="text-red-500">*</span>
            </label>

            <PhoneInput
                international
                countrySelectProps={{ disabled: true }}
                defaultCountry="UA"
                countries={['UA']}
                value={value}
                onChange={onChange}
                onBlur={() => setTouched(true)}
                className={clsx(
                    'w-full border px-4 py-2 rounded',
                    theme === 'dark'
                        ? 'bg-gray-800 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-black',
                    isInvalid && 'border-red-500'
                )}
            />

            {isInvalid && (
                <p className="mt-1 text-sm text-red-500">{t('enter_correct_ukrainian_phone_number')}</p>
            )}
        </div>
    );
};

export default UkrainianPhoneInput;