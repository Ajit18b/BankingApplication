import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import for navigation
import "./AuthComponent.css"; // Import the CSS file

const AuthComponent = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    userType: "user", // Default to 'user'; you can change this as needed
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Use this hook for navigation

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid email or password");
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem("token", data.token); // Store token in localStorage
      setMessage("Login successful");
      navigate("/dashboard"); // Redirect to dashboard
    } catch (err) {
      setError(err.message || "Failed to login");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 409) {
        setError("User with this email already exists");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const text = await response.text();
      setMessage(text || "User registered successfully");
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        userType: "user",
      });
    } catch (err) {
      setError(err.message || "Failed to register user");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-toggle">
        <button
          onClick={() => setIsLogin(true)}
          className={isLogin ? "active" : ""}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={!isLogin ? "active" : ""}
        >
          Register
        </button>
      </div>
      {isLogin ? (
        <form onSubmit={handleLogin} className="auth-form">
          <h2>Login</h2>
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </label>
          <button type="submit">Login</button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="auth-form">
          <h2>Register</h2>
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
          <label>
            First Name:
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            User Type:
            <select
              name="userType"
              value={formData.userType}
              onChange={handleInputChange}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <button type="submit">Register</button>
        </form>
      )}
    </div>
  );
};

export default AuthComponent;
