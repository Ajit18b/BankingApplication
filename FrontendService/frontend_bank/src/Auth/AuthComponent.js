import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailInput from "./AuthSubComponent/EmailInput";
import OtpVerification from "./AuthSubComponent/OtpVerification";
import PasswordLogin from "./AuthSubComponent/PasswordLogin";
import AuthToggle from "./AuthSubComponent/AuthToggle";
import RegisterForm from "./AuthSubComponent/RegisterForm";
import SuccessPopup from "./../Utils/SuccessPopup"; // Import the SuccessPopup component
import LoadingSpinner from "./../Utils/LoadingSpinner"; // Import the LoadingSpinner component
import "./AuthComponent.css";
import apiConfig from "../apiConfig";

const AuthComponent = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    userType: "user",
  });

  const [loginError, setLoginError] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [showSpinner, setShowSpinner] = useState(false); // State to control spinner visibility

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }

    const handlePopState = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/", { replace: true });
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(
        apiConfig.endpoints.userEmailCheckForAccountLogin_8080,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      return response.ok && data.message === "Email exists";
    } catch (err) {
      console.error("Error checking email existence:", err);
      return false;
    }
  };

  const handleOtpRequest = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginMessage("");
    setShowSpinner(true); // Show spinner

    try {
      const emailExists = await checkEmailExists(formData.email);

      if (!emailExists) {
        setLoginError("Account not found. Please register first.");
        setShowSpinner(false); // Hide spinner
        return;
      }

      const response = await fetch(apiConfig.endpoints.sendOtpRequest_8090, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          message: "Please use this OTP for logging into your account.",
          subject: "Your OTP for Login",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setOtpMessage(
        data.message || "OTP Sent Successfully Please Check Your Email"
      );
      setOtpSent(true); // Move to OTP verification after successfully sending OTP
    } catch (err) {
      setLoginError(err.message || "Failed to send OTP");
    } finally {
      setShowSpinner(false); // Hide spinner
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setOtpError("");
    setOtpMessage("");
    setShowSpinner(true); // Show spinner during OTP verification

    try {
      const response = await fetch(apiConfig.endpoints.verifyOtpRequest_8090, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: otp,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.message !== "OTP verified") {
        setOtpError(data.message || "Failed to verify OTP");
        return;
      }

      setOtpMessage(data.message || "OTP verified");
      setOtpVerified(true);
    } catch (err) {
      setOtpError(err.message || "Failed to verify OTP");
    } finally {
      setShowSpinner(false); // Hide spinner after verification
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginMessage("");
    setShowSpinner(true); // Show spinner

    try {
      const response = await fetch(apiConfig.endpoints.userSignInRequest_8080, {
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
        throw new Error(`Invalid Password`);
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      setLoginMessage("Login successful. Redirecting...");
      navigate("/home", { replace: true });
    } catch (err) {
      setLoginError(err.message || "Failed to login");
    } finally {
      setShowSpinner(false); // Hide spinner
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterMessage("");
    setShowSpinner(true); // Show spinner

    try {
      const response = await fetch(apiConfig.endpoints.userSignUpRequest_8080, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 409) {
        setRegisterError("User with this email already exists");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setRegisterMessage("Registration successful.");
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        userType: "user",
      });

      // Show success popup and redirect to login after 1 second
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setOtpSent(false);
        setOtpVerified(false);
        setIsLogin(true); // Switch to login view
      }, 1000);
    } catch (err) {
      setRegisterError(err.message || "Failed to register");
    } finally {
      setShowSpinner(false); // Hide spinner
    }
  };

  return (
    <div className="auth-container">
      <h4 className="styled-heading">BANK-X</h4>
      <h4 className="styled-heading">ONLINE BANKING PORTAL</h4>
      {showPopup && (
        <SuccessPopup
          message="Registration successful!"
          onClose={() => setShowPopup(false)}
        />
      )}
      {showSpinner && <LoadingSpinner />} {/* Show spinner if loading */}
      <AuthToggle isLogin={isLogin} setIsLogin={setIsLogin} />
      {isLogin ? (
        otpVerified ? (
          <PasswordLogin
            formData={formData}
            handleInputChange={handleInputChange}
            handleLogin={handleLogin}
            error={loginError}
            message={loginMessage}
          />
        ) : otpSent ? (
          <OtpVerification
            email={formData.email}
            otp={otp}
            setOtp={setOtp}
            otpError={otpError}
            otpMessage={otpMessage}
            verifyOtp={verifyOtp}
          />
        ) : (
          <EmailInput
            email={formData.email}
            handleInputChange={handleInputChange}
            handleOtpRequest={handleOtpRequest}
            error={loginError}
            message={loginMessage}
          />
        )
      ) : (
        <RegisterForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleRegister={handleRegister}
          error={registerError}
          message={registerMessage}
        />
      )}
    </div>
  );
};

export default AuthComponent;
