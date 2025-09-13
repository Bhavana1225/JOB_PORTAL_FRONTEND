import React, { useState, useEffect } from "react";
import { api } from "../api";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile");
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put("/auth/profile", profile);
      setMessage("Profile updated successfully!");
      setProfile(res.data);
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>My Profile</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <select
          name="role"
          value={profile.role}
          onChange={handleChange}
          required
        >
          <option value="">Select Role</option>
          <option value="jobseeker">Job Seeker</option>
          <option value="employer">Employer</option>
        </select>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
