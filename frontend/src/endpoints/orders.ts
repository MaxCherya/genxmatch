import { getCSRFToken } from "../utils/csrf"

type OrderPayload = {
    item_id: number
    quantity: number
    name: string
    surname: string
    patronymic?: string
    phone: string
    oblast?: string
    city: string
    zipcode?: string
    warehouse?: string
    delivery_company_id: number
    username: any
    customer_notes?: string
}

export const placeAnOrder = async (orderData: OrderPayload) => {
    const res = await fetch('/orders/place-an-order/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify(orderData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Order failed')
    return data;
}