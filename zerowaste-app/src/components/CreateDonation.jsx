import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const CreateDonation = ({ onDonationCreated }) => {
  const [formData, setFormData] = useState({
    foodItem: "",
    quantity: "",
    location: "",
    additionalInfo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      await addDoc(collection(db, "donations"), {
        ...formData,
        donorId: user.uid,
        createdAt: serverTimestamp(),
      });

      setSuccessMsg("Donation listing created successfully!");
      setFormData({
        foodItem: "",
        quantity: "",
        location: "",
        additionalInfo: "",
      });

      if (onDonationCreated) {
        onDonationCreated(); // 👈 notify parent to refresh list
      }
    } catch (error) {
      console.error("Error adding donation: ", error);
      setSuccessMsg("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Create a Donation</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
        <input
          type="text"
          name="foodItem"
          placeholder="Food Item"
          value={formData.foodItem}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="text"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="text"
          name="location"
          placeholder="Pickup Location"
          value={formData.location}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <textarea
          name="additionalInfo"
          placeholder="Additional Info"
          value={formData.additionalInfo}
          onChange={handleChange}
          rows="3"
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <button type="submit" disabled={isSubmitting} style={{ padding: "10px 20px" }}>
          {isSubmitting ? "Submitting..." : "Create Donation"}
        </button>
      </form>
      {successMsg && <p style={{ marginTop: "15px" }}>{successMsg}</p>}
    </div>
  );
};

export default CreateDonation;
