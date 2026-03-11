import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

function DoctorDashboard() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const [slotForm, setSlotForm] = useState({ date: "", startTime: "", endTime: "" });

  useEffect(() => { fetchAppointments(); }, []);

  async function fetchAppointments() {
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");
    try {
      const res = await fetch(`${API}/appointments`, {
        credentials: "include",
        headers: {
          "X-User-Email": email,
          "X-User-Role": role
        }
      });
      if (res.ok) setAppointments(await res.json());
    } catch (e) { console.error(e); }
  }

  async function handleConfirm(id) {
    try {
      const res = await fetch(`${API}/doctor/appointments/${id}/confirm`, {
        method: "PUT", credentials: "include"
      });
      if (res.ok) { showAlertMsg("Appointment confirmed!", "success"); fetchAppointments(); }
      else showAlertMsg("Failed to confirm.", "error");
    } catch (e) { showAlertMsg("Network error.", "error"); }
  }

  async function handleAddSlot(e) {
    e.preventDefault();
    setLoading(true);
    const doctorId = localStorage.getItem("userId");
    try {
      const res = await fetch(`${API}/doctor/${doctorId}/slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(slotForm)
      });
      if (res.ok) {
        showAlertMsg("Slot added successfully!", "success");
        setSlotForm({ date: "", startTime: "", endTime: "" });
      } else showAlertMsg("Failed to add slot.", "error");
    } catch (e) { showAlertMsg("Network error.", "error"); }
    finally { setLoading(false); }
  }

  function showAlertMsg(msg, type) {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3500);
  }

  function handleLogout() { localStorage.clear(); navigate("/"); }

  const booked = appointments.filter(a => a.status === "BOOKED").length;
  const confirmed = appointments.filter(a => a.status === "CONFIRMED").length;
  const completed = appointments.filter(a => a.status === "COMPLETED").length;

  return (
    <div className="dashboard-layout">
      {/* Top Navbar */}
      <nav className="top-navbar">
        <div className="navbar-brand">
          <div className="brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <span>Medi<span className="brand-accent">Core</span></span>
          <span className="panel-label">Doctor Panel</span>
        </div>

        <div className="navbar-tabs">
          {[
            { key: "appointments", label: "Appointments", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg> },
            { key: "slots", label: "My Slots", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> },
          ].map(item => (
            <div
              key={item.key}
              className={`nav-tab ${activeTab === item.key ? "active" : ""}`}
              onClick={() => setActiveTab(item.key)}
            >
              {item.icon} {item.label}
            </div>
          ))}
        </div>

        <div className="navbar-right">
          <span className="navbar-email">{email}</span>
          <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
        </div>
      </nav>

      {/* Main */}
      <main className="main-content">
        {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

        {/* APPOINTMENTS */}
        {activeTab === "appointments" && (
          <>
            <div className="page-header">
              <h1>My Appointments</h1>
              <p>Review and confirm patient bookings</p>
            </div>

            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-icon amber"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div>
                <div className="stat-info"><p>Pending</p><h3>{booked}</h3></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon indigo"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg></div>
                <div className="stat-info"><p>Confirmed</p><h3>{confirmed}</h3></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg></div>
                <div className="stat-info"><p>Completed</p><h3>{completed}</h3></div>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><h3>Appointment Requests</h3></div>
              <div className="card-body">
                {appointments.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></div>
                    <p>No appointments yet.</p>
                  </div>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>#</th><th>Patient</th><th>Date</th>
                          <th>Time</th><th>Status</th><th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((a, i) => (
                          <tr key={a.id}>
                            <td>{i + 1}</td>
                            <td><strong>{a.patientName}</strong></td>
                            <td>{a.appointmentDate}</td>
                            <td>{a.startTime} – {a.endTime}</td>
                            <td><StatusBadge status={a.status} /></td>
                            <td>
                              {a.status === "BOOKED" && (
                                <button className="btn btn-success btn-sm" onClick={() => handleConfirm(a.id)}>
                                  Confirm
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* SLOTS */}
        {activeTab === "slots" && (
          <>
            <div className="page-header">
              <h1>My Available Slots</h1>
              <p>Add time slots patients can book</p>
            </div>
            <div className="card" style={{ maxWidth: 480 }}>
              <div className="card-header"><h3>Add New Slot</h3></div>
              <div className="card-body">
                <form onSubmit={handleAddSlot}>
                  <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
                    <div className="form-group">
                      <label>Date</label>
                      <input required type="date" value={slotForm.date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={e => setSlotForm({ ...slotForm, date: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Start Time</label>
                      <input required type="time" value={slotForm.startTime}
                        onChange={e => setSlotForm({ ...slotForm, startTime: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>End Time</label>
                      <input required type="time" value={slotForm.endTime}
                        onChange={e => setSlotForm({ ...slotForm, endTime: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Adding..." : "Add Slot"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    BOOKED: "badge-booked", CONFIRMED: "badge-confirmed",
    COMPLETED: "badge-completed", CANCELLED: "badge-cancelled"
  };
  return <span className={`badge ${map[status] || ""}`}>{status}</span>;
}

export default DoctorDashboard;