import React, { useState, ReactNode } from 'react'
import PriceTag from '../item-page/PriceTag'
import NovaPoshtaSelector from './NovaPoshtaSelector'
import clsx from 'clsx'
import UkrainianPhoneInput from './UkrainianPhoneInput'
import { useTranslation, Trans } from 'react-i18next'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { placeAnOrder } from '../../endpoints/orders'
import { useToast } from '../../contexts/ToastContext'

type OrderFormProps = {
    productId: number
    productName: string | ReactNode
    productAlt?: string
    productImage: string
    currentPrice: number
    oldPrice?: number
    theme?: 'light' | 'dark'
    itemAntopometryWarning?: boolean
    itemLength?: number // in cm
    itemWidth?: number // in cm
    itemHeight?: number // in cm
    itemWeight?: number // in kg
}

const OrderForm: React.FC<OrderFormProps> = ({
    productId,
    productName,
    productAlt,
    productImage,
    currentPrice,
    oldPrice,
    theme = 'light',
    itemAntopometryWarning = false,
    itemLength,
    itemWidth,
    itemHeight,
    itemWeight
}) => {
    const [quantity, setQuantity] = useState(1)
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [phone, setPhone] = useState<string | undefined>()
    const [submitted, setSubmitted] = useState(false)
    const [username, setUsername] = useState('')

    // Nova Poshta
    const [selectedOblast, setSelectedOblast] = useState<any | null>(null)
    const [selectedCity, setSelectedCity] = useState<any | null>(null)
    const [selectedWarehouse, setSelectedWarehouse] = useState<any | null>(null)

    const total = currentPrice * quantity
    const { t } = useTranslation()
    const isDark = theme === 'dark'

    const { addToast } = useToast();

    const isValid = {
        name: name.trim() !== '' && name.length < 255,
        surname: surname.trim() !== '' && surname.length < 255,
        phone: typeof phone === 'string' && phone.trim() !== '' && isValidPhoneNumber(phone, 'UA'),
        quantity: quantity > 0,
        oblast: selectedOblast !== null,
        city: selectedCity !== null,
        warehouse: selectedWarehouse !== null,
    };

    const handleSubmit = async () => {
        if (username) {
            console.warn("Bot detected")
            return
        }
        setSubmitted(true)
        const allValid = Object.values(isValid).every(Boolean)
        if (!allValid) return

        try {
            await placeAnOrder({
                item_id: productId,
                quantity,
                name,
                surname,
                phone: phone as string,
                oblast: selectedOblast.Description,
                city: selectedCity.Description,
                warehouse: selectedWarehouse.Description,
                delivery_company_id: 1,
                username
            });
            addToast("✅ Order placed successfully!", 'success');
        } catch (err: any) {
            addToast("❌ " + (err.message || "Something went wrong"), 'error');
        }
    }

    const errorBorder = 'border-red-500'

    return (
        <div className={clsx(
            'rounded-xl shadow p-4 space-y-4 max-w-xl mx-auto',
            isDark ? 'bg-[#111] text-white' : 'bg-white text-black'
        )}>
            <h2 className="text-xl font-semibold text-center mb-4">{t('checkout')}</h2>

            {/* Product */}
            <div className="flex flex-col items-center gap-4">
                <img src={productImage} alt={productAlt} className="w-[30%] rounded-lg object-cover" />
                <div>
                    <h3 className="font-medium text-base mb-4">{productName}</h3>
                    <PriceTag current={currentPrice} old={oldPrice} currency="₴" size="sm" />
                </div>
            </div>

            <input
                type="text"
                name="nickname"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                tabIndex={-1}
                className="absolute left-[-9999px] opacity-0 h-0 w-0"
            />

            {/* Quantity */}
            <input
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                value={quantity === 0 ? '' : quantity}
                onChange={(e) => {
                    const val = e.target.value;

                    if (val === '') {
                        setQuantity(0);
                        return;
                    }

                    const num = parseInt(val, 10);

                    if (!isNaN(num)) {
                        setQuantity(num);
                    }
                }}
                onBlur={() => {
                    if (quantity < 1) setQuantity(1);
                }}
                className={clsx(
                    'w-full border px-3 rounded',
                    isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black',
                    submitted && !isValid.quantity && errorBorder
                )}
            />

            {/* Name */}
            <div>
                <label className="block mb-1 font-medium">{t('name')} <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={clsx(
                        'w-full border px-3 rounded',
                        isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black',
                        submitted && !isValid.name && errorBorder
                    )}
                    placeholder={t('your_name')}
                />
            </div>

            {/* Surname */}
            <div>
                <label className="block mb-1 font-medium">{t('surname')} <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className={clsx(
                        'w-full border px-3 rounded',
                        isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black',
                        submitted && !isValid.surname && errorBorder
                    )}
                    placeholder={t('your_surname')}
                />
            </div>

            {/* Phone */}
            <UkrainianPhoneInput value={phone} onChange={setPhone} theme={theme} showError={submitted} />

            {itemAntopometryWarning ?
                <div className="w-full p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md shadow-sm mb-4 text-sm">
                    <p>
                        {t('too_big_or_heavy_item_warning')}
                    </p>
                </div>
                : null}

            {/* Nova Poshta */}
            <NovaPoshtaSelector
                excludePoshtomats={true}
                theme={theme}
                selectedOblast={selectedOblast}
                setSelectedOblast={setSelectedOblast}
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                selectedWarehouse={selectedWarehouse}
                setSelectedWarehouse={setSelectedWarehouse}
                itemLength={itemLength}
                itemHeight={itemHeight}
                itemWidth={itemWidth}
                itemWeight={itemWeight}
            />

            {submitted && !isValid.city && <p className="text-sm text-red-500 mt-1">{t('enter_city_name')}</p>}
            {submitted && !isValid.warehouse && <p className="text-sm text-red-500 mt-1">{t('select_facility')}</p>}

            {/* Delivery note */}
            <p className={clsx('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                <Trans i18nKey="deliveryNovaPoshtaInfo" components={{ 1: <strong /> }} />
            </p>

            {/* Total */}
            <div className="text-center">
                <div className={clsx('text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>{t('amount_due')}:</div>
                <PriceTag current={total} currency="₴" size="md" />
            </div>

            {/* Submit */}
            <button
                onClick={handleSubmit}
                className="w-full bg-green-600 text-white rounded py-1 font-medium hover:bg-green-700 transition"
            >
                {t('confirm_order')}
            </button>
        </div>
    )
}

export default OrderForm