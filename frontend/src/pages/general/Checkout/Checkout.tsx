import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OrderForm from '../../../components/order-form/OrderForm';
import LoadingSpinner from '../../../components/general/LoadingSpinner';

const Checkout: React.FC = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const { cartItems, itemAnthropometryWarning } = location.state || {};

    if (!cartItems || !Array.isArray(cartItems)) {
        // If someone visits /checkout directly without cart
        navigate('/cart');
        return <LoadingSpinner isLoading={true} />;
    }

    const getProductName = (item: any) => {
        switch (i18n.language) {
            case "ukr":
                return item.name_ua;
            case "rus":
                return item.name_rus;
            case "eng":
            default:
                return item.name_eng;
        }
    };

    const orderFormItems = cartItems.map((cartItem: any) => ({
        item_id: cartItem.item.id,
        name: getProductName(cartItem.item),
        alt: cartItem.item.name_eng,
        image: cartItem.item.main_image,
        currentPrice: cartItem.item.price_uah,
        oldPrice: cartItem.item.old_price_uah,
        itemLength: cartItem.item.item_length,
        itemWidth: cartItem.item.item_width,
        itemHeight: cartItem.item.item_height,
        itemWeight: cartItem.item.item_weight,
    }));

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white p-6 md:p-8 lg:p-12">
            <div className="max-w-5xl mx-auto p-6 md:p-8 lg:p-12">

                <OrderForm
                    items={orderFormItems}
                    theme="dark"
                    itemAnthropometryWarning={itemAnthropometryWarning}
                />
            </div>
        </div>
    );
};

export default Checkout;