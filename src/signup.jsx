import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// V6 CHANGE: Import signUp and confirmSignUp
import { signUp, confirmSignUp } from "aws-amplify/auth";
import "./login.css"; // Reusing the login page styles

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // This state will control which form we show: sign-up or confirmation
  const [isAwaitingConfirmation, setIsAwaitingConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { nextStep } = await signUp({
        username: email, // In Cognito, the username is often the email
        password,
        options: {
          userAttributes: {
            email, // This makes sure the email attribute is also set
          },
        },
      });

      console.log("Sign-up result:", nextStep);

      // Check if the next step is to confirm the sign-up
      if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        setIsAwaitingConfirmation(true);
      } else {
        // This case is unlikely with default settings but good to handle
        setError("An unexpected error occurred during sign-up.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmation = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await confirmSignUp({
        username: email,
        confirmationCode,
      });
      // On success, redirect the user to the login page to sign in
      alert("Account confirmed successfully! Please sign in.");
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="background-customizable">
      {!isAwaitingConfirmation ? (
        // === SIGN-UP FORM ===
        <div>
          <h2
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              fontSize: "22px",
            }}
          >
            Create an Account
          </h2>
          {error && <div className="errorMessage-customizable">{error}</div>}
          <form onSubmit={handleSignUp}>
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
            <button
              type="submit"
              disabled={loading}
              className="submitButton-customizable"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        </div>
      ) : (
        // === CONFIRMATION FORM ===
        <div>
          <h2
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              fontSize: "22px",
            }}
          >
            Verify Your Account
          </h2>
          <p
            style={{
              textAlign: "center",
              marginBottom: "1rem",
              fontSize: "14px",
            }}
          >
            A confirmation code has been sent to <strong>{email}</strong>.
          </p>
          {error && <div className="errorMessage-customizable">{error}</div>}
          <form onSubmit={handleConfirmation}>
            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="confirmationCode" className="label-customizable">
                Confirmation Code
              </label>
              <input
                id="confirmationCode"
                type="text"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                className="inputField-customizable"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="submitButton-customizable"
            >
              {loading ? "Verifying..." : "Confirm Account"}
            </button>
          </form>
        </div>
      )}

      <div className="redirect-customizable">
        <Link to="/" style={{ color: "#337ab7", textDecoration: "none" }}>
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUpPage;
