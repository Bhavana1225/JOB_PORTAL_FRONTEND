import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import "../styles/style.css";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        setJobs(res.data || []);
        setError("");
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to fetch jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="joblist-container">
      <h1>Available Jobs</h1>
      {jobs.length === 0 ? (
        <p>No jobs available at the moment.</p>
      ) : (
        <ul className="joblist">
          {jobs.map((job) => (
            <li key={job._id} className="job-item">
              <Link to={`/jobs/${job._id}`} className="job-link">
                {job.title}
              </Link>{" "}
              - {job.location || "Location not specified"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobList;
