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

export interface GalleryImage {
    src: string;
    alt: string;
}

export interface Item {
    id: number;
    name_ua: string;
    name_eng: string;
    name_rus: string;
    artiqul_original: string;
    price_uah: string;
    old_price_uah: string | null;

    item_length: string | null;
    item_height: string | null;
    item_width: string | null;
    item_weight: string | null;

    sold: number;
    rating: string;

    short_description_ua: string;
    short_description_eng: string;
    short_description_rus: string;

    description_p1_ua: string;
    description_p1_eng: string;
    description_p1_rus: string;

    description_p2_ua: string;
    description_p2_eng: string;
    description_p2_rus: string;

    feature_1_header_ua: string;
    feature_1_header_eng: string;
    feature_1_header_rus: string;
    feature_1_ua: string;
    feature_1_eng: string;
    feature_1_rus: string;

    feature_2_header_ua: string;
    feature_2_header_eng: string;
    feature_2_header_rus: string;
    feature_2_ua: string;
    feature_2_eng: string;
    feature_2_rus: string;

    feature_3_header_ua: string;
    feature_3_header_eng: string;
    feature_3_header_rus: string;
    feature_3_ua: string;
    feature_3_eng: string;
    feature_3_rus: string;

    feature_4_header_ua: string;
    feature_4_header_eng: string;
    feature_4_header_rus: string;
    feature_4_ua: string;
    feature_4_eng: string;
    feature_4_rus: string;

    main_image: string | null;
    gallery: GalleryImage[];
    video: string | null;
    video_poster: string | null;

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

export const fetchItemById = async (itemId: number): Promise<Item> => {
    const res = await fetch(`/api/items/items/${itemId}/`);
    if (!res.ok) throw new Error(`Failed to fetch item with id ${itemId}`);
    return await res.json();
};

export const fetchItemSuggestions = async (itemId: number): Promise<Item[]> => {
    const res = await fetch(`/api/items/items/${itemId}/suggestions/`);
    if (!res.ok) throw new Error("Failed to fetch suggestions");
    return await res.json();
};