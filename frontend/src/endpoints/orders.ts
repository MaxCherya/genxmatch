import { getCSRFToken } from "../utils/csrf";
import i18n from "../utils/i18n";

export type OrderItemPayload = {
    item_id: number;
    quantity: number;
};

export type OrderPayload = {
    items: OrderItemPayload[];
    name: string;
    surname: string;
    patronymic?: string;
    phone: string;
    oblast?: string;
    city: string;
    zipcode?: string;
    warehouse?: string;
    delivery_company_id: number;
    username: any;
    customer_notes?: string;
    timestamp: number;
    signature: string;
};

export const placeAnOrder = async (orderData: OrderPayload) => {
    const res = await fetch('/orders/place-an-order/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
            'X-Language': i18n.language,
        },
        body: JSON.stringify(orderData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Order failed');
    return data;
};

export const signOrder = async ({
    items,
    timestamp,
}: {
    items: OrderItemPayload[];
    timestamp: number;
}) => {
    const res = await fetch('/orders/sign-order/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
            'X-Language': i18n.language,
        },
        body: JSON.stringify({ items, timestamp }),
    });

    if (!res.ok) {
        throw new Error('Failed to sign order');
    }

    return await res.json();
};