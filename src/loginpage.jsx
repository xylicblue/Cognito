import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// V6 CHANGE: Import both signIn and confirmSignIn
import { signIn, confirmSignIn } from "aws-amplify/auth";
import { Link } from "react-router-dom";
import "./login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAwaitingNewPassword, setIsAwaitingNewPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    // If we're already in the "new password" step, call that handler instead
    if (isAwaitingNewPassword) {
      await handleNewPasswordSubmit();
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await signIn({ username: email, password });

      if (result.nextStep.signInStep === "DONE") {
        navigate("/dashboard");
      } else if (
        result.nextStep.signInStep ===
        "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        // This is the key state we need to handle
        console.log("User must set a new password.");
        setIsAwaitingNewPassword(true); // Change the UI to the "new password" form
      } else {
        setError("An unexpected sign-in step occurred.");
        console.log("Unhandled sign-in step:", result.nextStep.signInStep);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPasswordSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      // Use confirmSignIn to submit the new password
      await confirmSignIn({ challengeResponse: newPassword });
      navigate("/dashboard"); // Success!
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="background-customizable">
      <h2
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          fontSize: "22px",
        }}
      >
        {isAwaitingNewPassword ? "Create New Password" : "Sign In"}
      </h2>
      {error && <div className="errorMessage-customizable">{error}</div>}

      <form onSubmit={handleSignIn}>
        {!isAwaitingNewPassword ? (
          // === STANDARD LOGIN FORM ===
          <>
            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="email" className="label-customizable">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="inputField-customizable"
                required
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="password" className="label-customizable">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="inputField-customizable"
                required
              />
            </div>
          </>
        ) : (
          // === NEW PASSWORD FORM ===
          <div style={{ marginBottom: "1rem" }}>
            <p
              style={{ fontSize: "14px", color: "#555", marginBottom: "1rem" }}
            >
              For security, you must create a new password.
            </p>
            <label htmlFor="newPassword" className="label-customizable">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="inputField-customizable"
              required
            />
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="submitButton-customizable"
        >
          {loading
            ? "Processing..."
            : isAwaitingNewPassword
            ? "Set Password and Sign In"
            : "Sign In"}
        </button>
      </form>
      <div className="redirect-customizable">
        Don't have an account?{" "}
        <Link
          to="/signup"
          style={{
            color: "#337ab7",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
