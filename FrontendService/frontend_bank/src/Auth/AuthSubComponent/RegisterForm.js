import React, { useState } from "react";
import RegisterEmailidInput from "./RegisterEmailidInput";
import OtpVerification from "./OtpVerification";
import LoadingSpinner from "./../../Utils/LoadingSpinner"; // Import the spinner

const RegisterForm = ({
  formData,
  handleInputChange,
  handleRegister,
  error,
  message,
  showSpinner, // Receive spinner state as a prop from AuthComponent
}) => {
  const [step, setStep] = useState("email"); // "email", "verifyOtp", "register"
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [otpSentMessage, setOtpSentMessage] = useState(""); // New state for OTP sent message
  const [isLoading, setIsLoading] = useState(false); // State to manage loading spinner
  const [emailError, setEmailError] = useState(""); // State for email error

  // Check email conditions with both APIs
  const checkEmailConditions = async () => {
    try {
      // First API: Check if email exists in the auth system
      const authResponse = await fetch(
        "http://localhost:8080/api/v1/auth/check-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const authData = await authResponse.json();

      // Second API: Check if email exists with bank account
      const bankResponse = await fetch(
        "http://localhost:8080/api/v1/public/unregistered-portal-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const bankData = await bankResponse.json();

      // Handle conditions based on both responses
      if (
        authData.message === "Email does not exist" &&
        bankData.emailExistsWithBankAccount
      ) {
        // Email does not exist in auth system but exists with a bank account
        // Allow OTP sending
        return false; // Do not prevent OTP sending
      } else if (
        authData.message === "Email exists" &&
        bankData.emailExistsWithBankAccount
      ) {
        // Email exists in both auth system and with a bank account
        setEmailError(
          "This email is already registered in our online banking portal. Please log in to your account."
        );
        return true; // Prevent OTP sending
      } else if (
        !bankData.emailExistsWithBankAccount &&
        authData.message === "Email does not exist"
      ) {
        // Email does not exist in both systems
        setEmailError(
          "This email is not associated with our bank. Please open a bank account first."
        );
        return true; // Prevent OTP sending
      } else {
        // Default case: unexpected response
        setEmailError("An unexpected error occurred. Please try again.");
        return true; // Prevent OTP sending
      }
    } catch (error) {
      setEmailError("Error checking email. Please try again.");
      return true; // Prevent OTP sending on error
    }
  };

  // Handle sending OTP for registration
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setEmailError(""); // Clear any existing email error
    setOtpError("");
    setOtpMessage("");

    // Check if email conditions are satisfied
    const shouldPreventOtp = await checkEmailConditions();
    if (shouldPreventOtp) {
      return; // Prevent proceeding if OTP should not be sent
    }

    setIsLoading(true); // Show the spinner while sending OTP

    try {
      const response = await fetch("http://192.168.4.170:8090/api/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          message: "Please use this OTP for completing your registration.",
          subject: "Your OTP for Registration",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setOtpSentMessage(data.message || "OTP sent successfully!");
        setStep("verifyOtp");
      } else {
        throw new Error(data.error || "Error sending OTP");
      }
    } catch (error) {
      setOtpError(error.message);
    } finally {
      setIsLoading(false); // Hide the spinner after OTP is sent or an error occurs
    }
  };

  // Handle verifying OTP for registration
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError(""); // Clear any existing error
    setOtpMessage("");
    setIsLoading(true); // Show the spinner while verifying OTP

    try {
      const response = await fetch("http://192.168.4.170:8090/api/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await response.json();
      if (response.ok && data.message === "OTP verified") {
        setOtpMessage("OTP verified successfully.");
        setStep("register");
        setOtpSentMessage(""); // Clear OTP sent message once verified
      } else {
        throw new Error(data.message || "Invalid OTP");
      }
    } catch (error) {
      setOtpError(error.message); // Set error message
      setOtpSentMessage(""); // Clear the OTP sent message on error
    } finally {
      setIsLoading(false); // Hide the spinner after verifying OTP
    }
  };

  return (
    <div>
      {/* Show the spinner while sending or verifying OTP */}
      {isLoading && <LoadingSpinner />}

      {!isLoading && step === "email" && (
        <RegisterEmailidInput
          email={formData.email}
          handleInputChange={handleInputChange}
          handleSendOtp={handleSendOtp}
          error={emailError || error} // Display email error if exists
          message={message}
          otpSentMessage={otpSentMessage}
        />
      )}

      {!isLoading && step === "verifyOtp" && (
        <OtpVerification
          email={formData.email}
          otp={otp}
          setOtp={setOtp}
          otpError={otpError}
          otpMessage={otpMessage}
          verifyOtp={handleVerifyOtp}
          otpSentMessage={otpError ? "" : otpSentMessage} // Show only one message at a time
        />
      )}

      {!isLoading && step === "register" && (
        <form onSubmit={handleRegister} className="auth-form">
          <h2>Register Your Account</h2>
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
              readOnly
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
          {/* <label>
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
          </label> */}
          <button type="submit">Register</button>

          {/* Show spinner when registering */}
          {showSpinner && <LoadingSpinner />}
        </form>
      )}
    </div>
  );
};

export default RegisterForm;
