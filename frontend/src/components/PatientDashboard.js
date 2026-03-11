import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

function PatientDashboard() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [bookForm, setBookForm] = useState({
    specialization: "", doctorId: "", slotId: "",
    appointmentDate: "", startTime: "", endTime: ""
  });

  useEffect(() => { fetchAppointments(); fetchSpecializations(); }, []);

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

  async function fetchSpecializations() {
    try {
      const res = await fetch(`${API}/public/specializations`, { credentials: "include" });
      if (res.ok) setSpecializations(await res.json());
    } catch (e) { console.error(e); }
  }

  async function fetchDoctorsBySpecialization(spec) {
    try {
      const res = await fetch(`${API}/public/doctors?specialization=${encodeURIComponent(spec)}`, { credentials: "include" });
      if (res.ok) setDoctors(await res.json());
    } catch (e) { console.error(e); }
  }

  async function fetchSlots(doctorId) {
    try {
      const res = await fetch(`${API}/public/doctors/${doctorId}/slots`, { credentials: "include" });
      if (res.ok) setSlots(await res.json());
    } catch (e) { console.error(e); }
  }

  function handleSpecializationChange(e) {
    const spec = e.target.value;
    setBookForm({ ...bookForm, specialization: spec, doctorId: "", slotId: "", appointmentDate: "", startTime: "", endTime: "" });
    setDoctors([]); setSlots([]);
    if (spec) fetchDoctorsBySpecialization(spec);
  }

  function handleDoctorChange(e) {
    const doctorId = e.target.value;
    setBookForm({ ...bookForm, doctorId, slotId: "", appointmentDate: "", startTime: "", endTime: "" });
    setSlots([]);
    if (doctorId) fetchSlots(doctorId);
  }

  function handleSlotChange(e) {
    const slotId = e.target.value;
    const slot = slots.find(s => String(s.id) === slotId);
    if (slot) {
      setBookForm({
        ...bookForm, slotId,
        appointmentDate: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime
      });
    }
  }

  async function handleBookAppointment(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const email = localStorage.getItem("email");
      const role = localStorage.getItem("role");
      const res = await fetch(`${API}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": email,
          "X-User-Role": role
        },
        credentials: "include",
        body: JSON.stringify({
          doctorId: Number(bookForm.doctorId),
          appointmentDate: bookForm.appointmentDate,
          startTime: bookForm.startTime,
          endTime: bookForm.endTime
        })
      });
      if (res.ok) {
        showAlertMsg("Appointment booked successfully!", "success");
        setShowModal(false);
        setBookForm({ specialization: "", doctorId: "", slotId: "", appointmentDate: "", startTime: "", endTime: "" });
        setDoctors([]); setSlots([]);
        fetchAppointments();
      } else {
        const err = await res.json();
        showAlertMsg(err.message || "Booking failed.", "error");
      }
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
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <span>Medi<span className="brand-accent">Core</span></span>
          <span className="panel-label">Patient Portal</span>
        </div>

        <div className="navbar-tabs">
          {[
            { key: "appointments", label: "My Appointments", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg> },
            { key: "book", label: "Book Appointment", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg> },
          ].map(item => (
            <div
              key={item.key}
              className={`nav-tab ${activeTab === item.key ? "active" : ""}`}
              onClick={() => { setActiveTab(item.key); if (item.key === "book") setShowModal(true); }}
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

        <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1>My Appointments</h1>
            <p>Track your scheduled visits</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Book Appointment
          </button>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon amber"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div>
            <div className="stat-info"><p>Booked</p><h3>{booked}</h3></div>
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
          <div className="card-header"><h3>Appointment History</h3></div>
          <div className="card-body">
            {appointments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></div>
                <p>No appointments yet. Book one to get started!</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>#</th><th>Doctor</th><th>Specialization</th>
                      <th>Date</th><th>Time</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a, i) => (
                      <tr key={a.id}>
                        <td>{i + 1}</td>
                        <td><strong>{a.doctorName}</strong></td>
                        <td>{a.specialization || "—"}</td>
                        <td>{a.appointmentDate}</td>
                        <td>{a.startTime} – {a.endTime}</td>
                        <td><StatusBadge status={a.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Book Appointment Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Book an Appointment</h3>
            <form onSubmit={handleBookAppointment}>
              <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>

                {/* Step 1: Specialization */}
                <div className="form-group">
                  <label>Specialization</label>
                  <select required value={bookForm.specialization} onChange={handleSpecializationChange}>
                    <option value="">— Select Specialization —</option>
                    {specializations.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Step 2: Doctor */}
                {bookForm.specialization && doctors.length === 0 && (
                  <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
                    No doctors available for this specialization.
                  </p>
                )}
                {doctors.length > 0 && (
                  <div className="form-group">
                    <label>Doctor</label>
                    <select required value={bookForm.doctorId} onChange={handleDoctorChange}>
                      <option value="">— Select Doctor —</option>
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>Dr. {d.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Step 3: Available Slot */}
                {slots.length > 0 && (
                  <div className="form-group">
                    <label>Available Slot</label>
                    <select required value={bookForm.slotId} onChange={handleSlotChange}>
                      <option value="">— Select Slot —</option>
                      {slots.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.date} | {s.startTime} – {s.endTime}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {bookForm.doctorId && slots.length === 0 && (
                  <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
                    No available slots for this doctor.
                  </p>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline"
                  onClick={() => { setShowModal(false); setDoctors([]); setSlots([]); setBookForm({ specialization: "", doctorId: "", slotId: "", appointmentDate: "", startTime: "", endTime: "" }); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary"
                  disabled={loading || !bookForm.slotId}>
                  {loading ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

export default PatientDashboard;