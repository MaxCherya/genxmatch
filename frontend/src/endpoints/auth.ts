import { BasicUserInfo } from "./user";

export interface AuthResponse {
  message: string;
  user: BasicUserInfo;
}

export interface AuthError {
  error: string;
}

export interface RegisterPayload {
  username: string;
  email?: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

// Register user
export const register = async (data: RegisterPayload): Promise<AuthResponse> => {
  const res = await fetch(`/api/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) throw await res.json();
  return res.json();
};

// Login
export const login = async (data: LoginPayload): Promise<AuthResponse> => {
  const res = await fetch(`/api/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) throw await res.json();
  return res.json();
};

// Logout
export const logout = async (): Promise<AuthResponse> => {
  const res = await fetch(`/api/auth/logout/`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) throw await res.json();
  return res.json();
};

// Refresh token
export const refreshToken = async (): Promise<AuthResponse> => {
  const res = await fetch(`/api/auth/refresh/`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) throw await res.json();
  return res.json();
};