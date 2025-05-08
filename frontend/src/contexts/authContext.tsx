import React, { createContext, useContext, useEffect, useState } from "react";
import { getUser } from "../endpoints/user";

interface AuthUser {
    id: number;
    username: string;
    email: string;
}

interface AuthContextType {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const data = await getUser({ userId: 'me' });
                setUser(data);
            } catch (err) {
                setUser(null);
            }
        };
        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};