import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";
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
        const response = await api.get(`/jobs/${id}`);
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

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!job) return <p>Loading job details...</p>;

  return (
    <div className="job-details">
      <h2>{job.title}</h2>
      <p><strong>Company:</strong> {job.company}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Type:</strong> {job.type}</p>
      <p><strong>Description:</strong> {job.description}</p>
      <p><strong>Requirements:</strong> {job.requirements}</p>
      <p><strong>Deadline:</strong> {job.deadline ? new Date(job.deadline).toLocaleDateString() : "N/A"}</p>

      {user?.role === "jobseeker" ? (
        <>
          {!showForm ? (
            <button onClick={() => setShowForm(true)} className="btn">
              Apply Now
            </button>
          ) : (
            <ApplicationForm jobId={id} token={token} />
          )}
        </>
      ) : (
        <Link to="/dashboard"><button className="btn">Back to Dashboard</button></Link>
      )}
    </div>
  );
};

export default JobDetails;
