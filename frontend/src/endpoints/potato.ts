import { authFetch } from "./fetchers/authFetch"
import i18n from "../utils/i18n"

export type SuppliersBackend = {
    id: number,
    name: string
}

export type CategoriesBackend = {
    id: number;
    name_eng: string;
    name_ua: string;
    name_rus: string;
    description_eng: string;
    description_ua: string;
    description_rus: string;
    subcategories: CategoriesBackend[];
};

export type Characteristic = {
    key_ua: string;
    key_eng: string;
    key_rus: string;
    value_ua: string;
    value_eng: string;
    value_rus: string;
};

export type Photo = {
    alt: string;
    src: string;
};

export type CreateItemPayload = {
    supplier: string;
    main_image_url: string;
    video_url: string;
    video_poster_url: string;
    gallery: Photo[];
    categories: number[];
    characteristics: Characteristic[];
    [key: string]: string | number | Photo[] | number[] | Characteristic[] | null;
};

export const getSuppliers = async () => {
    const res = await authFetch('api/items/potato/get-suppliers/', {
        method: 'GET',
        headers: {
            'X-Language': i18n.language,
        },
        credentials: "include"
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Unknown error');
    return data as SuppliersBackend[];
}

export const getCategories = async (): Promise<CategoriesBackend[]> => {
    const res = await authFetch("api/items/potato/get-categories/", {
        method: "GET",
        headers: {
            "X-Language": i18n.language,
        },
        credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Unknown error");
    return data as CategoriesBackend[];
}

export const createItem = async (payload: CreateItemPayload) => {
    const res = await authFetch('api/items/potato/create-item/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Language': i18n.language,
        },
        credentials: "include",
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create item');
    return data;
};