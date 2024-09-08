import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Correct import
import "./Header.css";

const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [userType, setUserType] = useState("USER"); // Default to USER
  const navigate = useNavigate();

  useEffect(() => {
    // Extract and decode the token to get userType
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserType(decodedToken.userType);
      } catch (error) {
        console.error("Invalid token:", error);
        // Handle invalid token case (optional)
      }
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    // Clear the token from localStorage or any other storage
    localStorage.removeItem("token");

    // Redirect to the login page or any other page
    navigate("/", { replace: true }); // Use replace to clear history
  };

  return (
    <header className="header">
      <div className="header-container">
        <button className="menu-button" onClick={toggleSidebar}>
          &#9776;
        </button>
        <div className="header-logo">
          <Link to="/dashboard">MyApp</Link>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Sidebar */}
      <nav className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link to="home" onClick={toggleSidebar}>
              Home
            </Link>
          </li>
          <li>
            <Link to="profile" onClick={toggleSidebar}>
              Profile
            </Link>
          </li>
          {/* Conditionally render Bank Accounts link based on userType */}
          {userType !== "ADMIN" && (
            <li>
              <Link to="BankAccountDetails" onClick={toggleSidebar}>
                Bank Accounts
              </Link>
            </li>
          )}
          {/* Conditionally render admin nav if userType is ADMIN */}
          {userType === "ADMIN" && (
            <>
              <li>
                <Link to="adminAccountCreation" onClick={toggleSidebar}>
                  Account Creation
                </Link>
              </li>
              <li>
                <Link to="adminAccountAllAccountList" onClick={toggleSidebar}>
                  Existing Accounts
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div className="backdrop" onClick={toggleSidebar}></div>
      )}
    </header>
  );
};

export default Header;
