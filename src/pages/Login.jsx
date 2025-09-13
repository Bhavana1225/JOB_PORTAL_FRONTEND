import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import "../styles/style.css";

const Login = () => {
  const { setUser, setToken } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !role) {
      setError("Please fill all fields");
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password, role });
      const userData = res.data;

      if (!userData.token) {
        setError("Login failed: No token returned");
        return;
      }

      setUser(userData);
      setToken(userData.token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token);

      navigate(userData.role === "employer" ? "/dashboard" : "/applications");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed: Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleLogin} className="auth-form">
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
          <option value="">Select Role</option>
          <option value="jobseeker">Job Seeker</option>
          <option value="employer">Employer</option>
        </select>

        <button type="submit" className="btn">
          Login
        </button>
      </form>

      <p className="auth-footer">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
