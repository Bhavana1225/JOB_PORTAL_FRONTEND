import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ApplicationForm from "./ApplicationForm";
import { useUser } from "../context/UserContext";

const JobDetails = () => {
  const { id } = useParams();
  const { user, token } = useUser();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
          setError("Invalid job ID.");
          setJob(null);
          return;
        }
        const response = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        if (response.data && response.data._id) {
          setJob(response.data);
        } else {
          setError("Job not found.");
          setJob(null);
        }
      } catch (err) {
        console.error(err);
        setJob(null);
        if (err.response?.status === 404) setError("Job not found.");
        else setError("Error fetching job.");
      }
    };
    fetchJob();
  }, [id]);

  if (error) {
    return (
      <div>
        {error}
        <br />
        <Link to="/"><button className="btn">Back to Jobs</button></Link>
      </div>
    );
  }

  if (!job) return <div>Loading job details...</div>;

  return (
    <div className="job-details-container">
      <h1>{job.title}</h1>
      <p><strong>Company:</strong> {job.company || "Not specified"}</p>
      <p><strong>Location:</strong> {job.location || "Not specified"}</p>
      <p><strong>Type:</strong> {job.type || "Not specified"}</p>
      <p><strong>Deadline:</strong> {job.deadline ? new Date(job.deadline).toLocaleDateString() : "Not specified"}</p>
      <p><strong>Description:</strong> {job.description || "Not specified"}</p>
      <p><strong>Requirements:</strong> {Array.isArray(job.requirements) ? job.requirements.join(", ") : job.requirements || "Not specified"}</p>
      {job.salary && <p><strong>Salary:</strong> {job.salary}</p>}
      <p><strong>Status:</strong> {job.filled ? "Closed" : "Open"}</p>

      {job.filled ? (
        <p style={{ color: "red" }}>This job is closed and not accepting applications.</p>
      ) : (
        <>
          {!showForm && user && (
            <button onClick={() => setShowForm(true)} className="btn">Apply to Job</button>
          )}
          {showForm && user && <ApplicationForm jobId={job._id} token={token} />}
          {!user && (
            <p>
              <Link to="/login">Login</Link> to apply for this job.
            </p>
          )}
        </>
      )}

      <br />
      <Link to="/"><button className="btn">Back to Jobs</button></Link>
    </div>
  );
};

export default JobDetails;
