import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  
  // 1. Debugging Logs (Check your browser console!)
  console.log("Protected Route Check:");
  console.log("Token:", token);
  
  // 2. Check Token
  if (!token) {
    console.warn("No token found. Redirecting to Login.");
    return <Navigate to="/login" replace />;
  }

  // 3. Check Roles (Only if allowedRoles prop is passed)
  if (allowedRoles && userString) {
    const user = JSON.parse(userString);
    console.log("User Role:", user.role);
    console.log("Allowed Roles:", allowedRoles);

    if (!allowedRoles.includes(user.role)) {
      console.warn("User does not have required role. Redirecting.");
      // You can redirect to an "Unauthorized" page, or just back to dashboard
      return <Navigate to="/login" replace />;
    }
  }

  // 4. If all checks pass, render the child route
  return <Outlet />;
};

export default ProtectedRoute;