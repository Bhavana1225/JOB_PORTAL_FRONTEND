import React from "react";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
      <button onClick={() => navigate(`/jobs/${job._id}`)}>View Details</button>
    </div>
  );
};

export default JobCard;
