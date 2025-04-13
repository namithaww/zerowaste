import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import CreateDonation from "./CreateDonation";
import MyDonations from "./MyDonations";
import DonationRequests from "./DonationRequests";
import TopBar from "../components/TopBar";
import "./DonorDashboard.css";

const Dashboard = () => {
  const [userData, setUserData] = useState({ name: "", role: "" });
  const [activeTab, setActiveTab] = useState("create");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "create":
        return <CreateDonation />;
      case "myDonations":
        return <MyDonations />;
      case "requests":
        return <DonationRequests />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-wrapper">
      <TopBar username={userData.name || auth.currentUser?.email} />

      <aside className="sidebar">
        <h2 className="sidebar-title">Donor</h2>
        <p className="sidebar-subtitle">{userData.name || auth.currentUser?.email}</p>
        <button onClick={() => setActiveTab("create")} className={activeTab === "create" ? "active" : ""}>➕ Create</button>
        <button onClick={() => setActiveTab("myDonations")} className={activeTab === "myDonations" ? "active" : ""}>📦 My Donations</button>
        <button onClick={() => setActiveTab("requests")} className={activeTab === "requests" ? "active" : ""}>📥 Requests</button>
      </aside>

      <main className="dashboard-main">
        <h1 className="dashboard-header">
          {activeTab === "create"
            ? "Create Donation"
            : activeTab === "myDonations"
            ? "My Donations"
            : "Requests"}
        </h1>
        <div className="dashboard-content">{renderTabContent()}</div>
      </main>
    </div>
  );
};

export default Dashboard;
