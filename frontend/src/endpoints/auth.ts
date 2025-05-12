import { authFetch } from "./fetchers/authFetch";
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
  otp?: string;
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


// 2FA
export interface Enable2FAResponse {
  qr_code: string;
  manual_code: string;
}

export interface StructuredError {
  error: string;
  message: string;
}

export interface GenericMessageResponse {
  message: string;
}

// Enable 2FA: returns QR code and manual code
export const enable2FA = async (): Promise<Enable2FAResponse> => {
  const res = await authFetch(`/api/auth/2fa/enable/`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) throw await res.json() as StructuredError;
  return res.json();
};

// Confirm 2FA setup with OTP
export const confirm2FA = async (otp: string): Promise<GenericMessageResponse> => {
  const res = await authFetch(`/api/auth/2fa/confirm/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ otp }),
  });

  if (!res.ok) throw await res.json();
  return res.json();
};

// Disable 2FA with OTP
export const disable2FA = async (otp: string): Promise<GenericMessageResponse> => {
  const res = await authFetch(`/api/auth/2fa/disable/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ otp }),
  });

  if (!res.ok) throw await res.json();
  return res.json();
};