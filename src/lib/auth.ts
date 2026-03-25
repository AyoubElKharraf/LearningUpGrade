export type UserRole = "admin" | "client";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  name: string;
};

const STORAGE_KEY = "learnspark_auth_user";

type StoredAuth = {
  token: string;
  user: AuthUser;
};

export function getAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredAuth | AuthUser;
    // Backward compatibility with old local-only structure
    if ("token" in parsed && (parsed as StoredAuth).user) return (parsed as StoredAuth).user;
    return parsed as AuthUser;
  } catch {
    return null;
  }
}

export function getAuthToken(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredAuth;
    return parsed?.token || null;
  } catch {
    return null;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

async function authRequest<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function login(input: { email: string; password: string }): Promise<AuthUser> {
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  if (!email) throw new Error("Email requis");
  if (password.length < 4) throw new Error("Mot de passe trop court");

  const { user, token } = await authRequest<{ user: AuthUser; token: string }>("auth/login", { email, password });
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user } as StoredAuth));
  return user;
}

export async function register(input: { email: string; password: string }): Promise<AuthUser> {
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  if (!email) throw new Error("Email requis");
  if (password.length < 4) throw new Error("Mot de passe trop court");

  const { user, token } = await authRequest<{ user: AuthUser; token: string }>("auth/register", { email, password });
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user } as StoredAuth));
  return user;
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export async function updateProfile(input: { name: string; password?: string }): Promise<AuthUser> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Non connecte");
  }

  const name = input.name.trim();
  if (!name) {
    throw new Error("Nom requis");
  }

  const body: { name: string; password?: string } = { name };
  if (input.password && input.password.trim().length > 0) {
    body.password = input.password;
  }

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Request failed: ${response.status}`);
  }

  const data = (await response.json()) as { user: AuthUser };
  const nextUser = data.user;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user: nextUser } as StoredAuth));
  return nextUser;
}

