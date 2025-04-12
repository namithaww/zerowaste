import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Loading your donations...</p>;

  return (
    <div style={{ marginTop: "40px", textAlign: "center" }}>
      <h2>My Donations</h2>
      {donations.length === 0 ? (
        <p>You haven't made any donations yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {donations.map((donation) => (
            <li
              key={donation.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "10px",
                marginBottom: "15px",
                maxWidth: "500px",
                margin: "auto",
              }}
            >
              <strong>Food Item:</strong> {donation.foodItem} <br />
              <strong>Quantity:</strong> {donation.quantity} <br />
              <strong>Pickup Location:</strong> {donation.location} <br />
              {donation.additionalInfo && (
                <>
                  <strong>Additional Info:</strong> {donation.additionalInfo} <br />
                </>
              )}
              <strong>Created:</strong>{" "}
              {donation.createdAt?.toDate().toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyDonations;
