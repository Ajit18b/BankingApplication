import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./TransactionDetails.css";
import apiConfig from "../../../../apiConfig";

const TransactionDetails = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState(null);
  const [accountNumber, setAccountNumber] = useState(""); // Set this with actual account number
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transactionType, setTransactionType] = useState("ALL"); // ALL, CREDIT, DEBIT

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
          apiConfig.endpoints.userBankAccountNumber_Name_8080,
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
    const fetchFilteredTransactions = (transactions) => {
      return transactions.filter((txn) => {
        const txnDate = new Date(txn.date);
        const start = startDate
          ? new Date(startDate + "T00:00:00")
          : new Date(0); // Start of the day for startDate
        const end = endDate ? new Date(endDate + "T23:59:59") : new Date(); // End of the day for endDate

        const isWithinDateRange = txnDate >= start && txnDate <= end;

        const isMatchingType =
          transactionType === "ALL" || txn.type === transactionType;

        return isWithinDateRange && isMatchingType;
      });
    };

    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `${apiConfig.endpoints.userTransactionDetails_8100 + accountNumber}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const sortedTransactions = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        // Apply filters (date and type)
        const filteredTransactions =
          fetchFilteredTransactions(sortedTransactions);

        setTransactions(filteredTransactions);

        // Calculate total amount for the filtered transactions
        const total = filteredTransactions.reduce((sum, txn) => {
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
  }, [accountNumber, startDate, endDate, transactionType]);

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
          <div className="filter-section">
            <div className="date-filter">
              <label>Start Date: </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <label>End Date: </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="type-filter">
              <label>Transaction Type: </label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
              >
                <option value="ALL">All</option>
                <option value="CREDIT">Credit</option>
                <option value="DEBIT">Debit</option>
              </select>
            </div>
          </div>

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
