// OtpVerification.jsx
import React from "react";

const OtpVerification = ({
  email,
  otp,
  setOtp,
  otpError,
  otpMessage,
  verifyOtp,
  otpSentMessage,
}) => {
  return (
    <form onSubmit={verifyOtp} className="auth-form">
      <h2>Verify OTP</h2>
      {otpError && <div className="error-message">{otpError}</div>}
      {otpMessage && <div className="success-message">{otpMessage}</div>}
      {otpSentMessage && <div style={{ color: "green" }}>{otpSentMessage}</div>}
      <label>
        OTP:
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
      </label>
      <button type="submit">Verify OTP</button>
    </form>
  );
};

export default OtpVerification;
