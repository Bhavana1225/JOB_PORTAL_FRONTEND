import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/style.css";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    deadline: "",
    type: "Full-time", // default
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJob = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
      setJobData({
        title: res.data.title || "",
        description: res.data.description || "",
        requirements: Array.isArray(res.data.requirements) ? res.data.requirements.join(", ") : res.data.requirements || "",
        location: res.data.location || "",
        deadline: res.data.deadline ? res.data.deadline.split("T")[0] : "",
        type: res.data.type || "Full-time",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load job details.");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchJob(); }, [id]);

  const handleChange = (e) => { setJobData({ ...jobData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/jobs/${id}`,
        {
          ...jobData,
          requirements: jobData.requirements.split(",").map(r => r.trim()).filter(Boolean)
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to update job.");
    }
  };

  if (loading) return <p>Loading job details...</p>;

  return (
    <div className="edit-job-container">
      <h2>Edit Job</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="edit-job-form">
        <div><label>Job Title:</label><input type="text" name="title" value={jobData.title} onChange={handleChange} required /></div>
        <div><label>Description:</label><textarea name="description" value={jobData.description} onChange={handleChange} required></textarea></div>
        <div><label>Requirements (comma separated):</label><textarea name="requirements" value={jobData.requirements} onChange={handleChange} required></textarea></div>
        <div><label>Location:</label><input type="text" name="location" value={jobData.location} onChange={handleChange} required /></div>
        <div><label>Job Type:</label>
          <select name="type" value={jobData.type} onChange={handleChange}>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
        <div><label>Application Deadline:</label><input type="date" name="deadline" value={jobData.deadline} onChange={handleChange} required /></div>
        <button type="submit" className="btn">Update Job</button>
      </form>
    </div>
  );
};

export default EditJob;
