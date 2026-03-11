
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const enteredEmail = email.trim();
    const enteredPassword = password.trim();

    // Dummy Admin 
    if (enteredEmail === "admin@hospital.com" && enteredPassword === "admin") {
      const dummyAdmin = {
        id: 0,
        name: "Super Admin",
        email: "admin@hospital.com",
        role: "ADMIN"
      };
      localStorage.setItem("role", dummyAdmin.role);
      localStorage.setItem("email", dummyAdmin.email);
      localStorage.setItem("userId", dummyAdmin.id);
      localStorage.setItem("name", dummyAdmin.name);
      navigate("/admin");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: enteredEmail, password: enteredPassword })
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem("role", user.role);
        localStorage.setItem("email", user.email);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("name", user.name);

        if (user.role === "ADMIN") navigate("/admin");
        else if (user.role === "DOCTOR") navigate("/doctor");
        else if (user.role === "PATIENT") navigate("/patient");
      } else {
        let errorMsg = "Invalid credentials";
        try {
          const errData = await response.json();
          errorMsg = errData.message || errorMsg;
        } catch (e) {
          // Fallback if not JSON
          const raw = await response.text();
          if (raw && raw.length < 100) errorMsg = raw;
        }
        alert(errorMsg);
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Network error. Is the backend running?");
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Left decorative brand panel */}
      <div className="auth-brand-panel">
        <h1 className="brand-header">Medi<span>Core</span></h1>
        <p className="brand-tagline">Healthcare Management System</p>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="login-container">
          <h2>Welcome Back</h2>
          <p className="form-subtitle">Sign in to continue to your dashboard</p>

          <input
            type="email"
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>Sign In</button>

          <div className="signup-footer">
            New User?
            <button
              className="signup-link"
              onClick={() => navigate("/signup")}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;