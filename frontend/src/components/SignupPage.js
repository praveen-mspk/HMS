
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: ""
  });

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.dob) {
      alert("Name, Email, Password, and DOB are required");
      return;
    }

    // Future date validation
    const selectedDate = new Date(formData.dob);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      alert("Date of Birth cannot be in the future");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          dob: formData.dob,
          gender: formData.gender,
          mobile: formData.mobile,
          role: "PATIENT"
        })
      });

      if (response.ok) {
        alert("Signup Successful. Please Login.");
        navigate("/");
      } else {
        const errorMsg = await response.text();
        alert(errorMsg || "Signup failed");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Network error. Is the backend running?");
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

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
          <h2>Create Account</h2>
          <p className="form-subtitle">Register as a new patient</p>

          <div className="form-row">
            <label className="form-label">Full Name</label>
            <div className="form-input-box">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Date of Birth</label>
            <div className="form-input-box">
              <input
                type="date"
                name="dob"
                max={todayStr}
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Gender</label>
            <div className="form-input-box">
              <div className="radio-group" style={{ justifyContent: "flex-start", gap: "25px", margin: 0 }}>
                <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  /> Male
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  /> Female
                </label>
              </div>
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Email Address</label>
            <div className="form-input-box">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Password</label>
            <div className="form-input-box">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Confirm Pwd</label>
            <div className="form-input-box">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Mobile Number</label>
            <div className="form-input-box">
              <input
                type="text"
                name="mobile"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />
            </div>
          </div>

          <button onClick={handleSubmit} style={{ marginTop: "10px" }}>Create Account</button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;