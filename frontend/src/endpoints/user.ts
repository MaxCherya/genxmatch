import { getCSRFToken } from "../utils/csrf";
import i18n from "../utils/i18n";

export type BasicUserInfo = {
    id: number;
    username: string;
    email: string;
}

export type BasicUserInfoPayload = {
    userId: number | 'me';
}

export const getUser = async (userId: BasicUserInfoPayload) => {
    const res = await fetch('/api/auth/get-user/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
            'X-Language': i18n.language,
        },
        credentials: 'include',
        body: JSON.stringify(userId),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Unknown error');
    return data;
};

export const addToLastViewed = async (itemId: number): Promise<{ message: string }> => {
    const res = await fetch('/api/auth/add-to-last-viewed/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
            'X-Language': i18n.language,
        },
        credentials: 'include',
        body: JSON.stringify({ itemId }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Unknown error');
    return data;
};

export const getLastViewed = async (): Promise<any[]> => {
    const res = await fetch('/api/auth/get-last-viewed-items/', {
        method: 'POST',
        headers: {
            'X-Language': i18n.language,
            'X-CSRFToken': getCSRFToken(),
        },
        credentials: 'include',
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Unknown error');
    return data;
};