export interface Item {
    id: number;
    name_ua: string;
    name_eng: string;
    name_rus: string;
    price_uah: string;
    main_image: string | null;
    categories: { name: string }[];
    characteristics: { key_ua: string; key_eng: string; key_rus: string; value_ua: string; value_eng: string; value_rus: string }[];
}

// Fetch all items from the backend
export const fetchItems = async (): Promise<Item[]> => {
    try {
        const response = await fetch(`api/items/items/`);
        if (!response.ok) {
            throw new Error(`Failed to fetch items: ${response.status} ${response.statusText}`);
        }
        const data: Item[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching items:", error);
        throw error;
    }
};