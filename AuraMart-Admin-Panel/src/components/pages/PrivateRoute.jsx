import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import usePreventBackNavigation from "../../hooks/usePreventBackNavigation";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loadingAuth } = useAuth();
  const location = useLocation();

  usePreventBackNavigation();

  // 🔹 Step 1: Wait until auth data fully loads
  if (loadingAuth) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // 🔹 Step 2: If not logged in, go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 🔹 Step 3: Otherwise show protected content
  return children;
};

export default PrivateRoute;
