import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useUser } from "../context/UserContext";

const ApplicationsDashboard = () => {
  const { user, token } = useUser();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !token) return;

    const fetchData = async () => {
      try {
        if (user.role === "jobseeker") {
          const res = await api.get("/applications/user", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setApplications(res.data || []);
        } else if (user.role === "employer") {
          const res = await api.get("/jobs/employer", {
            headers: { Authorization: `Bearer ${token}` }
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
      await api.delete(`/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(applications.filter(app => app._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete application");
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
                    <button onClick={() => handleDelete(app._id)} className="btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
