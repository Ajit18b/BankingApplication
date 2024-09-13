// LoadingSpinner.js

import React from "react";
import "./LoadingSpinner.css"; // Import the CSS file for styling

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
