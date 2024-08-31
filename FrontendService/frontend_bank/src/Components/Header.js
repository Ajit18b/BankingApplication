import React from "react";
import { Link } from "react-router-dom";
import "./Header.css"; // Import the CSS file

const Header = () => {
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    window.location.href = "/"; // Redirect to login page
  };

  return (
    <header className="app-header">
      <nav className="nav-container">
        <ul className="nav-links">
          <li>
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
          </li>
          {/* Add more links if necessary */}
        </ul>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;
