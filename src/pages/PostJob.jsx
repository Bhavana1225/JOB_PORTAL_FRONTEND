import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useUser } from "../context/UserContext";
import "../styles/style.css";

const PostJob = () => {
  const navigate = useNavigate();
  const { token } = useUser();   // ✅ use context instead of localStorage
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    deadline: "",
    type: "Full-time",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!token) {
        setError("You must be logged in to post a job.");
        return;
      }

      await api.post(
        "/jobs",
        {
          ...jobData,
          requirements: jobData.requirements
            .split(",")
            .map((r) => r.trim())
            .filter(Boolean),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-container">
      <h2>Post a New Job</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="post-job-form">
        <div>
          <label>Job Title:</label>
          <input
            type="text"
            name="title"
            value={jobData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={jobData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div>
          <label>Requirements (comma separated):</label>
          <textarea
            name="requirements"
            value={jobData.requirements}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={jobData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Job Type:</label>
          <select name="type" value={jobData.type} onChange={handleChange}>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        <div>
          <label>Application Deadline:</label>
          <input
            type="date"
            name="deadline"
            value={jobData.deadline}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default PostJob;
