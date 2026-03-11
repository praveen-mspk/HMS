import "./PatientAuth.css";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientAuth.css";

function PatientAuth() {
  const [isLogin, setIsLogin] = useState(true);
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

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLogin) {
      // AGE VALIDATION
      const age = calculateAge(formData.dob);
      if (age < 18) {
        alert("Age must be 18 or above");
        return;
      }

      // PASSWORD MATCH
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      // SAVE TO LOCAL STORAGE
      localStorage.setItem("patient", JSON.stringify(formData));
      alert("Signup Successful!");
      setIsLogin(true);
    } else {
      const existingUser = JSON.parse(localStorage.getItem("patient"));

      if (
        existingUser &&
        existingUser.email === formData.email &&
        existingUser.password === formData.password
      ) {
        alert("Login Successful");
        navigate("/patient-dashboard");
      } else {
        alert("Invalid Credentials");
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Patient Login" : "Patient Signup"}</h2>

      <form onSubmit={handleSubmit}>

        {!isLogin && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              onChange={handleChange}
            />

            <input
              type="date"
              name="dob"
              required
              onChange={handleChange}
            />

            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  onChange={handleChange}
                  required
                /> Male
              </label>

              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  onChange={handleChange}
                /> Female
              </label>
            </div>

            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              pattern="[0-9]{10}"
              required
              onChange={handleChange}
            />
          </>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
        />

        {!isLogin && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            onChange={handleChange}
          />
        )}

        <button type="submit">
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      <p
        className="toggle-text"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "Don't have an account? Sign Up"
          : "Already have an account? Login"}
      </p>
    </div>
  );
}

export default PatientAuth;