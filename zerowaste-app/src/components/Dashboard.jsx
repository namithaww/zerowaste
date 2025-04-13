import React, { useState } from "react";
import CreateDonation from "./CreateDonation";
import MyDonations from "./MyDonations";
import DonationRequests from "./DonationRequests";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./DonorDashboard.css";

const DonorDashboard = () => {
  const [activeTab, setActiveTab] = useState("create");
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = () => {
    signOut(auth).then(() => navigate("/"));
  };

  return (
    <div className="dashboard-wrapper">
      <div className="sidebar">
        <h2 className="sidebar-title">Donor</h2>
        <p className="sidebar-subtitle">{user?.displayName || "Donor"}</p>

        <button
          className={activeTab === "create" ? "active" : ""}
          onClick={() => setActiveTab("create")}
        >
          ➕ Create
        </button>
        <button
          className={activeTab === "myDonations" ? "active" : ""}
          onClick={() => setActiveTab("myDonations")}
        >
          📦 My Donations
        </button>
        <button
          className={activeTab === "requests" ? "active" : ""}
          onClick={() => setActiveTab("requests")}
        >
          📋 Requests
        </button>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-main">
        <div className="dashboard-header">
          <span style={{ fontWeight: 700, color: "#006A71" }}>ZeroWaste</span>
          <span style={{ marginLeft: 10, fontWeight: 400 }}>
            Hi, {user?.displayName?.split(" ")[0]}
          </span>
          <div style={{ float: "right" }}>
            <button
              onClick={() => navigate("/map")}
              style={{
                marginRight: 10,
                padding: "6px 12px",
                backgroundColor: "#48A6A7",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              View Map
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: "6px 12px",
                backgroundColor: "#e53935",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="dashboard-content">
          {activeTab === "create" && <CreateDonation />}
          {activeTab === "myDonations" && <MyDonations />}
          {activeTab === "requests" && <DonationRequests />}
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
