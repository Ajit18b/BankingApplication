import React from "react";

const PasswordLogin = ({
  formData,
  handleInputChange,
  handleLogin,
  error,
  message,
}) => (
  <form onSubmit={handleLogin} className="auth-form">
    <h2>Login</h2>
    {error && <div className="error-message">{error}</div>}
    {message && <div className="success-message">{message}</div>}
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
);

export default PasswordLogin;
