import React, { useState, ReactNode } from 'react';
import PriceTag from '../item-page/PriceTag';
import NovaPoshtaSelector from './NovaPoshtaSelector';
import clsx from 'clsx';
import UkrainianPhoneInput from './UkrainianPhoneInput';
import { useTranslation, Trans } from 'react-i18next';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { placeAnOrder, signOrder } from '../../endpoints/orders';
import { useToast } from '../../contexts/ToastContext';
import UkrPoshtaSelector from './UkrPoshtaSelector';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../general/LoadingSpinner';
import { useCart } from '../../contexts/CartContext';

type OrderItem = {
    item_id: number;
    name: string | ReactNode;
    alt?: string;
    image: string;
    currentPrice: number;
    oldPrice?: number;
    itemLength?: number; // in cm
    itemWidth?: number; // in cm
    itemHeight?: number; // in cm
    itemWeight?: number; // in kg
    quantity?: number;
};

type OrderFormProps = {
    items: OrderItem[];
    theme?: 'light' | 'dark';
    itemAnthropometryWarning?: boolean;
};

const OrderForm: React.FC<OrderFormProps> = ({
    items,
    theme = 'light',
    itemAnthropometryWarning = false,
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { addToast } = useToast();
    const { clearCart } = useCart();
    const isDark = theme === 'dark';
    const itemWithMaxDimensions = items.reduce((maxItem, currentItem) => {
        const maxSum = (maxItem.itemHeight || 0) + (maxItem.itemLength || 0) + (maxItem.itemWidth || 0) + (maxItem.itemWeight || 0);
        const currentSum = (currentItem.itemHeight || 0) + (currentItem.itemLength || 0) + (currentItem.itemWidth || 0) + (currentItem.itemWeight || 0);

        return currentSum > maxSum ? currentItem : maxItem;
    }, items[0]);

    // State for form inputs
    const [quantities, setQuantities] = useState<Record<number, number>>(() =>
        items.reduce(
            (acc, item) => ({
                ...acc,
                [item.item_id]: item.quantity ?? 1
            }),
            {}
        )
    );

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phone, setPhone] = useState<string | undefined>();
    const [submitted, setSubmitted] = useState(false);
    const [username, setUsername] = useState('');
    const [note, setNote] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [deliveryCompany, setDeliveryCompany] = useState<'nova_poshta' | 'ukr_poshta'>('nova_poshta');

    // Nova Poshta state
    const [selectedOblast, setSelectedOblast] = useState<any | null>(null);
    const [selectedCity, setSelectedCity] = useState<any | null>(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState<any | null>(null);

    // UkrPoshta state
    const [index, setSelectedIndex] = useState('');
    const [patronymic, setPatronymic] = useState('');

    // Calculate total
    const total = items.reduce(
        (sum, item) => sum + item.currentPrice * (quantities[item.item_id] || 1),
        0
    );

    const isUkrPoshta = deliveryCompany === 'ukr_poshta';
    const isNovaPoshta = deliveryCompany === 'nova_poshta';

    // Validation
    const isValid = {
        name: name.trim() !== '' && name.length < 255,
        surname: surname.trim() !== '' && surname.length < 255,
        phone: typeof phone === 'string' && phone.trim() !== '' && isValidPhoneNumber(phone, 'UA'),
        quantities: Object.values(quantities).every((q) => q > 0),
        ...(isUkrPoshta && {
            patronymic: patronymic.trim() !== '' && patronymic.length < 255,
            index: index.trim() !== '' && index.length < 15,
            city: selectedCity && typeof selectedCity === 'string' && selectedCity.trim() !== '',
        }),
        ...(isNovaPoshta && {
            oblast: selectedOblast !== null,
            city: selectedCity !== null,
            warehouse: selectedWarehouse !== null,
        }),
    };

    const allValid = Object.values(isValid).every(Boolean);

    const handleSubmit = async () => {
        if (username) {
            console.warn('Bot detected');
            return;
        }
        setSubmitted(true);
        if (!allValid) return;

        const timestamp = Math.floor(Date.now() / 1000);
        const orderItems = items.map((item) => ({
            item_id: item.item_id,
            quantity: quantities[item.item_id] || 1,
        }));

        try {
            setIsLoading(true);
            const { signature } = await signOrder({
                items: orderItems,
                timestamp,
            });

            const response = await placeAnOrder({
                items: orderItems,
                name,
                surname,
                patronymic: isUkrPoshta ? patronymic : undefined,
                zipcode: isUkrPoshta ? index : undefined,
                phone: phone as string,
                oblast: isNovaPoshta ? selectedOblast.Description : '',
                city: isNovaPoshta ? selectedCity.Description : selectedCity,
                warehouse: isNovaPoshta ? selectedWarehouse.Description : '',
                delivery_company_id: isNovaPoshta ? 1 : 2,
                username,
                timestamp,
                signature,
                customer_notes: note || undefined,
            });

            clearCart();

            navigate('/order-confirmation', {
                state: {
                    orderId: response.order_id,
                    orderTotal: response.order_total,
                    currency: response.currency,
                },
            });
        } catch (err: any) {
            addToast('❌ ' + (err.message || 'Something went wrong'), 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const errorBorder = 'border-red-500';

    return (
        <div
            className={clsx(
                'rounded-xl shadow p-4 space-y-4 max-w-xl mx-auto',
                isDark ? 'bg-[#111] text-white' : 'bg-white text-black'
            )}
        >
            <h2 className="text-xl font-semibold text-center mb-4">{t('checkout')}</h2>

            {/* Products */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('your_items')}</h3>
                <ul className="divide-y divide-gray-200">
                    {items.map((item) => (
                        <li
                            key={item.item_id}
                            className={clsx(
                                'flex items-center gap-4 py-4 transition-all duration-200',
                                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                            )}
                        >
                            {/* Item Image */}
                            <img
                                src={item.image}
                                alt={item.alt}
                                className="w-16 h-16 rounded-lg object-cover"
                            />

                            {/* Item Details */}
                            <div className="flex-1">
                                <h4 className="font-medium text-sm">{item.name}</h4>
                                <PriceTag
                                    current={item.currentPrice}
                                    old={item.oldPrice}
                                    currency="₴"
                                    size="sm"
                                />
                            </div>

                            {/* Quantity Input */}
                            <div className="w-24">
                                <input
                                    type="number"
                                    min={1}
                                    step={1}
                                    inputMode="numeric"
                                    value={quantities[item.item_id] === 0 ? '' : quantities[item.item_id]}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '') {
                                            setQuantities({ ...quantities, [item.item_id]: 0 });
                                            return;
                                        }
                                        const num = parseInt(val, 10);
                                        if (!isNaN(num)) {
                                            setQuantities({ ...quantities, [item.item_id]: num });
                                        }
                                    }}
                                    onBlur={() => {
                                        if (quantities[item.item_id] < 1) {
                                            setQuantities({ ...quantities, [item.item_id]: 1 });
                                        }
                                    }}
                                    className={clsx(
                                        'w-full border px-2 py-1 rounded text-sm',
                                        isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black',
                                        submitted && !isValid.quantities && errorBorder
                                    )}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Honeypot */}
            <input
                type="text"
                name="nickname"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                tabIndex={-1}
                className="absolute left-[-9999px] opacity-0 h-0 w-0"
            />

            {/* Name */}
            <div>
                <label className="block mb-1 font-medium">
                    {t('name')} <span className="text-red-500">*</span>
                </label>
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
                <label className="block mb-1 font-medium">
                    {t('surname')} <span className="text-red-500">*</span>
                </label>
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

            {/* Delivery Company Selection */}
            <div className="space-y-2">
                <label className="block mb-1 font-medium">
                    {t('delivery_company')} <span className="text-red-500">*</span>
                </label>
                <div className="gap-4 flex justify-center">
                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="novaPoshta"
                            name="delivery"
                            value="nova_poshta"
                            checked={deliveryCompany === 'nova_poshta'}
                            onChange={() => {
                                setDeliveryCompany('nova_poshta');
                                setPatronymic('');
                                setSelectedIndex('');
                                setSelectedOblast(null);
                                setSelectedCity(null);
                                setSelectedWarehouse(null);
                            }}
                            className={clsx(
                                'h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300',
                                isDark && 'bg-gray-800'
                            )}
                        />
                        <label
                            htmlFor="novaPoshta"
                            className={clsx(
                                'ml-2 text-sm font-medium',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}
                        >
                            {t('nova_poshta')}
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="ukrPoshta"
                            name="delivery"
                            value="ukr_poshta"
                            checked={deliveryCompany === 'ukr_poshta'}
                            onChange={() => {
                                setDeliveryCompany('ukr_poshta');
                                setPatronymic('');
                                setSelectedIndex('');
                                setSelectedOblast(null);
                                setSelectedCity(null);
                                setSelectedWarehouse(null);
                            }}
                            className={clsx(
                                'h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300',
                                isDark && 'bg-gray-800'
                            )}
                        />
                        <label
                            htmlFor="ukrPoshta"
                            className={clsx(
                                'ml-2 text-sm font-medium',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}
                        >
                            {t('ukr_poshta')}
                        </label>
                    </div>
                </div>
            </div>

            {/* UkrPoshta */}
            {isUkrPoshta && (
                <UkrPoshtaSelector
                    patronymic={patronymic}
                    setPatronymic={setPatronymic}
                    city={selectedCity}
                    setCity={setSelectedCity}
                    index={index}
                    setIndex={setSelectedIndex}
                    theme={theme}
                />
            )}

            {/* Anthropometry Warning */}
            {itemAnthropometryWarning && isNovaPoshta && (
                <div className="w-full p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md shadow-sm mb-4 text-sm">
                    <p>{t('too_big_or_heavy_item_warning')}</p>
                </div>
            )}

            {/* Nova Poshta */}
            {isNovaPoshta && (
                <NovaPoshtaSelector
                    excludePoshtomats={true}
                    excludePunkts={true}
                    theme={theme}
                    selectedOblast={selectedOblast}
                    setSelectedOblast={setSelectedOblast}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                    selectedWarehouse={selectedWarehouse}
                    setSelectedWarehouse={setSelectedWarehouse}
                    itemLength={itemWithMaxDimensions?.itemLength}
                    itemHeight={itemWithMaxDimensions?.itemHeight}
                    itemWidth={itemWithMaxDimensions?.itemWidth}
                    itemWeight={itemWithMaxDimensions?.itemWeight}
                />
            )}

            {/* Validation Errors */}
            {submitted && isUkrPoshta && !isValid.patronymic && (
                <p className="text-sm text-red-500 mt-1">{t('enter_patronymic')}</p>
            )}
            {submitted && isUkrPoshta && !isValid.city && (
                <p className="text-sm text-red-500 mt-1">{t('enter_zip_code')}</p>
            )}
            {submitted && isNovaPoshta && !isValid.oblast && (
                <p className="text-sm text-red-500 mt-1">{t('select_oblast')}</p>
            )}
            {submitted && !isValid.city && (
                <p className="text-sm text-red-500 mt-1">{t('enter_city_name')}</p>
            )}
            {submitted && isNovaPoshta && !isValid.warehouse && (
                <p className="text-sm text-red-500 mt-1">{t('select_facility')}</p>
            )}

            {/* Order Notes */}
            <div>
                <label className="block font-medium mb-1">
                    {t('order_notes')} <span className="text-gray-400 text-sm">({t('optional')})</span>
                </label>
                <textarea
                    rows={3}
                    placeholder={t('enter_optional_note')}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className={clsx(
                        'w-full border rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500',
                        isDark
                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-black placeholder-gray-500'
                    )}
                />
            </div>

            {/* Delivery Note */}
            <p className={clsx('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                <Trans i18nKey="deliveryNovaPoshtaInfo" components={{ 1: <strong /> }} />
            </p>

            {/* Total */}
            <div className="text-center">
                <div className={clsx('text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>
                    {t('amount_due')}:
                </div>
                <PriceTag current={total} currency="₴" size="md" />
            </div>

            <LoadingSpinner isLoading={isLoading} />

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={!allValid || isLoading}
                className={clsx(
                    'w-full rounded py-1 font-medium transition',
                    allValid && !isLoading
                        ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                        : 'bg-gray-400 text-white cursor-not-allowed'
                )}
            >
                {t('confirm_order')}
            </button>
        </div>
    );
};

export default OrderForm;