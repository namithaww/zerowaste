import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

const ReceiverDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestedIds, setRequestedIds] = useState([]);

  useEffect(() => {
    const fetchAvailableDonations = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // Fetch donations already requested by the user
      const reqQuery = query(collection(db, "requests"), where("receiverId", "==", user.uid));
      const reqSnapshot = await getDocs(reqQuery);
      const alreadyRequested = reqSnapshot.docs.map((doc) => doc.data().donationId);
      setRequestedIds(alreadyRequested);

      // Fetch all donations not made by the current user
      const donationQuery = query(collection(db, "donations"), where("donorId", "!=", user.uid));
      const donationSnapshot = await getDocs(donationQuery);

      const donationList = donationSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((donation) => !alreadyRequested.includes(donation.id)); // Exclude requested

      setDonations(donationList);
      setLoading(false);
    };

    fetchAvailableDonations();
  }, []);

  const handleRequest = async (donationId) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await addDoc(collection(db, "requests"), {
        donationId,
        receiverId: user.uid,
        status: "Pending",
        createdAt: new Date(),
      });

      setRequestedIds((prev) => [...prev, donationId]);
    } catch (err) {
      console.error("Error requesting donation:", err);
    }
  };

  if (loading) return <p>Loading donations...</p>;

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Available Donations</h2>
      {donations.length === 0 ? (
        <p>No available donations right now.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {donations.map((donation) => (
            <li key={donation.id} style={{ border: "1px solid #ccc", margin: "10px auto", padding: "10px", maxWidth: "500px" }}>
              <strong>Food Item:</strong> {donation.foodItem} <br />
              <strong>Quantity:</strong> {donation.quantity} <br />
              <strong>Location:</strong> {donation.location} <br />
              <button
                onClick={() => handleRequest(donation.id)}
                disabled={requestedIds.includes(donation.id)}
              >
                {requestedIds.includes(donation.id) ? "Requested" : "Request Donation"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReceiverDashboard;
