import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import "../styles/style.css";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({ title: "", description: "", requirements: "", location: "", deadline: "", type: "Full-time" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
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
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) => { setJobData({ ...jobData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.put(`/jobs/${id}`, {
        ...jobData,
        requirements: jobData.requirements.split(",").map(r => r.trim()).filter(Boolean)
      }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to update job.");
    }
  };

  if (loading) return <p>Loading job details...</p>;

  // JSX same as before
};

export default EditJob;
