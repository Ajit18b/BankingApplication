import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./AdminControlsAllAccountList.css"; // Optional CSS file for styling

const AdminControlsAllAccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  // Fetch account list when component mounts
  useEffect(() => {
    const fetchAccounts = async () => {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage

      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/admin/bank-accounts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Update state with account data
        setAccounts(response.data);
        setFilteredAccounts(response.data); // Initially, filtered accounts are the same as the fetched accounts
        setError(null);
      } catch (err) {
        console.error("Error fetching account list:", err);
        setError("Failed to load account list");
      }
    };

    fetchAccounts();
  }, []);

  // Filter accounts when the search term changes
  useEffect(() => {
    const results = accounts.filter((account) =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountNumber.includes(searchTerm)
    );
    setFilteredAccounts(results);
  }, [searchTerm, accounts]);

  // Generate PDF for individual account
  const generateIndividualPdf = (account) => {
    const doc = new jsPDF();
    doc.text("Account Details", 20, 10);

    doc.autoTable({
      startY: 20,
      margin: { left: 20 },
      body: [
        ["Name", account.name],
        ["Email", account.email],
        ["Account Number", account.accountNumber],
      ],
      theme: "grid", // Adding thin borders
    });

    doc.save(`Account_${account.accountNumber}.pdf`);
  };

  // Generate PDF for all accounts
  const generateAllAccountsPdf = () => {
    const doc = new jsPDF();
    doc.text("All Account Details", 20, 10);

    const bodyData = accounts.map((account) => [
      account.name,
      account.email,
      account.accountNumber,
    ]);

    doc.autoTable({
      head: [["Name", "Email", "Account Number"]],
      body: bodyData,
      margin: { left: 20 },
      theme: "grid", // Adding thin borders
    });

    doc.save("All_Accounts.pdf");
  };

  return (
    <div className="admin-account-list">
      <h1>List of Registered Bank Accounts</h1>
      <input
        type="text"
        placeholder="Search by name, email, or account number"
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
      />
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <table className="accounts-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Account Number</th>
                <th>Actions</th> {/* Add column for individual PDF download */}
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((account) => (
                  <tr key={account.id}>
                    <td>{account.id}</td>
                    <td>{account.name}</td>
                    <td>{account.email}</td>
                    <td>{account.accountNumber}</td>
                    <td>
                      {/* Button to download individual PDF */}
                      <button onClick={() => generateIndividualPdf(account)}>
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-results">
                    No matching accounts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Button to download all accounts PDF */}
          {filteredAccounts.length > 0 && (
            <button onClick={generateAllAccountsPdf} className="download-all-button">
              Download All Accounts as PDF
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default AdminControlsAllAccountList;
