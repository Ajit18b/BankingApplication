import React, { useState, useEffect } from "react";
import apiConfig from "../apiConfig";
import "./OtpVerification.css"; // Import your custom styles here

const OtpVerification = ({
  OTP_reason,
  email,
  subject,
  message,
  onClose,
  onVerifySuccess,
}) => {
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [showSpinner, setShowSpinner] = useState(false); // Controls the spinner
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    const sendOtp = async () => {
      setApiMessage("");
      setShowSpinner(true); // Show spinner while the OTP is being sent

      try {
        const response = await fetch(apiConfig.endpoints.sendOtpRequest_8090, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            subject,
            message,
          }),
        });

        const data = await response.json();

        if (!response.ok || data.message !== "OTP sent") {
          setApiMessage(data.message || "Failed to send OTP");
          return;
        }

        setApiMessage("OTP Sent Successfully. Please check your email.");
      } catch (err) {
        setApiMessage(err.message || "Failed to send OTP");
      } finally {
        setShowSpinner(false); // Hide spinner after the request is complete
      }
    };

    sendOtp();
  }, [email, message, subject]);

  const verifyOtp = async (e) => {
    e.preventDefault();
    setOtpError("");
    setApiMessage("");
    setShowSpinner(true); // Show spinner while verifying the OTP

    try {
      const response = await fetch(apiConfig.endpoints.verifyOtpRequest_8090, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.message !== "OTP verified") {
        setOtpError(data.message || "Failed to verify OTP");
        return;
      }

      setApiMessage("OTP verified");
      onVerifySuccess();
    } catch (err) {
      setOtpError(err.message || "Failed to verify OTP");
    } finally {
      setShowSpinner(false); // Hide spinner after verification
    }
  };

  return (
    <div className="otp-overlay">
      <div className="otp-modal">
        <h2>{OTP_reason}</h2>
        {apiMessage && (
          <p
            className={
              apiMessage === "OTP Sent Successfully. Please check your email."
                ? "success-text"
                : "error-text"
            }
          >
            {apiMessage}
          </p>
        )}
        {showSpinner && (
          <div className="spinner-container">
            <div className="spinner"></div> {/* Loading spinner */}
          </div>
        )}
        <form onSubmit={verifyOtp}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={showSpinner} // Disable input while the spinner is visible
          />
          {otpError && <p className="error-text">{otpError}</p>}
          <div className="otp-buttons">
            <button
              type="submit"
              className="verify-button"
              disabled={showSpinner}
            >
              {showSpinner ? "Sending OTP....." : "Verify OTP"}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={showSpinner}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
