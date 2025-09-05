import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import "../styles/style.css";

const Profile = () => {
  const { user, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    contactDetails: user?.contactDetails || "",
    workHistory: user?.workHistory || "",
    certifications: user?.certifications || "",
    education: user?.education || ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      {["name", "email", "contactDetails", "workHistory", "certifications", "education"].map((field) => (
        <div className="profile-field" key={field}>
          <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
          {isEditing ? (
            field === "email" || field === "name" ? (
              <input type={field === "email" ? "email" : "text"} name={field} value={formData[field]} onChange={handleChange} />
            ) : (
              <textarea name={field} value={formData[field]} onChange={handleChange}></textarea>
            )
          ) : (
            <p>{user?.[field] || "Not provided"}</p>
          )}
        </div>
      ))}

      <div className="profile-actions">
        {isEditing ? (
          <button onClick={handleSave} className="btn btn-save">Save Profile</button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="btn btn-edit">Edit Profile</button>
        )}
      </div>
    </div>
  );
};

export default Profile;
