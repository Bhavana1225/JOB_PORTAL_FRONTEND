import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import "../styles/style.css";

const ApplicationsDashboard = () => {
  const { user, token } = useUser();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingApp, setEditingApp] = useState(null);
  const [newResume, setNewResume] = useState(null);

  useEffect(() => {
    if (!user || !token) return;

    const fetchData = async () => {
      try {
        if (user.role === "jobseeker") {
          const res = await axios.get("http://localhost:5000/api/applications/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setApplications(res.data || []);
        } else if (user.role === "employer") {
          const res = await axios.get("http://localhost:5000/api/jobs/employer", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setJobs(res.data || []);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(applications.filter((app) => app._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete application");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingApp) return;

    const formData = new FormData();
    formData.append("name", editingApp.name);
    formData.append("email", editingApp.email);
    if (newResume) formData.append("resume", newResume);

    try {
      const res = await axios.put(
        `http://localhost:5000/api/applications/${editingApp._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications(applications.map(app => app._id === editingApp._id ? res.data.application : app));
      setEditingApp(null);
      setNewResume(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update application");
    }
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Jobseeker view
  if (user.role === "jobseeker") {
    return (
      <div className="applications-dashboard">
        <h2>My Applications</h2>
        {applications.length === 0 ? (
          <p>You have not applied to any jobs yet.</p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Applied On</th>
                <th>Resume</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>{app.job?.title || "N/A"}</td>
                  <td>{app.job?.company || "N/A"}</td>
                  <td>{app.job?.location || "N/A"}</td>
                  <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td>{app.resume ? <a href={`http://localhost:5000/uploads/${app.resume}`} target="_blank" rel="noopener noreferrer">View Resume</a> : "N/A"}</td>
                  <td>
                    <button onClick={() => setEditingApp(app)} className="btn">Edit</button>
                    <button onClick={() => handleDelete(app._id)} className="btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {editingApp && (
          <div style={{ marginTop: "20px" }}>
            <h3>Edit Application for: {editingApp.job?.title}</h3>
            <form onSubmit={handleEditSubmit}>
              <input type="text" value={editingApp.name} onChange={e => setEditingApp({ ...editingApp, name: e.target.value })} required />
              <input type="email" value={editingApp.email} onChange={e => setEditingApp({ ...editingApp, email: e.target.value })} required />
              <input type="file" accept=".pdf,.doc,.docx" onChange={e => setNewResume(e.target.files[0])} />
              <button type="submit" className="btn">Update Application</button>
              <button type="button" onClick={() => setEditingApp(null)} className="btn">Cancel</button>
            </form>
          </div>
        )}

        <Link to="/"><button className="btn">Back to Jobs</button></Link>
      </div>
    );
  }

  // Employer view
  return (
    <div className="employer-dashboard">
      <h2>My Jobs</h2>
      <Link to="/post-job"><button className="btn">Post a New Job</button></Link>
      {jobs.length === 0 ? (
        <p>You have not posted any jobs yet.</p>
      ) : (
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Type</th>
              <th>Deadline</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.title}</td>
                <td>{job.company}</td>
                <td>{job.location}</td>
                <td>{job.type}</td>
                <td>{job.deadline ? new Date(job.deadline).toLocaleDateString() : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApplicationsDashboard;
