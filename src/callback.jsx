import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Callback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const exchangeCodeForToken = async (code) => {
      try {
        const VITE_COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;
        const VITE_COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
        const VITE_COGNITO_REDIRECT_URI = import.meta.env
          .VITE_COGNITO_REDIRECT_URI;
        const client_secret = "rangeforce-secret";

        const params = new URLSearchParams();
        params.append("grant_type", "authorization_code");
        params.append("client_id", VITE_COGNITO_CLIENT_ID);
        params.append("code", code);
        params.append("redirect_uri", VITE_COGNITO_REDIRECT_URI);
        params.append("client_secret", client_secret);

        const response = await axios.post(
          `https://${VITE_COGNITO_DOMAIN}/token`,
          params,
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );
        if (response.ok) {
          console.log("token valid");
        }

        // Store tokens securely (e.g., localStorage for this demo)
        localStorage.setItem("id_token", response.data.id_token);
        localStorage.setItem("access_token", response.data.access_token);

        navigate("/dashboard");
      } catch (error) {
        console.error("Error exchanging code for token:", error);
        navigate("/");
      }
    };

    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");

    if (code) {
      exchangeCodeForToken(code);
    }
  }, [location, navigate]);

  return (
    <div className="auth-container">
      <p>Loading...</p>
    </div>
  );
};

export default Callback;
