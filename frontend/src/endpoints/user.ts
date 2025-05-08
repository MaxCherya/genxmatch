import { getCSRFToken } from "../utils/csrf";
import i18n from "../utils/i18n";

export type BasicUserInfo = {
    username: string | null;
    email: string | null;
}

export type BasicUserInfoPayload = {
    userId: number | 'me' | null;
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