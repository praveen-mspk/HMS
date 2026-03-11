import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API = "http://localhost:8080/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const [activeTab, setActiveTab] = useState("overview");
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [alert, setAlert] = useState(null);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [loading, setLoading] = useState(false);

  const [doctorForm, setDoctorForm] = useState({
    name: "", email: "", password: "",
    specialization: "", department: ""
  });

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

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

  async function fetchDoctors() {
    try {
      const res = await fetch(`${API}/public/doctors`, { credentials: "include" });
      if (res.ok) setDoctors(await res.json());
    } catch (e) { console.error(e); }
  }

  async function handleCancelAppointment(id) {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      const res = await fetch(`${API}/appointments/${id}/cancel`, {
        method: "PUT", credentials: "include"
      });
      if (res.ok) {
        showAlertMsg("Appointment cancelled.", "success");
        fetchAppointments();
      } else showAlertMsg("Failed to cancel.", "error");
    } catch (e) { showAlertMsg("Network error.", "error"); }
  }

  async function handleAddDoctor(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...doctorForm,
          departmentName: doctorForm.department,
          role: "DOCTOR"
        })
      });
      if (res.ok) {
        showAlertMsg("Doctor added successfully!", "success");
        setShowAddDoctor(false);
        setDoctorForm({ name: "", email: "", password: "", specialization: "", department: "" });
        fetchDoctors();
      } else {
        const err = await res.json();
        showAlertMsg(err.message || "Failed to add doctor.", "error");
      }
    } catch (e) { showAlertMsg("Network error.", "error"); }
    finally { setLoading(false); }
  }

  function showAlertMsg(msg, type) {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3500);
  }

  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  const confirmed = appointments.filter(a => a.status === "CONFIRMED").length;
  const booked = appointments.filter(a => a.status === "BOOKED").length;
  const cancelled = appointments.filter(a => a.status === "CANCELLED").length;

  return (
    <div className="dashboard-layout">
      {/* Top Navbar */}
      <nav className="top-navbar">
        <div className="navbar-brand">
          <div className="brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span>Medi<span className="brand-accent">Core</span></span>
          <span className="panel-label">Admin Panel</span>
        </div>

        <div className="navbar-tabs">
          {[
            { key: "overview", label: "Overview", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg> },
            { key: "appointments", label: "Appointments", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg> },
            { key: "doctors", label: "Doctors", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
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

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <>
            <div className="page-header">
              <h1>Dashboard Overview</h1>
              <p>Hospital at a glance</p>
            </div>
            <div className="stats-row" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
              <div className="stat-card">
                <div className="stat-icon blue"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                <div className="stat-info"><p>Doctors</p><h3>{doctors.length}</h3></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon indigo"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
                <div className="stat-info"><p>Total Appointments</p><h3>{appointments.length}</h3></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon amber"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                <div className="stat-info"><p>Booked</p><h3>{booked}</h3></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
                <div className="stat-info"><p>Confirmed</p><h3>{confirmed}</h3></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon red"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></div>
                <div className="stat-info"><p>Cancelled</p><h3>{cancelled}</h3></div>
              </div>
            </div>

            {/* Recent appointments */}
            <div className="card">
              <div className="card-header"><h3>Recent Appointments</h3></div>
              <div className="card-body">
                <AppointmentTable
                  appointments={appointments.slice(0, 5)}
                  onCancel={handleCancelAppointment}
                  showCancel
                />
              </div>
            </div>
          </>
        )}

        {/* APPOINTMENTS */}
        {activeTab === "appointments" && (
          <>
            <div className="page-header">
              <h1>All Appointments</h1>
              <p>Manage and cancel scheduled appointments</p>
            </div>
            <div className="card">
              <div className="card-body">
                <AppointmentTable
                  appointments={appointments}
                  onCancel={handleCancelAppointment}
                  showCancel
                />
              </div>
            </div>
          </>
        )}

        {/* DOCTORS */}
        {activeTab === "doctors" && (
          <>
            <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h1>Doctors</h1>
                <p>Manage hospital doctors</p>
              </div>
              <button className="btn btn-primary" onClick={() => setShowAddDoctor(true)}>+ Add Doctor</button>
            </div>
            <div className="card">
              <div className="card-body table-wrap">
                {doctors.length === 0 ? (
                  <div className="empty-state"><div className="empty-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div><p>No doctors yet.</p></div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>#</th><th>Name</th><th>Email</th>
                        <th>Specialization</th><th>Department</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map((d, i) => (
                        <tr key={d.id}>
                          <td>{i + 1}</td>
                          <td><strong>{d.name}</strong></td>
                          <td>{d.email}</td>
                          <td>{d.specialization || "—"}</td>
                          <td>{d.department?.name || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Add Doctor Modal */}
      {showAddDoctor && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Doctor</h3>
            <form onSubmit={handleAddDoctor}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input required placeholder="Dr. John Smith" value={doctorForm.name}
                    onChange={e => setDoctorForm({ ...doctorForm, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input required type="email" placeholder="doctor@hospital.com" value={doctorForm.email}
                    onChange={e => setDoctorForm({ ...doctorForm, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input required type="password" placeholder="Temporary password" value={doctorForm.password}
                    onChange={e => setDoctorForm({ ...doctorForm, password: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Specialization</label>
                  <input placeholder="e.g. Cardiology" value={doctorForm.specialization}
                    onChange={e => setDoctorForm({ ...doctorForm, specialization: e.target.value })} />
                </div>
                <div className="form-group full">
                  <label>Department</label>
                  <input placeholder="e.g. Heart & Vascular" value={doctorForm.department}
                    onChange={e => setDoctorForm({ ...doctorForm, department: e.target.value })} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddDoctor(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Adding..." : "Add Doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Shared sub-component
function AppointmentTable({ appointments, onCancel, showCancel }) {
  if (appointments.length === 0)
    return <div className="empty-state"><div className="empty-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div><p>No appointments found.</p></div>;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th><th>Patient</th><th>Doctor</th>
            <th>Date</th><th>Time</th><th>Status</th>
            {showCancel && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {appointments.map((a, i) => (
            <tr key={a.id}>
              <td>{i + 1}</td>
              <td>{a.patientName}</td>
              <td>{a.doctorName}</td>
              <td>{a.appointmentDate}</td>
              <td>{a.startTime} – {a.endTime}</td>
              <td><StatusBadge status={a.status} /></td>
              {showCancel && (
                <td>
                  {(a.status === "BOOKED" || a.status === "CONFIRMED") && (
                    <button className="btn btn-danger btn-sm" onClick={() => onCancel(a.id)}>Cancel</button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
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

export default AdminDashboard;