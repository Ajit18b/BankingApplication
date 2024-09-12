// src/Header.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Correct import
import { useSidebar } from "../../Utils/SidebarContext";
import "./Header.css";

const Header = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
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
          <Link to="/home">BankX-WebPortal</Link>
        </div>
        <Link to="/profile" className="profile">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="70"
            fill="currentColor"
            className="bi bi-person"
            viewBox="0 0 16 16"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
          </svg>
          {/* Profile */}
        </Link>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Sidebar */}
      <nav className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link to="/home" onClick={toggleSidebar}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/profile" onClick={toggleSidebar}>
              Profile
            </Link>
          </li>
          {/* Conditionally render Bank Accounts link based on userType */}
          {userType !== "ADMIN" && (
            <>
              <li>
                <Link to="BankAccountDetails" onClick={toggleSidebar}>
                  Bank Accounts
                </Link>
              </li>
              <li>
                <Link to="MoneyTransfer" onClick={toggleSidebar}>
                  Transfer Money
                </Link>
              </li>
              <li>
                <Link to="TransactionDetails" onClick={toggleSidebar}>
                  Transaction Details
                </Link>
              </li>
              <li>
                <Link to="ExpenseTracker" onClick={toggleSidebar}>
                  Track Your Expense
                </Link>
              </li>
            </>
          )}
          {/* Conditionally render admin nav if userType is ADMIN */}
          {userType === "ADMIN" && (
            <>
              <li>
                <Link to="adminAccountCreation" onClick={toggleSidebar}>
                  New Bank Account Creation
                </Link>
              </li>
              <li>
                <Link to="adminAccountAllAccountList" onClick={toggleSidebar}>
                  Existing Accounts
                </Link>
              </li>
              <li>
                <Link to="accountDeposit" onClick={toggleSidebar}>
                  Deposit money for Customer
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
