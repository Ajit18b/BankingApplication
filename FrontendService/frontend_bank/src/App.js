import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthComponent from "./Auth/AuthComponent";
import Dashboard from "./Components/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthComponent />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
