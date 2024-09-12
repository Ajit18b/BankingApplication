import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import "./MoneyTransfer.css";
import apiConfig from "../../../../apiConfig";

const MoneyTransfer = () => {
  const [myAccount, setMyAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const [receiverAccount, setReceiverAccount] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [transferType, setTransferType] = useState("otherBank"); // Default transfer type is to other bank

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }

    const decodedToken = jwtDecode(token);
    const { sub } = decodedToken;

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
        setMyAccount(response.data.accountNumber);
        setError(null);
      } catch (err) {
        console.error("Error fetching account details:", err);
        setError("Failed to load account details");
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
      // Format for same bank transfer
      description =
        `ACC TRANSFER TO ${accountHolderName} ${receiverAccount} FROM ${myAccount}`
          .slice(0, 50)
          .toUpperCase();
    } else {
      // Format for other bank transfer
      description =
        `ACC TRANSFER TO ${accountHolderName} ${receiverAccount} ${ifscCode}`
          .slice(0, 50)
          .toUpperCase();
    }

    try {
      // Debit the amount from the sender's account
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

      if (transferType === "sameBank") {
        // Credit the amount to the receiver's account
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
            // Handle account not found
            setError("Receiver account not found in the same bank");
            return;
          } else {
            console.error("Error processing credit transaction:", creditError);
            setError("Failed to credit the amount to the receiver's account.");
            return;
          }
        }
      }

      setResponse(debitResponse.data);
      setError(null);
    } catch (err) {
      console.error("Error processing the transaction:", err);
      setError("Transaction failed: Insufficient Account Balance");
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
      {error ? (
        <p className="error-message">{error}</p>
      ) : response ? (
        <div className="transaction-details">
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
        <form className="transfer-form" onSubmit={handleTransfer}>
          <h1>Money Transfer</h1>

          <div>
            <label>
              <input
                type="radio"
                value="otherBank"
                checked={transferType === "otherBank"}
                onChange={() => setTransferType("otherBank")}
              />
              Transfer to Other Bank
            </label>
            <label>
              <input
                type="radio"
                value="sameBank"
                checked={transferType === "sameBank"}
                onChange={() => setTransferType("sameBank")}
              />
              Transfer within Same Bank
            </label>
          </div>

          <label>
            Amount ₹ :
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              required
            />
            {validationErrors.amount && (
              <p className="validation-error">{validationErrors.amount}</p>
            )}
          </label>

          <label>
            Receiver Account Number:
            <input
              type="text"
              value={receiverAccount}
              onChange={(e) => setReceiverAccount(e.target.value)}
              required
            />
            {validationErrors.receiverAccount && (
              <p className="validation-error">
                {validationErrors.receiverAccount}
              </p>
            )}
          </label>

          <label>
            Receiver Account Holder Name:
            <input
              type="text"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              required
            />
            {validationErrors.accountHolderName && (
              <p className="validation-error">
                {validationErrors.accountHolderName}
              </p>
            )}
          </label>

          {transferType === "otherBank" && (
            <label>
              IFSC Code:
              <input
                type="text"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
                required
              />
              {validationErrors.ifscCode && (
                <p className="validation-error">{validationErrors.ifscCode}</p>
              )}
            </label>
          )}

          <button type="submit">Transfer Amount</button>
        </form>
      )}
    </div>
  );
};

export default MoneyTransfer;






 

