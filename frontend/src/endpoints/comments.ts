import { getCSRFToken } from "../utils/csrf";
import i18n from "../utils/i18n";

export type CommentPayload = {
    name: string;
    surname?: string;
    rating: number;
    content: string;
    images: string[];
};

export const submitItemComment = async (itemId: number, commentData: CommentPayload) => {
    const res = await fetch(`/api/comments/${itemId}/comments/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
            'X-Language': i18n.language,
        },
        body: JSON.stringify(commentData),
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || 'Failed to submit comment');
    }
    return data;
};

export const getItemComments = async (itemId: number) => {
    const res = await fetch(`/api/comments/${itemId}/comments/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
            'X-Language': i18n.language,
        },
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || 'Failed to load comments');
    }
    return data;
};