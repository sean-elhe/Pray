import { useEffect, useState } from "react";
import { AuthContext, type User } from "./AuthContext";
import { login as loginApi, logout as logoutApi, me } from "../api/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await me();
        setUser(res.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (name: string, pin: string) => {
    const res = await loginApi(name, pin);

    if (res.success) {
      const meRes = await me();
      setUser(meRes.user);
    } else {
      throw new Error(res.error);
    }
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
