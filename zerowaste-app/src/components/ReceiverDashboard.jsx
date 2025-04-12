import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ReceiverDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [requested, setRequested] = useState([]);
  const navigate = useNavigate();

  const fetchDonations = async () => {
    const querySnapshot = await getDocs(collection(db, "donations"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setDonations(data);
  };

  const handleRequest = async (donationId) => {
    const donation = donations.find((d) => d.id === donationId);
    if (donation) {
      await addDoc(collection(db, "requests"), {
        donationId,
        receiverId: auth.currentUser.uid,
        receiverName: auth.currentUser.displayName,
        status: "Pending",
        ...donation,
      });
      setRequested((prev) => [...prev, donationId]);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2>Receiver Dashboard</h2>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>

        <div style={styles.cardGrid}>
          {donations.map((donation) => (
            <div key={donation.id} style={styles.card}>
              <p><strong>Food Item:</strong> {donation.foodItem}</p>
              <p><strong>Quantity:</strong> {donation.quantity}</p>
              <p><strong>Location:</strong> {donation.location}</p>
              <p><strong>Additional Info:</strong> {donation.additionalInfo}</p>
              <button
                onClick={() => handleRequest(donation.id)}
                style={requested.includes(donation.id) ? styles.disabledBtn : styles.requestBtn}
                disabled={requested.includes(donation.id)}
              >
                {requested.includes(donation.id) ? "Requested" : "Request Donation"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: "#121212",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",  // centers horizontally
    alignItems: "center",      // centers vertically
    padding: "40px"
  },
  container: {
    maxWidth: "900px",
    width: "100%",
    color: "#ffffff",
    fontFamily: "Segoe UI, sans-serif"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px"
  },
  logoutBtn: {
    backgroundColor: "#e53935",
    border: "none",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "5px",
    cursor: "pointer"
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px"
  },
  card: {
    backgroundColor: "#1e1e1e",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
  },
  requestBtn: {
    marginTop: "10px",
    backgroundColor: "#00bcd4",
    border: "none",
    color: "#000",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer"
  },
  disabledBtn: {
    marginTop: "10px",
    backgroundColor: "#555",
    border: "none",
    color: "#aaa",
    padding: "10px",
    borderRadius: "5px",
    cursor: "not-allowed"
  }
};

export default ReceiverDashboard;
