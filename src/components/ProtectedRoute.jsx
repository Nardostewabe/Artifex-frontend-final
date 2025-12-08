import { Navigate, Outlet } from "react-router-dom";

// This component wraps around your pages
const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  // 1. If no token, kick them out to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. (Optional) If we specified specific roles (e.g. only Sellers), check that here
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If a Customer tries to go to Seller page, send them back
    return <Navigate to="/unauthorized" replace />; 
  }

  // 3. If all good, render the page (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;