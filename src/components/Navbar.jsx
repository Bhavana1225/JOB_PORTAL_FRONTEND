import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "../styles/style.css";

const Navbar = () => {
  const { user, setUser, loading } = useUser();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  if (loading) return null;

  return (
    <nav className="navbar">
      <Link className="nav-link" to="/">Home</Link>
      {!user && <Link className="nav-link" to="/login">Login</Link>}
      {!user && <Link className="nav-link" to="/register">Register</Link>}
      {user && <Link className="nav-link" to="/profile">Profile</Link>}
      {user?.role === "employer" && <Link className="nav-link" to="/dashboard">Dashboard</Link>}
      {user?.role === "jobseeker" && <Link className="nav-link" to="/applications">My Applications</Link>}
      {user && <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>}
    </nav>
  );
};

export default Navbar;
