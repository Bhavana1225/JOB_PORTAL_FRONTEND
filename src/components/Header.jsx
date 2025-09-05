import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav style={{ padding: "1rem", background: "#004466", color: "#fff" }}>
      <Link to="/" style={{ marginRight: "1rem", color: "#fff" }}>
        Home
      </Link>
      <Link to="/jobs" style={{ marginRight: "1rem", color: "#fff" }}>
        Jobs
      </Link>
      <Link to="/login" style={{ color: "#fff" }}>
        Login
      </Link>
    </nav>
  );
}
