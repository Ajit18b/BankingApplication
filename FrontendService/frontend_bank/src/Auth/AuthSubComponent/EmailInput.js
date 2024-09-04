import React from "react";

const EmailInput = ({
  email,
  handleInputChange,
  handleOtpRequest,
  error,
  message,
}) => (
  <form onSubmit={handleOtpRequest} className="auth-form">
    <h2>Login</h2>
    {error && <div className="error-message">{error}</div>}
    {message && <div className="success-message">{message}</div>}
    <label>
      Email:
      <input
        type="email"
        name="email"
        value={email}
        onChange={handleInputChange}
        required
      />
    </label>
    <button type="submit">Send OTP</button>
  </form>
);

export default EmailInput;
