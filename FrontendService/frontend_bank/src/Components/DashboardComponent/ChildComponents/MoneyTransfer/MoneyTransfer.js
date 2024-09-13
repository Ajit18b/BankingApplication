import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Ensure jwt-decode is imported correctly
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import "./MoneyTransfer.css";
import apiConfig from "../../../../apiConfig";
import LoadingSpinner from "../../../../Utils/LoadingSpinner"; // Import the LoadingSpinner

const MoneyTransfer = () => {
  const [myAccount, setMyAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const [receiverAccount, setReceiverAccount] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [transferType, setTransferType] = useState("otherBank");
  const [loading, setLoading] = useState(false); // State for loading

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }

    const decodedToken = jwtDecode(token);
    const { sub } = decodedToken;

    const fetchAccountDetails = async () => {
      setLoading(true); // Set loading to true before API call
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
        setMyAccount(response.data.accountNumber);
        setError(null);
      } catch (err) {
        console.error("Error fetching account details:", err);
        setError("Failed to load account details");
      } finally {
        setLoading(false); // Set loading to false after API call
      }
    };

    fetchAccountDetails();
  }, []);

  const validateForm = () => {
    const accountNumberRegex = /^\d+$/;
    const ifscRegex = /^[A-Za-z0-9]+$/;
    const nameRegex = /^[A-Za-z\s]+$/;
    let errors = {};

    if (!accountNumberRegex.test(receiverAccount)) {
      errors.receiverAccount = "Receiver account number must be numeric";
    }

    if (!nameRegex.test(accountHolderName)) {
      errors.accountHolderName =
        "Account holder name must contain only letters";
    }

    if (transferType === "otherBank" && !ifscRegex.test(ifscCode)) {
      errors.ifscCode = "IFSC code must be alphanumeric";
    }

    if (parseFloat(amount) <= 0) {
      errors.amount = "Amount must be a positive number";
    }

    if (myAccount === receiverAccount) {
      errors.receiverAccount =
        "Sender and receiver account numbers must be different";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleTransfer = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    let description = "";

    if (transferType === "sameBank") {
      description =
        `ACC TRANSFER TO ${accountHolderName} ${receiverAccount} FROM ${myAccount}`
          .slice(0, 50)
          .toUpperCase();
    } else {
      description =
        `ACC TRANSFER TO ${accountHolderName} ${receiverAccount} ${ifscCode}`
          .slice(0, 50)
          .toUpperCase();
    }

    setLoading(true); // Set loading to true before API calls
    try {
      if (transferType === "sameBank") {
        try {
          await axios.post(
            apiConfig.endpoints.newCrediTransaction_8100,
            {
              accountNumber: receiverAccount,
              amount: parseFloat(amount),
              type: "CREDIT",
              description,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        } catch (creditError) {
          if (creditError.response && creditError.response.status === 404) {
            setError("Receiver account not found in the same bank");
            return;
          } else {
            console.error("Error processing credit transaction:", creditError);
            setError(
              "Transaction Failed , Please Check The Account Number or Account Details"
            );
            return;
          }
        }
      }

      try {
        const debitResponse = await axios.post(
          apiConfig.endpoints.newDebitTransaction_8100,
          {
            accountNumber: myAccount,
            amount: parseFloat(amount),
            type: "DEBIT",
            description,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setResponse(debitResponse.data);
        setError(null);
      } catch (err) {
        console.error("Error processing the transaction:", err);
        setError("Transaction failed: Insufficient Account Balance");
      }
    } catch (err) {
      console.error("Error processing the transaction:", err);
      setError("Transaction failed");
    } finally {
      setLoading(false); // Set loading to false after API calls
    }
  };

  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const generatePDF = () => {
    if (response) {
      const docDefinition = {
        content: [
          { text: "BankX Global PVT Ltd.", style: "header" },
          { text: "Transaction Receipt", style: "subheader" },
          {
            text: `Date: ${new Date().toLocaleDateString()}`,
            alignment: "right",
          },
          { text: " ", margin: [0, 10] },
          {
            style: "tableExample",
            table: {
              widths: ["*", "*"],
              body: [
                ["Transaction ID:", response.id],
                ["Sender Account Number:", myAccount],
                ["Receiver Account Number:", receiverAccount],
                ["Receiver Account Holder Name:", accountHolderName],
                ["Amount:", `₹${response.amount.toFixed(2)}`],
                ["Type:", response.type],
                ["Description:", response.description],
                ["Date:", response.date],
              ],
            },
            layout: "lightHorizontalLines",
          },
          { text: " ", margin: [0, 10] },
          { text: "Thank you for banking with us!", style: "footer" },
          {
            text: "If you have any questions, please contact us at: support@bankxglobal.com",
            style: "footer",
          },
        ],
        styles: {
          header: {
            fontSize: 22,
            bold: true,
            alignment: "center",
            margin: [0, 10],
          },
          subheader: {
            fontSize: 18,
            bold: true,
            alignment: "center",
            margin: [0, 10],
          },
          tableExample: { margin: [0, 5, 0, 15], fontSize: 12 },
          footer: {
            fontSize: 10,
            italics: true,
            alignment: "center",
            margin: [0, 10],
          },
        },
        defaultStyle: { columnGap: 20 },
      };

      pdfMake
        .createPdf(docDefinition)
        .download(`transaction_receipt_${myAccount}.pdf`);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="money-transfer">
      {loading ? (
        <LoadingSpinner /> // Show spinner when loading
      ) : error ? (
        <div className="error-message-container">
          <span className="error-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="100"
              height="100"
              fill="white"
            >
              <circle cx="12" cy="12" r="12" fill="#dc3545" />
              <line
                x1="6"
                y1="6"
                x2="18"
                y2="18"
                stroke="white"
                strokeWidth="2"
              />
              <line
                x1="18"
                y1="6"
                x2="6"
                y2="18"
                stroke="white"
                strokeWidth="2"
              />
            </svg>
          </span>
          <p className="error-message">{error}</p>
        </div>
      ) : response ? (
        <div className="transaction-details">
          <div className="success-icon-container">
            <div className="success-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="tick-icon"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="green"
                  fill="none"
                ></circle>
                <path d="M9 12l2 2 4-4" stroke="green" fill="none"></path>
              </svg>
            </div>
          </div>
          <h1>Transaction Successful</h1>
          <p>Transaction ID: {response.id}</p>
          <p>Sender Account Number: {myAccount}</p>
          <p>Receiver Account Number: {receiverAccount}</p>
          <p>Receiver Account Holder Name: {accountHolderName}</p>
          <p>Amount: ₹{response.amount}</p>
          <p>Type: {response.type}</p>
          <p>Description: {response.description}</p>
          <p>Date: {response.date}</p>
          <button onClick={generatePDF}>Download Receipt</button>
        </div>
      ) : (
        <form onSubmit={handleTransfer} className="transfer-form">
          <h2 className="form-title">Money Transfer</h2>
          <div className="form-group">
            <label htmlFor="receiverAccount">Receiver's Account Number</label>
            <input
              type="text"
              id="receiverAccount"
              value={receiverAccount}
              onChange={(e) => setReceiverAccount(e.target.value)}
              className={`form-input ${
                validationErrors.receiverAccount ? "error" : ""
              }`}
            />
            {validationErrors.receiverAccount && (
              <p className="error-text">{validationErrors.receiverAccount}</p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="accountHolderName">Account Holder's Name</label>
            <input
              type="text"
              id="accountHolderName"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              className={`form-input ${
                validationErrors.accountHolderName ? "error" : ""
              }`}
            />
            {validationErrors.accountHolderName && (
              <p className="error-text">{validationErrors.accountHolderName}</p>
            )}
          </div>
          {transferType === "otherBank" && (
            <div className="form-group">
              <label htmlFor="ifscCode">IFSC Code</label>
              <input
                type="text"
                id="ifscCode"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
                className={`form-input ${
                  validationErrors.ifscCode ? "error" : ""
                }`}
              />
              {validationErrors.ifscCode && (
                <p className="error-text">{validationErrors.ifscCode}</p>
              )}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="amount">Amount ₹ </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`form-input ${validationErrors.amount ? "error" : ""}`}
            />
            {validationErrors.amount && (
              <p className="error-text">{validationErrors.amount}</p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="transferType">Transfer Type</label>
            <select
              id="transferType"
              value={transferType}
              onChange={(e) => setTransferType(e.target.value)}
              className="form-select"
            >
              <option value="otherBank">Other Bank</option>
              <option value="sameBank">Same Bank</option>
            </select>
          </div>
          <button type="submit" className="submit-button">
            Transfer
          </button>
        </form>
      )}
    </div>
  );
};

export default MoneyTransfer;
