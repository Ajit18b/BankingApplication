import React from "react";

const AuthToggle = ({ isLogin, setIsLogin }) => (
  <div className="auth-toggle">
    <button
      onClick={() => setIsLogin(true)}
      className={isLogin ? "active" : ""}
    >
      Login
    </button>
    <button
      onClick={() => setIsLogin(false)}
      className={!isLogin ? "active" : ""}
    >
      Register
    </button>
  </div>
);

export default AuthToggle;
