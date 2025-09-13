import React, { useState } from "react";
import { api } from "../api";

const ApplicationForm = ({ jobId, token }) => {
  const [formData, setFormData] = useState({ name: "", email: "", resume: null });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("resume", formData.resume);

      await api.post(`/applications/${jobId}/apply`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      alert("Application submitted successfully");
      setFormData({ name: "", email: "", resume: null });
    } catch (error) {
      console.error("Error submitting application:", error);
      alert(error.response?.data?.message || "Failed to submit application");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "20px auto" }}>
      <div style={{ marginBottom: "10px" }}>
        <label>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: "100%", padding: "8px", marginTop: "5px" }} />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: "100%", padding: "8px", marginTop: "5px" }} />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Resume</label>
        <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleChange} required style={{ width: "100%", padding: "8px", marginTop: "5px" }} />
      </div>

      <button type="submit" style={{ backgroundColor: "#007bff", color: "#fff", padding: "10px 15px", border: "none", cursor: "pointer", width: "100%" }}>
        Apply
      </button>
    </form>
  );
};

export default ApplicationForm;
