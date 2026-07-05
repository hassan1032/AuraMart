import { createContext, useContext, useEffect, useState } from "react";
import { removeToken, setToken, getToken } from "../auth/authToken";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [authData, setAuthData] = useState({
        token: null,
        roleType: null,
        permissions: [],
    });

    // const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);

    // 🔹 Load auth data from sessionStorage on app load / reload
    useEffect(() => {
        const userData = sessionStorage.getItem("data");
        if (userData) {
            try {
                const parsed = JSON.parse(userData);
                if (parsed?.token) {
                    setAuthData(parsed);
                    // setIsAuthenticated(true);
                }
            } catch (err) {
                console.error("Error parsing session data:", err);
                sessionStorage.removeItem("data");
            }
        }
        setLoadingAuth(false); // Done loading
    }, []);

    // 🔹 Save to sessionStorage when authData changes (but NOT during initial load)
    useEffect(() => {
        if (loadingAuth) return; // Prevent removing data during initialization

        if (authData?.token) {
            sessionStorage.setItem("data", JSON.stringify(authData));
        } else {
            sessionStorage.removeItem("data");
        }
    }, [authData, loadingAuth]);

    // 🔹 Login
    const login = (response) => {
        const permissions = response?.employee?.role?.permissions || response.permissions || [];

        const formattedData = {
            token: response.token,
            roleType: response?.employee?.role?.roleName || response.roleType || null,
            permissions,
        };

        setAuthData(formattedData);
        setToken(formattedData); // Save to sessionStorage
        // setIsAuthenticated(true);
    };

    // 🔹 Logout
    const logout = () => {
        setAuthData({ token: null, roleType: null, permissions: [] });
        // setIsAuthenticated(false);
        removeToken();
    };

    // 🔹 Permission check helper
    const hasPermission = (moduleName, actionName) => {
        // SuperAdmin bypasses all permission checks
        if (authData?.roleType?.toLowerCase() === 'superadmin') return true;

        if (!authData?.permissions?.length) return false;

        const module = authData.permissions.find(
            (m) => m.name.toLowerCase() === moduleName.toLowerCase()
        );

        if (!module || !module.isVisible) return false;
        if (!actionName) return true;

        const action = module.actions?.find(
            (a) => a.name.toLowerCase() === actionName.toLowerCase()
        );

        return action ? action.allowed : false;
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return !!sessionStorage.getItem("data");
    };

    return (
        <AuthContext.Provider
            value={{
                authData,
                isAuthenticated,
                loadingAuth,
                login,
                logout,
                hasPermission,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ✅ Custom hook
export const useAuth = () => useContext(AuthContext);
