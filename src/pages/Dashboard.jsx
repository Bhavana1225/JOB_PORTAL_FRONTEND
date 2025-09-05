import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import "../styles/style.css";

const Dashboard = () => {
  const { user, token } = useUser();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchJobs = async () => {
    if (!user || !token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/jobs/employer", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user, token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete job");
    }
  };

  const handleToggleFilled = async (id) => {
    setUpdatingId(id);
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/jobs/${id}/filled`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs(jobs.map((job) => (job._id === id ? res.data : job)));
    } catch (err) {
      console.error(err);
      alert("Failed to update job status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p>Loading your jobs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="dashboard-container">
      <h2>Employer Dashboard</h2>
      <Link to="/post-job">
        <button className="btn">Post New Job</button>
      </Link>

      {jobs.length === 0 ? (
        <p>You have not posted any jobs yet.</p>
      ) : (
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Type</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Actions</th>
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
                <td>{job.filled ? "Closed" : "Open"}</td>
                <td>
                  <Link to={`/edit-job/${job._id}`}>
                    <button className="btn">Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(job._id)} className="btn">
                    Delete
                  </button>
                  <button
                    onClick={() => handleToggleFilled(job._id)}
                    className="btn"
                    disabled={updatingId === job._id}
                  >
                    {job.filled ? "Mark Open" : "Mark Closed"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
