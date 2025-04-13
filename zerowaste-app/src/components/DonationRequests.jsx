import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

const DonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      const donationsQuery = query(
        collection(db, "donations"),
        where("donorId", "==", user.uid)
      );
      const donationsSnapshot = await getDocs(donationsQuery);
      const donations = donationsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const requestPromises = donations.map(async (donation) => {
        const reqQuery = query(
          collection(db, "requests"),
          where("donationId", "==", donation.id)
        );
        const reqSnapshot = await getDocs(reqQuery);
        return reqSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          donationInfo: donation,
        }));
      });

      const requestsArrays = await Promise.all(requestPromises);
      const allRequests = requestsArrays.flat();
      setRequests(allRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, donationId, newStatus) => {
    try {
      const requestRef = doc(db, "requests", requestId);
      const donationRef = doc(db, "donations", donationId);
      await updateDoc(requestRef, { status: newStatus });
      await updateDoc(donationRef, { status: newStatus });
      fetchRequests();
    } catch (error) {
      console.error("Error updating request status:", error);
    }
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

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Donation Requests</h2>
      {loading ? (
        <p style={styles.message}>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p style={styles.message}>No requests yet.</p>
      ) : (
        <ul style={styles.list}>
          {requests.map((request) => (
            <li key={request.id} style={styles.card}>
              <p><strong>Donation ID:</strong> {request.donationId}</p>
              <p><strong>Donation Item:</strong> {request.donationInfo?.foodItem || "—"}</p>
              <p><strong>Quantity:</strong> {request.donationInfo?.quantity || "—"}</p>
              <p><strong>Receiver Name:</strong> {request.receiverName}</p>
              {/* <p><strong>Message:</strong> {request.message?.additionalInfo || "—"}</p> */}
              <p>
                <strong>Status:</strong>{" "}
                <span style={{ color: getStatusColor(request.status), fontWeight: 600 }}>
                  {request.status}
                </span>
              </p>

              {request.status === "Pending" && (
                <div style={styles.buttonGroup}>
                  <button
                    style={styles.acceptButton}
                    onClick={() => handleStatusUpdate(request.id, request.donationId, "Accepted")}
                  >
                    Accept
                  </button>
                  <button
                    style={styles.rejectButton}
                    onClick={() => handleStatusUpdate(request.id, request.donationId, "Rejected")}
                  >
                    Reject
                  </button>
                </div>
              )}

              {request.status === "Picked" && (
                <div style={styles.buttonGroup}>
                  <button
                    style={styles.verifyButton}
                    onClick={() => handleStatusUpdate(request.id, request.donationId, "Verified")}
                  >
                    Verify Pickup
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginTop: "40px",
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif",
  },
  heading: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#006A71",
    marginBottom: "20px",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  card: {
    backgroundColor: "#F2EFE7",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    maxWidth: "600px",
    margin: "auto",
    textAlign: "left",
  },
  message: {
    fontSize: "16px",
    color: "#444",
  },
  buttonGroup: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
  },
  acceptButton: {
    backgroundColor: "#48A6A7",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  rejectButton: {
    backgroundColor: "#ff5e5b",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  verifyButton: {
    backgroundColor: "#2e7d32",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default DonationRequests;
