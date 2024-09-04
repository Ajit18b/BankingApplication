// LoadingSpinner.js
import React from "react";
import "./LoadingSpinner.css"; // Make sure to create this CSS file

const LoadingSpinner = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
