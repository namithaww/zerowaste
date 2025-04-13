import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import TopBar from "../components/TopBar";
import GeoMapDashboard from "../components/GeoMapDashboard"; // Make sure this works

const ReceiverDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [receiverName, setReceiverName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false); // NEW

  const fetchData = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      setReceiverName(user.displayName || "Receiver");

      const donationSnapshot = await getDocs(collection(db, "donations"));
      const allDonations = donationSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const requestsQuery = query(
        collection(db, "requests"),
        where("receiverId", "==", user.uid)
      );
      const requestsSnapshot = await getDocs(requestsQuery);
      const myRequests = requestsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setDonations(allDonations);
      setRequests(myRequests);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (donationId) => {
    const user = auth.currentUser;
    try {
      const donationRef = doc(db, "donations", donationId);
      const donationSnap = await getDoc(donationRef);
      const donation = donationSnap.data();

      await addDoc(collection(db, "requests"), {
        donationId,
        foodName: donation.foodName,
        quantity: donation.quantity,
        receiverId: user.uid,
        receiverName: user.displayName || "Receiver",
        status: "Pending",
        message: "",
      });

      await updateDoc(donationRef, { status: "Pending" });

      fetchData();
    } catch (error) {
      console.error("Error requesting donation:", error);
    }
  };

  const handleMarkPicked = async (requestId, donationId) => {
    try {
      const requestRef = doc(db, "requests", requestId);
      const donationRef = doc(db, "donations", donationId);

      await updateDoc(requestRef, { status: "Picked" });
      await updateDoc(donationRef, { status: "Picked" });

      fetchData();
    } catch (error) {
      console.error("Error marking as picked:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const requestedDonationIds = requests.map((req) => req.donationId);
  const availableDonations = donations.filter(
    (donation) =>
      donation.status === "Pending" &&
      !requestedDonationIds.includes(donation.id)
  );

  return (
    <div style={styles.container}>
      <TopBar username={receiverName} onToggleMap={() => setShowMap(!showMap)} />

      {/* Map Section (Toggle with button) */}
      {showMap && (
        <section>
          <h3 style={styles.subheading}>Nearby Donations Map</h3>
          <div style={{ height: "400px", marginBottom: "30px" }}>
            <GeoMapDashboard />
          </div>
        </section>
      )}

      <section>
        <h3 style={styles.subheading}>Available Donations</h3>
        {availableDonations.length === 0 ? (
          <p style={styles.message}>No new donations available.</p>
        ) : (
          <ul style={styles.list}>
            {availableDonations.map((donation) => (
              <li key={donation.id} style={styles.card}>
                <p><strong>Item:</strong> {donation.foodName}</p>
                <p><strong>Quantity:</strong> {donation.quantity}</p>
                <p><strong>Status:</strong> {donation.status}</p>
                <button
                  style={styles.button}
                  onClick={() => handleRequest(donation.id)}
                >
                  Request Donation
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: "40px" }}>
        <h3 style={styles.subheading}>My Requested Donations</h3>
        {requests.length === 0 ? (
          <p style={styles.message}>You have not requested any donations.</p>
        ) : (
          <ul style={styles.list}>
            {requests.map((req) => (
              <li key={req.id} style={styles.card}>
                <p><strong>Item:</strong> {req.foodName || "—"}</p>
                <p><strong>Quantity:</strong> {req.quantity || "—"}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      color: getStatusColor(req.status),
                      fontWeight: 600,
                    }}
                  >
                    {req.status}
                  </span>
                </p>

                {req.status === "Accepted" && (
                  <button
                    style={styles.pickedButton}
                    onClick={() => handleMarkPicked(req.id, req.donationId)}
                  >
                    Mark as Picked
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "#FF9800";
    case "Accepted":
      return "#4CAF50";
    case "Picked":
      return "#3f51b5";
    case "Verified":
      return "#2e7d32";
    case "Rejected":
      return "#f44336";
    default:
      return "#555";
  }
};

const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },
  subheading: {
    fontSize: "20px",
    marginTop: "20px",
    color: "#006A71",
    textAlign: "center",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  card: {
    backgroundColor: "#F2EFE7",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "16px",
    maxWidth: "600px",
    margin: "auto",
    textAlign: "left",
    boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
  },
  message: {
    fontSize: "16px",
    color: "#555",
    textAlign: "center",
  },
  button: {
    marginTop: "10px",
    backgroundColor: "#48A6A7",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  pickedButton: {
    marginTop: "10px",
    backgroundColor: "#3f51b5",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default ReceiverDashboard;
