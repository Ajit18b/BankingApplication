// src/components/AuthSubComponent/EmailVerification.js
import React, { useState } from "react";
import apiConfig from "../../apiConfig";

const EmailVerification = ({ email, onVerify }) => {
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpMessage, setOtpMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setOtpError("");
    setOtpMessage("");

    try {
      const response = await fetch(apiConfig.endpoints.sendOtpRequest_8090, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok || data.message !== "OTP verified") {
        setOtpError(data.message || "Failed to verify OTP");
        return;
      }

      setOtpMessage("OTP verified successfully");
      onVerify(); // Notify parent component to proceed with registration
    } catch (err) {
      setOtpError(err.message || "Failed to verify OTP");
    }
  };

  return (
    <form onSubmit={handleVerify} className="auth-form">
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
};

export default EmailVerification;
