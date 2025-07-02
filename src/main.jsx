import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { Amplify } from "aws-amplify";

//
// === THE FIX IS HERE ===
//
// In Amplify v6, the configuration is more specific.
// We nest our User Pool details inside an "Auth.Cognito" object.
// We also rename "userPoolWebClientId" to "userPoolClientId".
//
Amplify.configure({
  Auth: {
    // THIS IS THE NEW REQUIRED NESTING
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      // NOTE THE RENAMED KEY!
      userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
    },
  },
});
//
// === END OF FIX ===
//

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
