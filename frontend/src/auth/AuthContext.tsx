import { createContext } from "react";

export type User = {
  id: number;
  name: string;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (name: string, pin: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
