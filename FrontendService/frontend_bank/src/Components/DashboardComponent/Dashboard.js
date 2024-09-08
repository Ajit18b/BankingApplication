import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import Header from "./../HeaderComponent/Header";
import "./Dashboard.css";

const Dashboard = () => {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setShouldRedirect(true);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token"); // Optionally remove token
          setShouldRedirect(true);
        }
      } catch (error) {
        setShouldRedirect(true);
      }
    };

    checkTokenValidity(); // Check validity on component mount

    // Check validity every 10 seconds for more responsiveness
    const intervalId = setInterval(checkTokenValidity, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (shouldRedirect) {
    // Use Navigate for redirection
    return <Navigate to="/" replace />;
  }

  // Check if the current route is exactly the dashboard route
  const isDashboardRoute =
    location.pathname === "/dashboard" &&
    !location.pathname.includes("/dashboard/");

  return (
    <div className="dashboard" role="main">
      <Header />
      <main className="dashboard-content">
        {isDashboardRoute && (
          <div
            className="dashboard-message-container"
            role="region"
            aria-labelledby="dashboard-message-heading"
          >
            <div className="dashboard-message">
              <h2 id="dashboard-message-heading">Welcome to your Dashboard!</h2>
              <p>
                Manage your settings, view reports, and track your progress all in
                one place.
              </p>
            </div>
          </div>
        )}
        <Outlet /> {/* Render nested routes here */}
      </main>
    </div>
  );
};

export default Dashboard;
