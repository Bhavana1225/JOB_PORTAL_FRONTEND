import React, { useState } from "react";

// Updated job list with Indian locations included
const JOBS = [
  {
    id: 1,
    title: "Frontend Developer",
    description: "Build responsive user interfaces with React.",
    location: "Remote",
    deadline: "2025-09-01",
  },
  {
    id: 2,
    title: "Backend Developer",
    description: "Develop REST APIs with Node.js and Express.",
    location: "New York, NY",
    deadline: "2025-09-10",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    description: "Design intuitive UI/UX for mobile and web apps.",
    location: "San Francisco, CA",
    deadline: "2025-09-15",
  },
  {
    id: 4,
    title: "Fullstack Engineer",
    description: "Work across frontend and backend tasks.",
    location: "Austin, TX",
    deadline: "2025-09-20",
  },
  {
    id: 5,
    title: "DevOps Engineer",
    description: "Maintain CI/CD pipelines and cloud infrastructure.",
    location: "Remote",
    deadline: "2025-09-25",
  },
  {
    id: 6,
    title: "Product Manager",
    description: "Lead product development and coordinate teams.",
    location: "Boston, MA",
    deadline: "2025-10-01",
  },
  {
    id: 7,
    title: "React Developer",
    description: "Build scalable frontend apps.",
    location: "Bangalore, India",
    deadline: "2025-09-05",
  },
  {
    id: 8,
    title: "Software Engineer",
    description: "Backend + frontend development in a fintech company.",
    location: "Mumbai, India",
    deadline: "2025-09-12",
  },
  {
    id: 9,
    title: "QA Tester",
    description: "Manual and automation testing for web apps.",
    location: "Delhi, India",
    deadline: "2025-09-18",
  },
];

export default function JobSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [deadlineFilter, setDeadlineFilter] = useState("");

  const locations = Array.from(new Set(JOBS.map((job) => job.location)));

  const filteredJobs = JOBS.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation = locationFilter ? job.location === locationFilter : true;

    const matchesDeadline = deadlineFilter
      ? new Date(job.deadline) <= new Date(deadlineFilter)
      : true;

    return matchesSearch && matchesLocation && matchesDeadline;
  });

  return (
    <div style={{ padding: "1rem", maxWidth: "900px", margin: "auto" }}>
      <h2>Search and Filter Jobs</h2>

      <div style={{ marginBottom: "1rem", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "0.5rem", flex: "1 1 250px" }}
        />

        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          style={{ padding: "0.5rem", flex: "1 1 180px" }}
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={deadlineFilter}
          onChange={(e) => setDeadlineFilter(e.target.value)}
          style={{ padding: "0.5rem", flex: "1 1 180px" }}
        />
      </div>

      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {filteredJobs.length === 0 ? (
          <li>No jobs found matching your criteria.</li>
        ) : (
          filteredJobs.map((job) => (
            <li
              key={job.id}
              style={{
                border: "1px solid #ccc",
                marginBottom: "1rem",
                padding: "1rem",
                borderRadius: "5px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                <strong>Deadline:</strong> {job.deadline}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
