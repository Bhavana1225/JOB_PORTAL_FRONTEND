import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import { useUser } from "../context/UserContext";

function Homepage() {
  const { user } = useUser();
  const [jobs, setJobs] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDeadline, setSearchDeadline] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/api/jobs");
        setJobs(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchTitle = job.title?.toLowerCase().includes(searchTitle.toLowerCase());
    const matchLocation = job.location?.toLowerCase().includes(searchLocation.toLowerCase());
    const matchDeadline = searchDeadline
      ? job.deadline && new Date(job.deadline).toISOString().split("T")[0] === searchDeadline
      : true;
    return matchTitle && matchLocation && matchDeadline;
  });

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="homepage">
      <h1>Job Listings</h1>

      {user?.role === "employer" && (
        <div style={{ marginBottom: "20px" }}>
          <Link to="/dashboard"><button className="btn">Go to Dashboard</button></Link>
        </div>
      )}

      <div className="search-filters">
        <input type="text" placeholder="Search by title..." value={searchTitle} onChange={e => setSearchTitle(e.target.value)} />
        <input type="text" placeholder="Search by location..." value={searchLocation} onChange={e => setSearchLocation(e.target.value)} />
        <input type="date" value={searchDeadline} onChange={e => setSearchDeadline(e.target.value)} />
      </div>

      <div className="job-list">
        {filteredJobs.length === 0 ? <p>No jobs found matching your criteria.</p> :
          filteredJobs.map(job => (
            <div key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p>Location: {job.location || "Not specified"}</p>
              <p>Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : "Not specified"}</p>
              <Link to={`/jobs/${job._id}`}><button className="btn">View Details</button></Link>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Homepage;
