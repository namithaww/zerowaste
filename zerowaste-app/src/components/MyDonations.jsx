import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setDonations([]);
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "donations"),
          where("donorId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);
        const donationList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDonations(donationList);
      } catch (err) {
        console.error("Error fetching donations:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
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
              {donation.createdAt
                ? donation.createdAt.toDate().toLocaleString()
                : "Just now"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyDonations;
