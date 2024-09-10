import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./TransactionDetails.css";

const TransactionDetails = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState(null);
  const [accountNumber, setAccountNumber] = useState(""); // Set this with actual account number

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }

    const decodedToken = jwtDecode(token);
    const { sub } = decodedToken;

    const fetchAccountNumber = async () => {
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
        setAccountNumber(response.data.accountNumber);
      } catch (err) {
        console.error("Error fetching account details:", err);
        setError("Failed to load account details");
      }
    };

    fetchAccountNumber();
  }, []);

  useEffect(() => {
    if (!accountNumber) return;

    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8100/api/transactions/byAccountNumber/${accountNumber}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTransactions(response.data);

        // Calculate total amount
        const total = response.data.reduce((sum, txn) => {
          return txn.type === "CREDIT" ? sum + txn.amount : sum - txn.amount;
        }, 0);
        setTotalAmount(total);
        setError(null);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions");
      }
    };

    fetchTransactions();
  }, [accountNumber]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const downloadPDF = () => {
    const input = document.getElementById("transaction-table");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, -heightLeft, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`transaction-details-${accountNumber}.pdf`);
    });
  };

  return (
    <div className="transaction-details">
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <button onClick={downloadPDF} className="download-btn">
            Download Account Statement
          </button>
          <div className="transaction-list">
            <h1>Transaction Details</h1>
            <table id="transaction-table" className="transaction-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((txn) => (
                    <tr
                      key={txn.id}
                      style={{ color: txn.type === "CREDIT" ? "green" : "red" }}
                    >
                      <td>{`${formatDate(txn.date)} - ${txn.description}`}</td>
                      <td>{txn.type}</td>
                      <td>
                        {txn.type === "CREDIT"
                          ? `+₹${txn.amount}`
                          : `-₹${txn.amount}`}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No transactions found.</td>
                  </tr>
                )}
                <tr>
                  <td colSpan="2">
                    <strong>Total Amount:</strong>
                  </td>
                  <td>
                    <strong>₹{totalAmount}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionDetails;
