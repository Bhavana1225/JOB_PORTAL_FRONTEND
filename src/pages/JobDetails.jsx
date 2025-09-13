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

  // JSX same as before
};

export default JobDetails;
