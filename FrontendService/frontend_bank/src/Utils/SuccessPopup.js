// SuccessPopup.js
import React, { useEffect } from "react";
import "./SuccessPopup.css"; // Make sure to create this CSS file

const SuccessPopup = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 1000); // Display for 1 second

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default SuccessPopup;
