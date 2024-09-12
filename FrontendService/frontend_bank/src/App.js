import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Components/DashboardComponent/Dashboard";
import AuthComponent from "./Auth/AuthComponent";
import Home from "./Components/DashboardComponent/ChildComponents/Home/Home";
import Profile from "./Components/DashboardComponent/ChildComponents/Profile/Profile";
import AdminControlsAccountCreation from "./Components/DashboardComponent/ChildComponents/AdminControls/AdminControlsAccountCreation";
import PrivateRoute from "./PrivateRoute";
import AdminControlsAllAccountList from "./Components/DashboardComponent/ChildComponents/AdminControls/AdminControlsAllAccountList";
import BankAccountDetails from "./Components/DashboardComponent/ChildComponents/BankAccountDetails/BankAccountDetails";
import "./App.css";
import TransactionDetails from "./Components/DashboardComponent/ChildComponents/TransactionDetails/TransactionDetails";
import MoneyTransfer from "./Components/DashboardComponent/ChildComponents/MoneyTransfer/MoneyTransfer";
import AccountDeposit from "./Components/DashboardComponent/ChildComponents/AdminControls/AccountDeposit";
import { SidebarProvider } from "./Utils/SidebarContext";
import ExpenseTracker from "./Components/DashboardComponent/ChildComponents/ExpenseTracker/ExpenseTracker";

function App() {
  return (
    <SidebarProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthComponent />} />
          <Route
            path="/"
            element={
              <PrivateRoute allowedRoles={["USER", "ADMIN"]}>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/BankAccountDetails"
              element={<BankAccountDetails />}
            />
            <Route
              path="/TransactionDetails"
              element={<TransactionDetails />}
            />
            <Route path="/MoneyTransfer" element={<MoneyTransfer />} />
            <Route path="/ExpenseTracker" element={<ExpenseTracker />} />
            <Route
              path="/adminAccountCreation"
              element={
                <PrivateRoute allowedRoles={["ADMIN"]}>
                  <AdminControlsAccountCreation />
                </PrivateRoute>
              }
            />
            <Route
              path="/adminAccountAllAccountList"
              element={
                <PrivateRoute allowedRoles={["ADMIN"]}>
                  <AdminControlsAllAccountList />
                </PrivateRoute>
              }
            />
            <Route
              path="/accountDeposit"
              element={
                <PrivateRoute allowedRoles={["ADMIN"]}>
                  <AccountDeposit />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </SidebarProvider>
  );
}

export default App;
