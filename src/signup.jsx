import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp, confirmSignUp } from "aws-amplify/auth";
import "./login.css"; // Import the new, shared stylesheet

const SignUpPage = () => {
  // All your existing state and logic remains the same...
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAwaitingConfirmation, setIsAwaitingConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { nextStep } = await signUp({
        username: email,
        password,
        options: { userAttributes: { email } },
      });
      if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        setIsAwaitingConfirmation(true);
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
      await confirmSignUp({ username: email, confirmationCode });
      alert("Account confirmed successfully! Please sign in.");
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">
        {isAwaitingConfirmation ? "Verify Your Account" : "Create an Account"}
      </h1>

      {error && <div className="error-message">{error}</div>}

      {!isAwaitingConfirmation ? (
        <form onSubmit={handleSignUp}>
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleConfirmation}>
          <p
            className="redirect-link"
            style={{ marginTop: 0, marginBottom: "1rem" }}
          >
            A confirmation code was sent to <strong>{email}</strong>.
          </p>
          <div className="input-group">
            <label htmlFor="confirmationCode" className="input-label">
              Confirmation Code
            </label>
            <input
              id="confirmationCode"
              type="text"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? "Verifying..." : "Verify Account"}
          </button>
        </form>
      )}

      <div className="redirect-link">
        Already have an account? <Link to="/">Sign In</Link>
      </div>
    </div>
  );
};

export default SignUpPage;
