import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import "./styles/style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter basename="/JOB_PORTAL_FRONTEND">
        <App />
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);
