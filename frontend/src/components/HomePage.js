import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      <div className="home-overlay">
        <div className="home-content">
          <div className="home-logo">
            <svg width="100" height="100" viewBox="0 0 100 100" className="home-logo-img">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="url(#logoGrad)" />
              <rect x="42" y="25" width="16" height="50" rx="8" fill="white" />
              <rect x="25" y="42" width="50" height="16" rx="8" fill="white" />
            </svg>
          </div>
          <h1 className="home-brand">Medi<span>Core</span></h1>
          <p className="home-tagline">Healthcare Management System</p>

          <div className="home-actions">
            <button className="home-btn primary" onClick={() => navigate("/login")}>
              Sign In
            </button>
            <button className="home-btn secondary" onClick={() => navigate("/signup")}>
              New User? Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;