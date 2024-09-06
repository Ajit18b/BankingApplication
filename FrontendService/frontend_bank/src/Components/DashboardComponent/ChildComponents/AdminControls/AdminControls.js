import React, { useState } from "react";
import "./AdminControls.css"; // Optional CSS file for styling
import axios from "axios"; // Import axios for making HTTP requests

const AdminControls = () => {
  const [email, setEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isError, setIsError] = useState(false); // To track if the response is an error

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Retrieve the token from local storage
    const token = localStorage.getItem("token");
    console.log("Token:", token); // Debug: Check token

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/admin/register-bank-account",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Handle the successful response
      setResponseMessage(
        `Account registered: ID ${response.data.id}, Email ${response.data.email}, Account Number ${response.data.accountNumber}`
      );
      setIsError(false);
    } catch (error) {
      console.error("Error details:", error); // Log the error details for debugging

      if (error.response) {
        const { status, data } = error.response;
        console.error(`Error response status: ${status}`, data); // Log response status and data

        // Display error message based on response data
        setResponseMessage(data.message || `Error: ${status}`);
        setIsError(true);
      } else {
        // Handle errors where error.response is undefined
        setResponseMessage("An unexpected error occurred");
        setIsError(true);
      }
    }
  };

  return (
    <div className="admin-controls">
      <h1>Welcome to the Admin Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register Bank Account</button>
      </form>
      {responseMessage && (
        <div className={`response-message ${isError ? "error" : "success"}`}>
          {responseMessage}
        </div>
      )}
    </div>
  );
};

export default AdminControls;
