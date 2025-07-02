import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Callback = () => {
  const [message, setMessage] = useState("Logging you in...");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");

    if (code) {
      const exchangeCodeForToken = async () => {
        try {
          // CORRECTED FOR VITE
          const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
          const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
          const redirectUri = import.meta.env.VITE_COGNITO_REDIRECT_URI;

          const tokenEndpoint = `https://${cognitoDomain}/oauth2/token`;
          const params = new URLSearchParams();
          params.append("grant_type", "authorization_code");
          params.append("client_id", clientId);
          params.append("code", code);
          params.append("redirect_uri", redirectUri);

          const response = await axios.post(tokenEndpoint, params, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          });

          localStorage.setItem("id_token", response.data.id_token);
          localStorage.setItem("access_token", response.data.access_token);

          navigate("/dashboard");
        } catch (error) {
          // --- NEW, MORE DETAILED ERROR LOGGING ---
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error(
              "Error exchanging code for token:",
              error.response.data
            );
            setMessage(
              `Login Error: ${
                error.response.data.error_description ||
                error.response.data.error
              }`
            );
          } else if (error.request) {
            // The request was made but no response was received
            console.error("No response received:", error.request);
            setMessage("Network error. Could not contact the server.");
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error setting up request:", error.message);
            setMessage("An unexpected error occurred.");
          }
          // --- END OF NEW LOGGING ---

          // Optionally, redirect back to login page after a delay
          setTimeout(() => navigate("/"), 5000); // Increased delay to read the error
        }
      };

      exchangeCodeForToken();
    } else {
      setMessage("Authentication failed. No authorization code found.");
      setTimeout(() => navigate("/"), 3000);
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-xl text-gray-700">{message}</p>
    </div>
  );
};

export default Callback;
