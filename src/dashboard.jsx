import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // You'll need to run: npm install jwt-decode
import "./login.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const course = {
    id: "CS101",
    name: "Introduction to Web Development",
    description: "Learn the fundamentals of modern web development.",
    site: "http://localhost:5174/",
  };
  const registrationUrl = `${course.site}/register?courseId=${
    course.id
  }&courseName=${encodeURIComponent(course.name)}`;
  useEffect(() => {
    const token = localStorage.getItem("id_token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    const VITE_COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;
    const VITE_COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const VITE_LOGOUT_URI = import.meta.env.VITE_LOGOUT_URI;

    localStorage.removeItem("id_token");
    localStorage.removeItem("access_token");

    // Redirect to Cognito's logout endpoint to clear the central session
    window.location.href = `https://${VITE_COGNITO_DOMAIN}/logout?client_id=${VITE_COGNITO_CLIENT_ID}&logout_uri=${VITE_LOGOUT_URI}`;
  };

  // ... rest of the component is the same ...
  if (!user)
    return (
      <div className="auth-container">
        <p>Loading...</p>
      </div>
    );
  return (
    <div className="auth-container">
      <h1 className="dashboard-greeting">Website A Dashboard</h1>
      <div className="dashboard-info">
        <p>
          <strong>Logged in as:</strong> {user.email}
        </p>
      </div>

      {/* --- Course Display Section --- */}
      <div className="dashboard-info" style={{ marginTop: "1rem" }}>
        <h3>Featured Course</h3>
        <p>
          <strong>{course.name}</strong>
        </p>
        <p>{course.description}</p>

        {/* This is the key link that starts the flow */}
        <a
          href={registrationUrl}
          className="auth-button"
          style={{
            marginTop: "1rem",
            textAlign: "center",
            textDecoration: "none",
          }}
        >
          Register on Website B
        </a>
      </div>

      <button
        onClick={handleLogout}
        className="auth-button logout-button"
        style={{ marginTop: "1rem" }}
      >
        Sign Out
      </button>
    </div>
  );
};

export default Dashboard;
