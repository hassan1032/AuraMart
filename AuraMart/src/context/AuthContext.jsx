import { createContext, useContext, useState, useCallback, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    localStorage.getItem("userToken") || sessionStorage.getItem("userToken") || null
  );

  useEffect(() => {
    if (token) {
      const stored = localStorage.getItem("userProfile") || sessionStorage.getItem("userProfile");
      if (stored) {
        try { setUser(JSON.parse(stored)); } catch {}
      }
    }
  }, [token]);

  const login = useCallback((tkn, userInfo, remember = false) => {
    setToken(tkn);
    setUser(userInfo);
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("userToken", tkn);
    if (userInfo) storage.setItem("userProfile", JSON.stringify(userInfo));
    // Notify CartContext to sync with DB immediately (avoids requiring a page refresh)
    window.dispatchEvent(new CustomEvent('user-login', { detail: { token: tkn } }));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("userToken");
    localStorage.removeItem("userProfile");
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("userProfile");
    // Notify CartContext to clear cart state immediately
    window.dispatchEvent(new CustomEvent('user-logout'));
  }, []);

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
