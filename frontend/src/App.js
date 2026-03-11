
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import AdminDashboard from "./components/AdminDashboard";
import DoctorDashboard from "./components/DoctorDashboard";
import PatientDashboard from "./components/PatientDashboard";
import HomePage from "./components/HomePage";

function App() {
  useEffect(() => {
    const handleStorageChange = (e) => {
      // localStorage.clear() triggers e.key === null
      // or we check if our identifying keys are gone
      if (e.key === "email" || e.key === "role" || e.key === null) {
        if (!localStorage.getItem("email")) {
          // Changed redirect to /login to avoid getting stuck on home page
          window.location.href = "/login";
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/patient" element={<PatientDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;