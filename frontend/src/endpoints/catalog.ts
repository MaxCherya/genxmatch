export interface Category {
    id: number;
    name_ua: string;
    name_eng: string;
    name_rus: string;
    subcategories: Category[];
}

export interface ItemCharacteristic {
    key_ua: string;
    key_eng: string;
    key_rus: string;
    value_ua: string;
    value_eng: string;
    value_rus: string;
}

export interface Item {
    id: number;
    name_ua: string;
    name_eng: string;
    name_rus: string;
    price_uah: string;
    main_image: string | null;
    categories: Category[];
    characteristics: ItemCharacteristic[];
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

interface CatalogFiltersResponse {
    categories: Category[];
    max_price: number;
}

export const fetchCatalogFilters = async (): Promise<CatalogFiltersResponse> => {
    const res = await fetch("/api/items/catalog/filters/");
    if (!res.ok) throw new Error(`Failed to fetch filters`);
    return await res.json();
};

export const fetchItemsPaginated = async ({
    page = 1,
    minPrice,
    maxPrice,
    categories,
    sort,
}: {
    page?: number;
    minPrice?: number;
    maxPrice?: number;
    categories?: number[];
    sort?: "popularity" | "rating" | "price_asc" | "price_desc";
}) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    if (minPrice !== undefined) params.append("min_price", minPrice.toString());
    if (maxPrice !== undefined) params.append("max_price", maxPrice.toString());
    if (categories?.length) params.append("categories", categories.join(","));
    if (sort) params.append("sort", sort);

    const res = await fetch(`/api/items/items/?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch items");
    return res.json();
};