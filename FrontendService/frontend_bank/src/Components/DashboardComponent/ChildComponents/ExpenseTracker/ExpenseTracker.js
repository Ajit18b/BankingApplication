import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chart, registerables } from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import { jwtDecode } from "jwt-decode";
import apiConfig from "../../../../apiConfig";
import "./ExpenseTracker.css";

Chart.register(...registerables);

const ExpenseTracker = () => {
  const [transactions, setTransactions] = useState([]);
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
        const isWithinDateRange =
          (!startDate || txnDate >= new Date(startDate)) &&
          (!endDate || txnDate <= new Date(endDate));

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
        setError(null);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions");
      }
    };

    fetchTransactions();
  }, [accountNumber, startDate, endDate, transactionType]);

  const getChartData = () => {
    const labels = transactions.map((txn) => txn.date.split("T")[0]);
    const creditData = transactions
      .filter((txn) => txn.type === "CREDIT")
      .map((txn) => txn.amount);
    const debitData = transactions
      .filter((txn) => txn.type === "DEBIT")
      .map((txn) => -txn.amount);

    return {
      labels,
      datasets: [
        {
          label: "Credit Transactions",
          data: creditData,
          borderColor: "green",
          backgroundColor: "rgba(0, 255, 0, 0.2)",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Debit Transactions",
          data: debitData,
          borderColor: "red",
          backgroundColor: "rgba(255, 0, 0, 0.2)",
          borderWidth: 2,
          fill: false,
        },
      ],
    };
  };

  const getPieChartData = () => {
    const totalCredit = transactions
      .filter((txn) => txn.type === "CREDIT")
      .reduce((acc, txn) => acc + txn.amount, 0);
    const totalDebit = transactions
      .filter((txn) => txn.type === "DEBIT")
      .reduce((acc, txn) => acc + txn.amount, 0);

    return {
      labels: ["Credit", "Debit"],
      datasets: [
        {
          label: "Credit vs Debit",
          data: [totalCredit, totalDebit],
          backgroundColor: ["rgba(0, 255, 0, 0.7)", "rgba(255, 0, 0, 0.7)"],
          hoverBackgroundColor: [
            "rgba(0, 255, 0, 0.9)",
            "rgba(255, 0, 0, 0.9)",
          ],
          borderColor: ["green", "red"],
          borderWidth: 2,
        },
      ],
    };
  };

  const totalCredit = transactions
    .filter((txn) => txn.type === "CREDIT")
    .reduce((acc, txn) => acc + txn.amount, 0);
  const totalDebit = transactions
    .filter((txn) => txn.type === "DEBIT")
    .reduce((acc, txn) => acc + txn.amount, 0);

  return (
    <div className="expense-tracker">
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <h1>Expense Tracker</h1>
          <div className="filter-section">
            <div className="date-filter">
              <label>Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <label>End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="type-filter">
              <label>Transaction Type:</label>
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

          <div className="chart-container">
            <Line
              data={getChartData()}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  tooltip: {
                    callbacks: {
                      label: function (tooltipItem) {
                        return `₹${tooltipItem.raw}`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Date",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Amount",
                    },
                  },
                },
              }}
            />
          </div>

          {/* Pie Chart Section */}
          <div className="overall-section">
            <h2>Overall Credit vs Debit</h2>
            <div className="pie-chart-container">
              <Pie
                data={getPieChartData()}
                options={{
                  responsive: true,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          const label = context.label || "";
                          const value = context.raw || 0;

                          // Add negative sign for debit transactions
                          const formattedValue =
                            label === "Debit"
                              ? `-₹${value.toFixed(2)}`
                              : `₹${value.toFixed(2)}`;

                          return `${label}: ${formattedValue}`;
                        },
                      },
                    },
                    legend: {
                      display: false, // Disable default legend
                    },
                  },
                }}
              />
              <div className="legend-container">
                <div className="legend-item">
                  <span className="color-box green"></span>
                  <span>Credit: ₹{totalCredit.toFixed(2)}</span>
                </div>
                <div className="legend-item">
                  <span className="color-box red"></span>
                  <span>Debit: -₹{totalDebit.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExpenseTracker;
