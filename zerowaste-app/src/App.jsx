import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import ReceiverDashboard from "./components/ReceiverDashboard";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

const App = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setRole(userData.role);
          navigate("/dashboard");
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      {user && role === "Donor" && (
        <Route path="/dashboard" element={<Dashboard />} />
      )}
      {user && role === "Receiver" && (
        <Route path="/dashboard" element={<ReceiverDashboard />} />
      )}
      <Route path="*" element={<Auth />} />
    </Routes>
  );
};

export default App;
