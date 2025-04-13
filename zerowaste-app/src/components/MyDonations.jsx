import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const fetchMyDonations = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "donations"),
        where("donorId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const myDonations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setDonations(myDonations);
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDonations();
  }, []);

  return (
    <div style={styles.container}>
      <button onClick={() => setIsOpen(!isOpen)} style={styles.button}>
        {isOpen ? "Hide My Donations" : "View My Donations"}
      </button>

      {isOpen && (
        <div style={styles.donationsContainer}>
          <h2 style={styles.heading}>My Donations</h2>
          {loading ? (
            <p style={styles.message}>Loading your donations...</p>
          ) : donations.length === 0 ? (
            <p style={styles.message}>You haven't made any donations yet.</p>
          ) : (
            <ul style={styles.list}>
              {donations.map((donation) => (
                <li key={donation.id} style={styles.card}>
                  <p><strong>Food Item:</strong> {donation.foodItem}</p>
                  <p><strong>Quantity:</strong> {donation.quantity}</p>
                  {donation.location && (
                    <p>
                      <strong>Pickup Location:</strong>{" "}
                      Lat: {donation.location.latitude}, Lng: {donation.location.longitude}{" "}
                      <a
                        href={`https://www.google.com/maps?q=${donation.location.latitude},${donation.location.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        🗺️
                      </a>
                    </p>
                  )}
                  {donation.additionalInfo && (
                    <p><strong>Additional Info:</strong> {donation.additionalInfo}</p>
                  )}
                  <p>
                    <strong>Created:</strong>{" "}
                    {donation.createdAt?.toDate().toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
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
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#06A77D", // Nice green-blue from palette
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  donationsContainer: {
    marginTop: "30px",
  },
  heading: {
    color: "#006A71",
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "20px",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  card: {
    backgroundColor: "#F2EFE7", // card background
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
};

export default MyDonations;
