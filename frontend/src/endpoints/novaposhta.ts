import { getCSRFToken } from "../utils/csrf"

export const fetchOblasts = async () => {
    const res = await fetch('/api/np/oblasts/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
        },
        credentials: 'include',
        body: JSON.stringify({}),
    });
    const data = await res.json();
    return data.data || [];
};

export const fetchCities = async (query: string) => {
    const res = await fetch('/api/np/cities/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
        },
        credentials: 'include',
        body: JSON.stringify({ methodProperties: { FindByString: query } }),
    })
    const data = await res.json()
    return data.data || []
}

export const fetchWarehouses = async (cityRef: string, excludePoshtomats?: boolean) => {
    const res = await fetch('/api/np/warehouses/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
        },
        credentials: 'include',
        body: JSON.stringify({ methodProperties: { CityRef: cityRef } }),
    })
    const data = await res.json()
    if (excludePoshtomats) {
        const filtered = (data.data || []).filter(
            (wh: any) => !wh.Description.toLowerCase().includes('поштомат')
        )
        return filtered
    } else {
        return data.data
    }
}