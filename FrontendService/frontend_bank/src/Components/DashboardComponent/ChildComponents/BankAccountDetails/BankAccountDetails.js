import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./BankAccountDetails.css";

const BankAccountDetails = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null); // New state for account balance
  const [error, setError] = useState(null);
  const [isUser, setIsUser] = useState(true); // Assume user by default, adjust if needed

  useEffect(() => {
    // Retrieve and decode the token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }

    const decodedToken = jwtDecode(token);
    const { sub, userType } = decodedToken;

    // Check if the user is an ADMIN
    if (userType === "ADMIN") {
      setIsUser(false);
      return;
    }

    // Fetch account details for users
    const fetchAccountDetails = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/v1/user/account",
          { email: sub },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setAccount(response.data);
        setError(null);

        // Fetch the account balance using the account number
        const balanceResponse = await axios.get(
          `http://localhost:8100/api/accounts/${response.data.accountNumber}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBalance(balanceResponse.data.totalAmount);
      } catch (err) {
        console.error("Error fetching account details:", err);
        setError("Failed to load account details");
      }
    };

    fetchAccountDetails();
  }, []);

  if (!isUser) {
    return (
      <div className="message">Hi Admin, please check all account details.</div>
    );
  }

  return (
    <div className="bank-account-details">
      {error ? (
        <p className="error-message">{error}</p>
      ) : account ? (
        <div className="account-details">
          <h1>Bank Account Details</h1>
          <table className="account-table">
            <tbody>
              <tr>
                <td>
                  <strong>Name:</strong>
                </td>
                <td>{account.name}</td>
              </tr>
              <tr>
                <td>
                  <strong>Account Number:</strong>
                </td>
                <td>{account.accountNumber}</td>
              </tr>
              <tr>
                <td>
                  <strong>IFSC Code:</strong>
                </td>
                <td>GRM006038</td>
              </tr>
              <tr>
                <td>
                  <strong>Account Balance:</strong>
                </td>
                <td>{balance !== null ? `₹${balance}` : "Loading..."}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BankAccountDetails;
