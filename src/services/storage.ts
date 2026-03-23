import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "chat_access_token";
const REFRESH_TOKEN_KEY = "chat_refresh_token";
const USER_KEY = "chat_current_user";

export async function getAccessToken(): Promise<string | null> {
  return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
}

export async function getStoredUser(): Promise<any> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

interface TokenPayload {
  access?: string;
  refresh?: string;
}


export async function setTokens({ access, refresh }: TokenPayload): Promise<void> {
  if (access) {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, access);
  }
  if (refresh) {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }
}

export async function setStoredUser(user: any): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function clearAuthStorage(): Promise<void> {
  await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
}