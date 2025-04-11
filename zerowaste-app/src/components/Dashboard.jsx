import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import CreateDonation from "./CreateDonation";
import MyDonations from "./MyDonations";

const Dashboard = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userRole = docSnap.data().role;
        setRole(userRole.toLowerCase()); // Normalize to lowercase
      } else {
        console.log("No such document!");
      }
    };

    fetchUserRole();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to ZeroWaste Dashboard</h1>

      {role === "donor" && (
        <>
          <p>You are a Donor. You can create food donation listings here.</p>
          <CreateDonation />
          <MyDonations/>
        </>
      )}

      {role === "receiver" && (
        <p>You are a Receiver. You can explore food listings near you.</p>
      )}

      {!role && <p>Loading your role...</p>}

      <br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
