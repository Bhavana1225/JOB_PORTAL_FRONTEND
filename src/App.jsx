import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import JobDetails from "./pages/JobDetails";
import ApplicationForm from "./pages/ApplicationForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import EditJob from "./pages/EditJob";
import ApplicationsDashboard from "./pages/ApplicationsDashboard";
import PostJob from "./pages/PostJob";
import Navbar from "./components/Navbar";
import { useUser } from "./context/UserContext";

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user } = useUser();

  return (
    <div>
      <header>
        <Navbar />
      </header>

      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/apply/:id" element={<ApplicationForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected route for all logged-in users */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Employer routes */}
          {user?.role === "employer" && (
            <>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/post-job"
                element={
                  <ProtectedRoute>
                    <PostJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-job/:id"
                element={
                  <ProtectedRoute>
                    <EditJob />
                  </ProtectedRoute>
                }
              />
            </>
          )}

          {/* Jobseeker routes */}
          {user?.role === "jobseeker" && (
            <>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/applications"
                element={
                  <ProtectedRoute>
                    <ApplicationsDashboard />
                  </ProtectedRoute>
                }
              />
            </>
          )}

          {/* Fallback route for unknown paths */}
          <Route path="*" element={<h2 style={{ textAlign: "center", marginTop: "50px" }}>404 - Page Not Found</h2>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
