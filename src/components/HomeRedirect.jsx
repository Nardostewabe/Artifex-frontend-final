import React from 'react';
import { Navigate } from 'react-router-dom';
import HomePage from '../Pages/Public/HomePage.jsx';

const HomeRedirect = () => {
    // We access localStorage directly to avoid potential context delay issues for the initial route
    // But utilizing the context is also fine. Let's stick to localStorage for speed on initial load 
    // effectively mimicking what AuthProvider does but immediately.
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token) {
        return <HomePage />;
    }

    if (token && !userString) {
        return <Navigate to="/roles" replace />;
    }

    let user;
    try {
        user = JSON.parse(userString);
    } catch (e) {
        // If JSON parse fails, treat as invalid session
        return <HomePage />;
    }

    // Check for missing role
    if (!user.role) {
        return <Navigate to="/roles" replace />;
    }

    switch (user.role) {
        case 1:
        case "Customer":
            return <Navigate to="/customer-home" replace />;
        case 2:
        case "Seller":
            return <Navigate to="/seller-home" replace />;
        case 3:
        case "ContentAdmin":
            return <Navigate to="/ContentAdmin-dashboard" replace />;
        case 4:
        case "PlatformAdmin":
            return <Navigate to="/PlatformAdmin-dashboard" replace />;
        default:
            // Fallback for unknown role, or go to roles selection if that makes sense
            // The prompt said "if token found but no role go to roles", 
            // implies if role is weird or missing.
            return <Navigate to="/roles" replace />;
    }
};

export default HomeRedirect;
