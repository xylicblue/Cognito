import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// V6 CHANGE: Import specific functions
import { getCurrentUser, fetchUserAttributes, signOut } from "aws-amplify/auth";
import "./login.css"; // Re-using styles

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // V6 CHANGE: Call 'getCurrentUser' and 'fetchUserAttributes'
        const currentUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        setUser({ ...currentUser, attributes });
      } catch (error) {
        // If user is not authenticated, they will be redirected
        navigate("/");
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // V6 CHANGE: Call 'signOut' function directly
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (!user) {
    return (
      <div className="background-customizable">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="background-customizable">
      <h1
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          fontSize: "22px",
        }}
      >
        Welcome!
      </h1>
      <div style={{ marginBottom: "20px", lineHeight: "1.6" }}>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          {/* V6 CHANGE: Access attributes from the combined user object */}
          <strong>Email:</strong> {user.attributes.email}
        </p>
        <p>
          <strong>User ID (sub):</strong> {user.attributes.sub}
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="submitButton-customizable"
        style={{ backgroundColor: "#d9534f" }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
