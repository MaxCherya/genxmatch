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

export const fetchWarehouses = async (cityRef: string, excludePoshtomats?: boolean, excludePunkts?: boolean) => {
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
    let results = data.data || [];

    if (excludePoshtomats) {
        results = results.filter((wh: any) =>
            !wh.Description.toLowerCase().includes('поштомат')
        );
    }

    if (excludePunkts) {
        results = results.filter((wh: any) =>
            !wh.Description.toLowerCase().includes('пункт')
        );
    }

    return results;
};