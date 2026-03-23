import api from "../api/Api";
import { clearAuthStorage, setStoredUser, setTokens } from "./storage";

type Credentials = {
  username: string;
  password: string;
};

type RegisterPayload = {
  email: string;
  password: string;
  [key: string]: any; // allow extra fields
};

type User = any;

type AuthResponse = {
  access?: string;
  refresh?: string;
  user: User;
};

export async function login(credentials: Credentials): Promise<User> {
  const response = await api.post<AuthResponse>(
    "/api/auth/login/",
    credentials
  );

  await setTokens(response.data);
  await setStoredUser(response.data.user);

  return response.data.user;
}

export async function register(payload: RegisterPayload): Promise<User> {
  const response = await api.post<AuthResponse>(
    "/api/auth/register/",
    payload
  );

  await setTokens(response.data);
  await setStoredUser(response.data.user);

  return response.data.user;
}

export async function fetchCurrentUser(): Promise<User> {
  const response = await api.get<User>("/api/auth/me/");

  await setStoredUser(response.data);

  return response.data;
}

export function logout(): void {
  clearAuthStorage();
}