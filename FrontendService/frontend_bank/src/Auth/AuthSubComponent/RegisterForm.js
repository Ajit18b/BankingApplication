import React from "react";

const RegisterForm = ({
  formData,
  handleInputChange,
  handleRegister,
  error,
  message,
}) => (
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
);

export default RegisterForm;
