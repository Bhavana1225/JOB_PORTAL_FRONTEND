import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import "../styles/style.css";

const Register = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("jobseeker");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !role) {
      setError("Please fill all fields");
      return;
    }

    try {
      const res = await api.post("/auth/register", { name, email, password, role });
      const userData = res.data;

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token);

      navigate(userData.role === "employer" ? "/dashboard" : "/applications");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="jobseeker">Job Seeker</option>
          <option value="employer">Employer</option>
        </select>

        <button type="submit" className="btn">
          Register
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
