import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { fetchCities, fetchOblasts, fetchWarehouses } from '../../endpoints/novaposhta';
import { useTranslation, Trans } from 'react-i18next';
import LoadingIndicator from '../general/LoadingIndicator';

// Define the shape of Nova Poshta API responses
interface NovaPoshtaItem {
    Ref: string;
    Description: string;
    Area?: string;
    ReceivingLimitationsOnDimensions?: { Length?: number; Width?: number; Height?: number };
    PlaceMaxWeightAllowed?: string;
}

type NovaPoshtaSelectorProps = {
    theme?: 'light' | 'dark';
    excludePoshtomats?: boolean;
    selectedOblast: NovaPoshtaItem | null;
    setSelectedOblast: (value: NovaPoshtaItem | null) => void;
    selectedCity: NovaPoshtaItem | null;
    setSelectedCity: (value: NovaPoshtaItem | null) => void;
    selectedWarehouse: NovaPoshtaItem | null;
    setSelectedWarehouse: (value: NovaPoshtaItem | null) => void;
    itemLength?: number; // in cm
    itemWidth?: number; // in cm
    itemHeight?: number; // in cm
    itemWeight?: number; // in kg
};

const NovaPoshtaSelector: React.FC<NovaPoshtaSelectorProps> = ({
    theme = 'light',
    excludePoshtomats = false,
    selectedOblast,
    setSelectedOblast,
    selectedCity,
    setSelectedCity,
    selectedWarehouse,
    setSelectedWarehouse,
    itemLength,
    itemWidth,
    itemHeight,
    itemWeight,
}) => {
    const [oblasts, setOblasts] = useState<NovaPoshtaItem[]>([]);
    const [cityQuery, setCityQuery] = useState<string>('');
    const [cities, setCities] = useState<NovaPoshtaItem[]>([]);
    const [warehouses, setWarehouses] = useState<NovaPoshtaItem[]>([]);
    const [isLoadingOblasts, setIsLoadingOblasts] = useState<boolean>(false);
    const [isLoadingCities, setIsLoadingCities] = useState<boolean>(false);
    const [isLoadingWarehouses, setIsLoadingWarehouses] = useState<boolean>(false);

    const { t } = useTranslation();

    useEffect(() => {
        setIsLoadingOblasts(true);
        fetchOblasts()
            .then((data) => setOblasts(data))
            .finally(() => setIsLoadingOblasts(false));
    }, []);

    useEffect(() => {
        if (cityQuery.length >= 2) {
            const timeout = setTimeout(async () => {
                setIsLoadingCities(true);
                const results = await fetchCities(cityQuery);
                const filtered = selectedOblast
                    ? results.filter((c: NovaPoshtaItem) => c.Area === selectedOblast.Ref)
                    : results;
                setCities(filtered);
                setIsLoadingCities(false);
            }, 300);
            return () => clearTimeout(timeout);
        } else {
            setCities([]);
            setIsLoadingCities(false); // Reset loading state when query is too short
        }
    }, [cityQuery, selectedOblast]);

    useEffect(() => {
        if (selectedCity?.Ref) {
            setIsLoadingWarehouses(true);
            fetchWarehouses(selectedCity.Ref, excludePoshtomats)
                .then((allWarehouses) => {
                    const filtered = allWarehouses.filter((wh: NovaPoshtaItem) => {
                        const limits = wh.ReceivingLimitationsOnDimensions || {};
                        const maxLength = limits.Length || Infinity;
                        const maxWidth = limits.Width || Infinity;
                        const maxHeight = limits.Height || Infinity;
                        const maxWeight = parseInt(wh.PlaceMaxWeightAllowed || '0', 10) || Infinity;

                        return (
                            (!itemLength || itemLength <= maxLength) &&
                            (!itemWidth || itemWidth <= maxWidth) &&
                            (!itemHeight || itemHeight <= maxHeight) &&
                            (!itemWeight || itemWeight <= maxWeight)
                        );
                    });
                    setWarehouses(filtered);
                })
                .finally(() => setIsLoadingWarehouses(false)); // Ensure loading resets
        } else {
            setWarehouses([]);
            setIsLoadingWarehouses(false);
        }
    }, [selectedCity, itemLength, itemWidth, itemHeight, itemWeight, excludePoshtomats]);

    const themeStyles = {
        light: {
            input: 'bg-gray-100 border-gray-300 text-black placeholder-gray-500',
            dropdown: 'bg-white border-gray-300 text-black',
            hover: 'hover:bg-gray-100',
            success: 'text-green-600',
        },
        dark: {
            input: 'bg-gray-800 border-gray-700 text-white placeholder-gray-400',
            dropdown: 'bg-gray-800 border-gray-700 text-white',
            hover: 'hover:bg-gray-700',
            success: 'text-green-300',
        },
    };

    const currentTheme = themeStyles[theme];

    return (
        <div className="space-y-6 bg-neutral-900 p-4">
            {/* Oblast Selector */}
            <div>
                <label className="block font-medium mb-1 text-white">
                    {t('Oblast')} <span className="text-red-500">*</span>
                </label>
                {isLoadingOblasts ? (
                    <LoadingIndicator theme={theme} />
                ) : (
                    <select
                        className={clsx(
                            'w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500',
                            currentTheme.input
                        )}
                        value={selectedOblast?.Ref || ''}
                        onChange={(e) => {
                            const selected = oblasts.find((o) => o.Ref === e.target.value);
                            setSelectedOblast(selected || null);
                            setCityQuery('');
                            setSelectedCity(null);
                            setSelectedWarehouse(null);
                        }}
                    >
                        <option value="">{t('select_oblast')}</option>
                        {oblasts.map((ob) => (
                            <option key={ob.Ref} value={ob.Ref}>
                                {ob.Description}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* City Selector */}
            {selectedOblast && (
                <div>
                    <label className="block font-medium mb-1 text-white">
                        {t('city')} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className={clsx(
                            'w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500',
                            currentTheme.input
                        )}
                        placeholder={t('enter_city_name')}
                        value={cityQuery}
                        onChange={(e) => {
                            setCityQuery(e.target.value);
                            setSelectedCity(null);
                            setWarehouses([]);
                            setSelectedWarehouse(null);
                        }}
                    />
                    {isLoadingCities ? (
                        <LoadingIndicator theme={theme} />
                    ) : (
                        cities.length > 0 && !selectedCity && (
                            <ul className={clsx('border mt-2 rounded-lg max-h-48 overflow-y-auto', currentTheme.dropdown)}>
                                {cities.map((city) => (
                                    <li
                                        key={city.Ref}
                                        className={clsx('px-4 py-2 cursor-pointer', currentTheme.hover)}
                                        onClick={() => {
                                            setSelectedCity(city);
                                            setCityQuery(city.Description);
                                            setCities([]);
                                        }}
                                    >
                                        {city.Description}
                                    </li>
                                ))}
                            </ul>
                        )
                    )}
                </div>
            )}

            {/* Warehouse Selector */}
            {selectedCity && (
                <div>
                    <label className="block font-medium mb-1 text-white">
                        {t('facility')} <span className="text-red-500">*</span>
                    </label>
                    {isLoadingWarehouses ? (
                        <LoadingIndicator theme={theme} />
                    ) : (
                        <select
                            className={clsx(
                                'w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500',
                                currentTheme.input
                            )}
                            value={selectedWarehouse?.Ref || ''}
                            onChange={(e) => {
                                const selected = warehouses.find((w) => w.Ref === e.target.value);
                                setSelectedWarehouse(selected || null);
                            }}
                        >
                            <option value="">{t('select_facility')}</option>
                            {warehouses.map((wh) => (
                                <option key={wh.Ref} value={wh.Ref}>
                                    {wh.Description}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            )}

            {/* Confirmation Message */}
            {selectedCity && selectedWarehouse && (
                <div className={clsx('text-sm', currentTheme.success)}>
                    <Trans
                        i18nKey="confirmation_of_order"
                        components={{ 1: <strong />, 3: <strong /> }}
                        values={{ city: selectedCity.Description, facility: selectedWarehouse.Description }}
                    />
                </div>
            )}
        </div>
    );
};

export default NovaPoshtaSelector;