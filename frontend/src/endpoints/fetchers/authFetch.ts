import { refreshToken, logout } from "../auth";

export const authFetch = async (
    input: RequestInfo,
    init?: RequestInit,
    retry: boolean = true
): Promise<Response> => {
    const res = await fetch(input, {
        ...init,
        credentials: "include",
    });

    if (res.status !== 401 || !retry) return res;

    try {
        const refreshed = await refreshToken();
        console.log("Token refreshed:", refreshed.message);

        return await authFetch(input, init, false);
    } catch (err) {
        try {
            await logout();
        } catch (_) { }
        window.location.href = "/catalog";
        throw new Error("Session expired.");
    }
};