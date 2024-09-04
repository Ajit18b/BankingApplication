import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("No token found, redirecting to login");
    return <Navigate to="/" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds

    if (decodedToken.exp < currentTime) {
      console.log("Token expired, redirecting to login");
      return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(decodedToken.userType)) {
      console.log("User role not authorized, redirecting to login");
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/" replace />;
  }
};

export default PrivateRoute;
