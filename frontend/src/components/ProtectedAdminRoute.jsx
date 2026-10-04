import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedAdminRoute = () => {
  const { user, authLoading } = useAuth();

  // 1. Show a minimal loading state while verifying auth with the backend
  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>
      </div>
    );
  }

  // 2. Unauthenticated user -> redirect to /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Logged in but not an admin -> redirect to /
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // 4. Logged in admin -> render the protected routes
  return <Outlet />;
};
