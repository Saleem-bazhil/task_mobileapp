import React, { createContext, useEffect, useMemo, useState, ReactNode } from 'react';

// Assuming these paths match your React Native project structure
import {
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from '../services/auth';
import { getAccessToken } from '../services/storage';

// 1. Define your strict TypeScript interfaces
export interface User {
  id: string | number;
  username: string;
  email?: string;
  // Add any other fields your user object returns from the backend
}

// Adjust these to match your actual API payloads
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// 2. Create the context with the correct type (or null initially)
export const AuthContext = createContext<AuthContextType | null>(null);

// 3. The main rnfe functional component
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize state with proper types
  const [user, setUser] = useState<User | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const token = getAccessToken(); // Note: Ensure this is synchronous (like MMKV) or await it if using AsyncStorage
      
      if (!token) {
        if (!cancelled) setIsBootstrapping(false);
        return;
      }

      try {
        const currentUser = await fetchCurrentUser();
        if (!cancelled) {
          setUser(currentUser);
        }
      } catch {
        if (!cancelled) {
          logoutRequest();
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false);
        }
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBootstrapping,
      async login(credentials: LoginCredentials) {
        const authenticatedUser = await loginRequest(credentials);
        setUser(authenticatedUser);
        return authenticatedUser;
      },
      async register(payload: RegisterPayload) {
        const registeredUser = await registerRequest(payload);
        setUser(registeredUser);
        return registeredUser;
      },
      logout() {
        logoutRequest();
        setUser(null);
      },
    }),
    [isBootstrapping, user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
