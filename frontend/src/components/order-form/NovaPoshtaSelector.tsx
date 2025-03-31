import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { fetchCities, fetchOblasts, fetchWarehouses } from '../../endpoints/novaposhta';
import { useTranslation, Trans } from "react-i18next";

type NovaPoshtaSelectorProps = {
    theme?: 'light' | 'dark';
    excludePoshtomats?: boolean;
    selectedOblast: any | null;
    setSelectedOblast: (value: any) => void;
    selectedCity: any | null;
    setSelectedCity: (value: any) => void;
    selectedWarehouse: any | null;
    setSelectedWarehouse: (value: any) => void;
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
    itemWeight
}) => {
    const [oblasts, setOblasts] = useState<any[]>([]);
    const [cityQuery, setCityQuery] = useState('');
    const [cities, setCities] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);

    const { t } = useTranslation();

    useEffect(() => {
        fetchOblasts().then(setOblasts);
    }, []);

    useEffect(() => {
        if (cityQuery.length >= 2) {
            const timeout = setTimeout(async () => {
                const results = await fetchCities(cityQuery);
                const filtered = selectedOblast
                    ? results.filter((c: any) => c.Area === selectedOblast.Ref)
                    : results;

                setCities(filtered);
            }, 300);
            return () => clearTimeout(timeout);
        } else {
            setCities([]);
        }
    }, [cityQuery, selectedOblast]);

    useEffect(() => {
        if (selectedCity?.Ref) {
            fetchWarehouses(selectedCity.Ref, excludePoshtomats).then((allWarehouses) => {
                const filtered = allWarehouses.filter((wh: any) => {
                    const limits = wh.ReceivingLimitationsOnDimensions || {};
                    const maxLength = limits.Length || Infinity;
                    const maxWidth = limits.Width || Infinity;
                    const maxHeight = limits.Height || Infinity;
                    const maxWeight = parseInt(wh.PlaceMaxWeightAllowed || "0", 10) || Infinity;

                    return (
                        (!itemLength || itemLength <= maxLength) &&
                        (!itemWidth || itemWidth <= maxWidth) &&
                        (!itemHeight || itemHeight <= maxHeight) &&
                        (!itemWeight || itemWeight <= maxWeight)
                    );
                });

                setWarehouses(filtered);
            });
        } else {
            setWarehouses([]);
        }
    }, [selectedCity, itemLength, itemWidth, itemHeight, itemWeight]);

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
        <div className="space-y-6">
            <div>
                <label className="block font-medium mb-1">{t('Oblast')} <span className="text-red-500">*</span></label>
                <select
                    className={clsx(
                        'w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500',
                        currentTheme.input
                    )}
                    value={selectedOblast?.Ref || ''}
                    onChange={(e: any) => {
                        const selected = oblasts.find((o) => o.Ref === e.target.value);
                        setSelectedOblast(selected || null);
                        setCityQuery('');
                        setSelectedCity(null);
                        setSelectedWarehouse(null);
                    }}
                >
                    <option value="">{t('select_oblast')}</option>
                    {oblasts.map((ob, idx) => (
                        <option key={idx} value={ob.Ref}>
                            {ob.Description}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block font-medium mb-1">{t('city')} <span className="text-red-500">*</span></label>
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
                {cities.length > 0 && !selectedCity && (
                    <ul className={clsx('border mt-2 rounded-lg max-h-48 overflow-y-auto', currentTheme.dropdown)}>
                        {cities.map((city, idx) => (
                            <li
                                key={idx}
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
                )}
            </div>

            {selectedCity && (
                <div>
                    <label className="block font-medium mb-1">{t('facility')} <span className="text-red-500">*</span></label>
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
                        {warehouses.map((wh, idx) => (
                            <option key={idx} value={wh.Ref}>
                                {wh.Description}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {selectedCity && selectedWarehouse && (
                <div className={clsx('text-sm', currentTheme.success)}>
                    <Trans i18nKey="confirmation_of_order" components={{ 1: <strong />, 3: <strong /> }} values={{ city: selectedCity.Description, facility: selectedWarehouse.Description }} />
                </div>
            )}
        </div>
    );
};

export default NovaPoshtaSelector;