import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut as firebaseSignOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import CreateDonation from "./CreateDonation";
import MyDonations from "./MyDonations";
import "./DonorDashboard.css"; // CSS styles

const Dashboard = () => {
  const [userData, setUserData] = useState({ name: "", role: "" });
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
        } else {
          console.warn("User document does not exist in Firestore.");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const user = auth.currentUser;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>
          Welcome,
          <br />
          <span>{userData.name || user?.email}</span>
        </h1>
        <p className="role-text">Role: {userData.role}</p>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="create-section">
          {/* <h2>Create a Donation</h2> */}
          <CreateDonation />
        </div>
        <div className="my-donations-section">
          {/* <h2>My Donations</h2> */}
          <MyDonations />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
