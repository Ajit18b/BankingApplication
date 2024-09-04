import React from "react";

const OtpVerification = ({
  email,
  otp,
  setOtp,
  otpError,
  otpMessage,
  verifyOtp,
}) => (
  <form onSubmit={verifyOtp} className="auth-form">
    <h2>Verify OTP</h2>
    {otpError && <div className="error-message">{otpError}</div>}
    {otpMessage && <div className="success-message">{otpMessage}</div>}
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

export default OtpVerification;
