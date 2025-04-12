import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut as firebaseSignOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import CreateDonation from "./CreateDonation";
import MyDonations from "./MyDonations";
import { getDoc as getFirestoreDoc, doc as firestoreDoc } from "firebase/firestore";

const Dashboard = () => {
  const [userData, setUserData] = useState({ name: "", role: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userRef = firestoreDoc(db, "users", user.uid);
        const userSnap = await getFirestoreDoc(userRef);

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
    <div style={{ textAlign: "center", marginTop: "40px", color: "white" }}>
      <h1>
        Welcome,<br />
        <span style={{ fontWeight: "bold" }}>
          {userData.name || user?.email}
        </span>
      </h1>
      <p>Role: {userData.role}</p>

      <button onClick={handleLogout} style={{ padding: "10px 20px", marginBottom: "20px" }}>
        Logout
      </button>

      <CreateDonation />
      <MyDonations />
    </div>
  );
};

export default Dashboard;
