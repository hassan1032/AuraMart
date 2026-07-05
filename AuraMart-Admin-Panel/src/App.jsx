import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./components/pages/login/Login";
import ForgetPassword from "./components/pages/login/ForgetPassword";
import AppLayout from "./layout/AppLayout";
import PrivateRoute from "./components/pages/PrivateRoute";
import routes from "./routes/route";
import { getToken } from "./auth/authToken";
import { ToastContainer } from "react-toastify";

function App() {

  const { authData } = useAuth();
  const token = getToken();

  // Filter routes based on permissions — SuperAdmin sees everything
  const isSuperAdmin = authData?.roleType?.toLowerCase() === "superadmin";
  const visibleRoutes = routes.filter(route => {
    if (!route.module) return true;
    if (isSuperAdmin) return true;
    const permission = authData.permissions.find(p => p.name.toLowerCase() === route.module.toLowerCase());
    return permission?.isVisible;
  });

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} />

          {/* Protected routes */}
          <Route path="/admin" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
            {visibleRoutes.map((route, idx) => {
              const Component = route.component;
              return <Route key={idx} path={route.path} element={<Component />} />;
            })}
          </Route>

          {/* Catch-all route */}
          <Route
            path="*"
            element={
              token
                ? <Navigate to={window.location.pathname} replace /> // ✅ stay on same path if authenticated
                : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </BrowserRouter>

      {/* Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
