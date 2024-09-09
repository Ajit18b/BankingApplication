import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  // If there's no token, redirect to the login page
  if (!token) {
    console.log("No token found, redirecting to login");
    return <Navigate to="/" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Get the current time in seconds

    // Check if the token has expired
    if (decodedToken.exp < currentTime) {
      console.log("Token expired, logging out and redirecting to login");
      localStorage.removeItem("token"); // Remove the expired token
      return <Navigate to="/" replace />;
    }

    // Check if the user's role is authorized to access the route
    if (!allowedRoles.includes(decodedToken.userType)) {
      console.log("User role not authorized, redirecting to login");
      return <Navigate to="/" replace />;
    }

    // If token is valid and the user role is authorized, render the children components
    return children;
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("token"); // Remove the invalid token
    return <Navigate to="/" replace />;
  }
};

export default PrivateRoute;
