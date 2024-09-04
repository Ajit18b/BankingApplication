import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Ensure jwtDecode is correctly imported
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState({});
  const [sessionTimeLeft, setSessionTimeLeft] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        const userDetails = {
          email: decodedToken.sub,
          userType: decodedToken.userType,
          fullName: decodedToken.fullName,
        };

        setUser(userDetails);

        if (decodedToken.exp) {
          const expirationTime = new Date(decodedToken.exp * 1000);

          const updateSessionTimeLeft = () => {
            const currentTime = new Date();
            const timeLeft = expirationTime - currentTime;

            if (timeLeft > 0) {
              const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
              const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
              const seconds = Math.floor((timeLeft / 1000) % 60);
              setSessionTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
            } else {
              setSessionTimeLeft("Session expired");
              clearInterval(timerId);
            }
          };

          updateSessionTimeLeft();

          const timerId = setInterval(updateSessionTimeLeft, 1000);

          return () => clearInterval(timerId);
        }
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    }
  }, []);

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <table className="profile-table">
        <tbody>
          <tr>
            <td>
              <strong>User Name:</strong>
            </td>
            <td>{user.fullName || "Not available"}</td>
          </tr>
          <tr>
            <td>
              <strong>Email:</strong>
            </td>
            <td>{user.email || "Not available"}</td>
          </tr>
          <tr>
            <td>
              <strong>User Type:</strong>
            </td>
            <td>{user.userType || "Not available"}</td>
          </tr>
          <tr>
            <td>
              <strong>Session Time Left:</strong>
            </td>
            <td>{sessionTimeLeft || "Not available"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Profile;
