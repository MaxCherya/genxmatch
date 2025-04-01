const NOVA_POSHTA_URL = 'https://api.novaposhta.ua/v2.0/json/';
const API_KEY = '';

export const fetchOblasts = async () => {
    const res = await fetch(NOVA_POSHTA_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            apiKey: API_KEY,
            modelName: 'Address',
            calledMethod: 'getAreas',
            methodProperties: {}
        }),
    });

    const data = await res.json();
    return data.data || [];
};

export const fetchCities = async (query: string) => {
    const res = await fetch(NOVA_POSHTA_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            apiKey: API_KEY,
            modelName: 'Address',
            calledMethod: 'getCities',
            methodProperties: {
                FindByString: query
            }
        }),
    });

    const data = await res.json();
    return data.data || [];
};

export const fetchWarehouses = async (cityRef: string, excludePoshtomats?: boolean) => {
    const res = await fetch(NOVA_POSHTA_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            apiKey: API_KEY,
            modelName: 'Address',
            calledMethod: 'getWarehouses',
            methodProperties: {
                CityRef: cityRef
            }
        }),
    });

    const data = await res.json();

    if (excludePoshtomats) {
        return (data.data || []).filter((wh: any) =>
            !wh.Description.toLowerCase().includes('поштомат')
        );
    }

    return data.data || [];
};