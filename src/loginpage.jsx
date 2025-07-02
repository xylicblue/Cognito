import React from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  // --- CONFIGURE THIS PER APP ---
  const VITE_COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;
  const VITE_COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
  const VITE_COGNITO_REDIRECT_URI = import.meta.env.VITE_COGNITO_REDIRECT_URI;
  // -----------------------------

  const loginUrl = `https://${VITE_COGNITO_DOMAIN}/oauth2/authorize?response_type=code&client_id=${VITE_COGNITO_CLIENT_ID}&redirect_uri=${VITE_COGNITO_REDIRECT_URI}&scope=email+openid+profile`;

  return (
    <div className="auth-container">
      <h1 className="auth-title">Welcome</h1>
      <a
        href={loginUrl}
        className="auth-button"
        style={{ textAlign: "center", textDecoration: "none" }}
      >
        Sign In
      </a>
      <div className="redirect-link">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
};

export default LoginPage;
