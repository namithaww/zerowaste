import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const ReceiverDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableDonations = async () => {
      try {
        const q = query(collection(db, "donations"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const allDonations = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDonations(allDonations);
      } catch (error) {
        console.error("Error fetching donations for receiver:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableDonations();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h2>Receiver Dashboard</h2>

      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
        Logout
      </button>

      {loading ? (
        <p>Loading available donations...</p>
      ) : donations.length === 0 ? (
        <p>No donations available at the moment.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {donations.map((donation) => (
            <li
              key={donation.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "15px",
                maxWidth: "500px",
                margin: "auto",
              }}
            >
              <strong>Food Item:</strong> {donation.foodItem} <br />
              <strong>Quantity:</strong> {donation.quantity} <br />
              <strong>Location:</strong> {donation.location} <br />
              {donation.additionalInfo && (
                <>
                  <strong>Additional Info:</strong> {donation.additionalInfo} <br />
                </>
              )}
              <strong>Created:</strong>{" "}
              {donation.createdAt?.toDate().toLocaleString()}
              <br />
              <button style={{ marginTop: "10px" }}>Request</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReceiverDashboard;
