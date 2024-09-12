import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Ensure correct import for jwt-decode
import "./BankAccountDetails.css";
import apiConfig from "../../../../apiConfig";

const BankAccountDetails = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);
  const [isUser, setIsUser] = useState(true);
  const [showBalance, setShowBalance] = useState(false);

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }

    const decodedToken = jwtDecode(token);
    const { sub, userType } = decodedToken;

    if (userType === "ADMIN") {
      setIsUser(false);
      return;
    }

    const fetchAccountDetails = async () => {
      try {
        const response = await axios.post(
          apiConfig.endpoints.userBankAccountNumber_Name_8080,
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

        const balanceResponse = await axios.get(
          `${apiConfig.endpoints.accountBalanceEnquary_8100}${response.data.accountNumber}`,
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
      <div className="admin-message-text">
        Hi Admin, please check all account details.
      </div>
    );
  }

  return (
    <div className="bank-account-details-container">
      {error ? (
        <p className="error-message-text">{error}</p>
      ) : account ? (
        <div className="account-details-wrapper">
          <h1>Bank Account Details</h1>
          <table className="account-details-table">
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
                  <strong>Account Type:</strong>
                </td>
                <td>SAVINGS</td>
              </tr>
              <tr>
                <td>
                  <strong>Account Balance:</strong>
                </td>
                <td className="table-cell">
                  {balance !== null ? (
                    <>
                      {showBalance ? `₹${balance}` : "•••••••••"}
                      <button
                        onClick={toggleBalanceVisibility}
                        className="eye-icon-button"
                      >
                        {showBalance ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </>
                  ) : (
                    "Loading..."
                  )}
                </td>
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
