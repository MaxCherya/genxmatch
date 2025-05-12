export interface AuthCheckResponse {
    success: boolean;
}

export const isAuthenticated = async (): Promise<AuthCheckResponse> => {
    const res = await fetch("/api/auth/is-auth", {
        method: "GET",
        credentials: "include"
    });

    if (!res.ok) throw await res.json()
    return res.json()
}