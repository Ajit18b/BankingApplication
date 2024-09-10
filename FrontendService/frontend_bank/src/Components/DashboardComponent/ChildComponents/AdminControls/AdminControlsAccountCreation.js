import React, { useState } from "react";
import "./AdminControlsAccountCreation.css"; // Optional CSS file for styling
import axios from "axios"; // Import axios for making HTTP requests
import jsPDF from "jspdf"; // Import jsPDF for generating PDFs

const AdminControlsAccountCreation = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState(""); // New state for name
  const [responseData, setResponseData] = useState(null); // To store response data
  const [responseMessage, setResponseMessage] = useState("");
  const [isError, setIsError] = useState(false); // To track if the response is an error
  const [newApiResponse, setNewApiResponse] = useState(null); // New state for second API response

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Retrieve the token from local storage
    const token = localStorage.getItem("token");
    console.log("Token:", token); // Debug: Check token

    try {
      // First API call for account registration
      const response = await axios.post(
        "http://localhost:8080/api/v1/admin/register-bank-account",
        { email, name }, // Include name in the payload
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Handle the successful response
      const accountNumber = response.data.accountNumber; // Extract account number from response
      setResponseData(response.data); // Save the response data
      setResponseMessage("Account registered successfully!");
      setIsError(false);

      // Register with the new API
      if (accountNumber) {
        await registerAccountWithNewApi(accountNumber);
      }

      // Generate PDF certificate
      generatePDF(response.data);
    } catch (error) {
      console.error("Error details:", error);

      if (error.response) {
        const { status, data } = error.response;
        console.error(`Error response status: ${status}`, data);

        setResponseMessage(
          data.message ||
            `Error: ${status} Email and account number already registered`
        );
        setIsError(true);
        setResponseData(null); // Clear the response data in case of an error
      } else if (error.request) {
        setResponseMessage("No response received from the server");
        setIsError(true);
      } else {
        setResponseMessage(`An unexpected error occurred: ${error.message}`);
        setIsError(true);
      }
    }
  };

  // Function to generate and download PDF
  const generatePDF = (data) => {
    if (!data) {
      console.error("No data available for PDF generation");
      return;
    }

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Certificate of Account Creation", 105, 20, { align: "center" });

    // Add a border around the certificate with a thinner line
    doc.setLineWidth(0.5); // Thinner line
    doc.rect(10, 10, 190, 160); // Adjust height to fit new content

    // Add certificate text
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(
      "This is to certify that the following account has been successfully created:",
      20,
      40
    );

    // Table positions
    const startX = 20;
    const startY = 50;
    const rowHeight = 10;
    const columnWidth = 80;
    const borderWidth = 0.2; // Thin border

    // Draw table header for "Account Details"
    doc.setFont("helvetica", "bold");
    doc.setLineWidth(borderWidth);

    const totalWidth = 2 * columnWidth; // Total width of the table
    const headerText = "Account Details";
    const textWidth = doc.getTextWidth(headerText);
    const headerX = startX + (totalWidth - textWidth) / 2; // Center text in the cell

    doc.rect(startX, startY, totalWidth, rowHeight); // Single cell border
    doc.text(headerText, headerX, startY + 7); // Center text in the cell

    // Draw table rows for fields
    doc.setFont("helvetica", "normal");

    const fields = [
      { name: "Name", value: data.name || "N/A" },
      { name: "Email", value: data.email || "N/A" },
      { name: "Account Number", value: data.accountNumber || "N/A" },
      { name: "IFSC CODE", value: "GRM006038" }, // IFSC Code
      { name: "Sequence ID", value: data.id || "N/A" },
    ];

    fields.forEach((field, index) => {
      const y = startY + (index + 1) * rowHeight;
      doc.setLineWidth(borderWidth);
      doc.rect(startX, y, columnWidth, rowHeight); // Cell border
      doc.setFont("helvetica", "bold");
      doc.text(field.name, startX + 2, y + 7); // Adjust text position

      doc.rect(startX + columnWidth, y, columnWidth, rowHeight); // Cell border
      doc.setFont("helvetica", "normal");
      doc.text(String(field.value), startX + columnWidth + 2, y + 7); // Convert value to string
    });

    // Add space for issuer details
    doc.setFontSize(12);

    // Format date and time with AM/PM
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(now);

    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const milliseconds = now.getMilliseconds().toString().padStart(3, "0");
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 24-hour time to 12-hour time

    const formattedTime = `${formattedHours}:${minutes}:${seconds}.${milliseconds} ${period}`;
    const formattedDateTime = `${formattedDate} ${formattedTime}`;

    doc.text(
      `Issued on: ${formattedDateTime}`,
      20,
      startY + (fields.length + 1) * rowHeight + 10
    );

    // Add space for signature and stamp
    const signatureY = startY + (fields.length + 2) * rowHeight + 30;
    const stampY = signatureY + 10; // Ensure the stamp is below the signature space

    doc.setFont("helvetica", "normal");
    doc.text("Issuer Signature:", 20, signatureY);
    doc.text("____________________", 60, signatureY); // Underline space for signature

    doc.text("Stamp:", 20, stampY);
    doc.text("____________________", 60, stampY); // Underline space for stamp

    // Save the PDF
    doc.save("account_creation_certificate.pdf");
  };

  const registerAccountWithNewApi = async (accountNumber) => {
    try {
      const response = await axios.post(
        "http://localhost:8100/api/accounts/register",
        { accountNumber },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle the successful response
      setNewApiResponse(response.data); // Save the response data
    } catch (error) {
      console.error("Error details:", error);
      // Handle errors as needed
      setNewApiResponse(null);
    }
  };

  return (
    <div className="admin-controls">
      <h1>Generate New Customer Account</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <button type="submit">Generate Bank Account</button>
      </form>
      {responseMessage && (
        <div className={`response-message ${isError ? "error" : "success"}`}>
          {responseMessage}

          {/* Display the response data in a vertical table if available */}
          {responseData && (
            <table className="response-table">
              <tbody>
                <tr>
                  <td>ID</td>
                  <td>{responseData.id}</td>
                </tr>
                <tr>
                  <td>Name</td>
                  <td>{responseData.name}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{responseData.email}</td>
                </tr>
                <tr>
                  <td>Account Number</td>
                  <td>{responseData.accountNumber}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )}
      {newApiResponse && (
        <div className="new-api-response">
          <h3>New API Response</h3>
          <pre>{JSON.stringify(newApiResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default AdminControlsAccountCreation;
