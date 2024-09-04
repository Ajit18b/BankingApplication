import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Components/DashboardComponent/Dashboard";
import AuthComponent from "./Auth/AuthComponent";
import Home from "./Components/DashboardComponent/ChildComponents/Home/Home";
import Profile from "./Components/DashboardComponent/ChildComponents/Profile/Profile";
import AdminControls from "./Components/DashboardComponent/ChildComponents/AdminControls/AdminControls";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthComponent />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={["USER", "ADMIN"]}>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="home" element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route
            path="admin"
            element={
              <PrivateRoute allowedRoles={["ADMIN"]}>
                <AdminControls />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
