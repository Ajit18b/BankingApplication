import React, { useState } from "react";
import axios from "axios";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import "./AccountDeposit.css";
import apiConfig from "../../../../apiConfig";

const AccountDeposit = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [descriptionType, setDescriptionType] = useState("Cash Deposit");
  const [customDescription, setCustomDescription] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Validate form before submission
  const validateForm = () => {
    const accountNumberRegex = /^\d+$/; // Only numeric values
    let errors = {};

    if (!accountNumberRegex.test(accountNumber)) {
      errors.accountNumber = "Account number must be numeric";
    }

    if (parseFloat(amount) <= 0) {
      errors.amount = "Amount must be a positive number";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDeposit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const finalDescription =
      descriptionType === "OTHER" ? customDescription : descriptionType;

    try {
      const transactionResponse = await axios.post(
        apiConfig.endpoints.newCrediTransaction_8100,
        {
          accountNumber: accountNumber,
          amount: parseFloat(amount),
          type: "CREDIT",
          description: finalDescription,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setResponse(transactionResponse.data);
      setError(null);
    } catch (err) {
      console.error("Error processing the transaction:", err);
      setError("Transaction failed. Please check the details and try again.");
    }
  };

  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const generatePDF = () => {
    if (response) {
      const docDefinition = {
        content: [
          { text: "BankX Global PVT Ltd.", style: "header" },
          { text: "Deposit Receipt", style: "subheader" },
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
                ["Account Number:", response.bankAccount.accountNumber],
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
        .download(`deposit_receipt_${accountNumber}.pdf`);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="account-deposit">
      {error ? (
        <p className="error-message">{error}</p>
      ) : response ? (
        <div className="transaction-details">
          <h1>Deposit Successful</h1>
          <p>Transaction ID: {response.id}</p>
          <p>Account Number: {response.bankAccount.accountNumber}</p>
          <p>Amount: ₹{response.amount}</p>
          <p>Type: {response.type}</p>
          <p>Description: {response.description}</p>
          <p>Date: {response.date}</p>
          <button onClick={generatePDF}>Download Receipt</button>
        </div>
      ) : (
        <form className="deposit-form" onSubmit={handleDeposit}>
          <h1>Account Deposit</h1>

          <label>
            Account Number:
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
            />
            {validationErrors.accountNumber && (
              <p className="validation-error">
                {validationErrors.accountNumber}
              </p>
            )}
          </label>

          <label>
            Amount:
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
            Description:
            <select
              value={descriptionType}
              onChange={(e) => setDescriptionType(e.target.value)}
            >
              <option value="CASH DEPOSIT">Cash Deposit</option>
              <option value="NEFT">NEFT</option>
              <option value="RTGS">RTGS</option>
              <option value="CHEQUE DRAFT">Cheque</option>
              <option value="OTHER">Other</option>
            </select>
          </label>

          {descriptionType === "OTHER" && (
            <label>
              Custom Description:
              <input
                type="text"
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                required
              />
            </label>
          )}

          <button type="submit">Deposit</button>
        </form>
      )}
    </div>
  );
};

export default AccountDeposit;
