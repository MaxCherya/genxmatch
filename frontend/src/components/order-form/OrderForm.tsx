import React, { useState, ReactNode } from 'react'
import PriceTag from '../item-page/PriceTag'
import NovaPoshtaSelector from './NovaPoshtaSelector'
import clsx from 'clsx'
import UkrainianPhoneInput from './UkrainianPhoneInput'
import { useTranslation, Trans } from 'react-i18next'

type OrderFormProps = {
    productName: string | ReactNode
    productAlt?: string
    productImage: string
    currentPrice: number
    oldPrice?: number
    theme?: 'light' | 'dark'
}

const OrderForm: React.FC<OrderFormProps> = ({
    productName,
    productAlt,
    productImage,
    currentPrice,
    oldPrice,
    theme = 'light'
}) => {
    const [quantity, setQuantity] = useState(1)
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [phone, setPhone] = useState<string | undefined>();

    const total = currentPrice * quantity

    const { t } = useTranslation();

    const isDark = theme === 'dark'
    console.log(phone)

    return (
        <div
            className={clsx(
                'rounded-xl shadow p-6 space-y-6 max-w-xl mx-auto',
                isDark ? 'bg-[#111] text-white' : 'bg-white text-black'
            )}
        >
            <h2 className="text-2xl font-semibold text-center mb-4">{t('checkout')}</h2>

            {/* Product Summary */}
            <div className="flex flex-col items-center gap-4">
                <img src={productImage} alt={productAlt} className="w-[30%] rounded-lg object-cover" />
                <div>
                    <h3 className="font-medium text-lg mb-4">{productName}</h3>
                    <PriceTag current={currentPrice} old={oldPrice} currency="₴" size="md" />
                </div>
            </div>

            {/* Quantity */}
            <div>
                <label className="block mb-1 font-medium">{t('quantity')}</label>
                <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className={clsx(
                        'w-full border px-3 py-2 rounded',
                        isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'
                    )}
                />
            </div>

            {/* Name */}
            <div>
                <label className="block mb-1 font-medium">{t('name')}</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={clsx(
                        'w-full border px-3 py-2 rounded',
                        isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'
                    )}
                    placeholder={t('your_name')}
                />
            </div>

            {/* Surname */}
            <div>
                <label className="block mb-1 font-medium">{t('surname')}</label>
                <input
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className={clsx(
                        'w-full border px-3 py-2 rounded',
                        isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'
                    )}
                    placeholder={t('your_surname')}
                />
            </div>

            {/* Phone */}
            <UkrainianPhoneInput value={phone} onChange={setPhone} theme="dark" />

            {/* Nova Poshta Fields */}
            <NovaPoshtaSelector theme={theme} />

            {/* Delivery note */}
            <p className={clsx('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                <Trans i18nKey="deliveryNovaPoshtaInfo" components={{ 1: <strong /> }} />
            </p>

            {/* Total Price */}
            <div className="text-center">
                <div className={clsx('text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>{t('amount_due')}:</div>
                <PriceTag current={total} currency="₴" size="md" />
            </div>

            {/* Submit button (not wired yet) */}
            <button
                className="w-full bg-green-600 text-white rounded py-2 font-medium hover:bg-green-700 transition"
            >
                {t('confirm_order')}
            </button>
        </div>
    )
}

export default OrderForm