import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "./Dashboard.css";

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState({ email: "", userType: "" });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      try {
        const response = await fetch("/api/refresh-token", {
          // Replace with your refresh token endpoint
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("token", data.token); // Update with the new access token
          localStorage.setItem("refreshToken", data.refreshToken); // Update with the new refresh token
        } else {
          throw new Error("Failed to refresh token");
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        navigate("/"); // Redirect to login page on failure
      }
    } else {
      navigate("/"); // Redirect to login page if no refresh token
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000; // Current time in seconds

          if (decodedToken.exp < currentTime) {
            // Token is expired, refresh it
            await refreshToken();
          }

          // Decode the token again after refresh
          const newToken = localStorage.getItem("token");
          const newDecodedToken = jwtDecode(newToken);

          setUserInfo({
            email: newDecodedToken.sub,
            userType: newDecodedToken.userType,
          });
        } catch (error) {
          console.error("Failed to decode token", error);
          navigate("/");
        }
      } else {
        navigate("/");
      }

      setIsLoading(false);
    };

    checkToken();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <h2 className="dashboard-title">Dashboard</h2>
        <div className="user-info">
          <p>
            <strong>Email:</strong> {userInfo.email}
          </p>
          <p>
            <strong>User Type:</strong> {userInfo.userType}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
