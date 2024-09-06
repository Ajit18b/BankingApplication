// RegisterEmailidInput.jsx
import React from "react";

const RegisterEmailidInput = ({
  email,
  handleInputChange,
  handleSendOtp,
  error,
  message,
  otpSentMessage,
}) => {
  return (
    <form onSubmit={handleSendOtp} className="auth-form">
      <h2>Verify Email To Register In Our Online Banking</h2>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
      {otpSentMessage && <div className="info-message">{otpSentMessage}</div>}
      <label>
        <div style={{ color: "#3385ff" }}>
          Your Email Should be registered with our bank while opening the bank
          account to register for online portal
        </div>
        <p></p>
        <label>Enter Email For verification :</label>
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
};

export default RegisterEmailidInput;
