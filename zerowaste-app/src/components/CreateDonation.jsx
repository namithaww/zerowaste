import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase";

const CreateDonation = () => {
  const [foodItem, setFoodItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [type, setType] = useState("");
  const [pickupDeadline, setPickupDeadline] = useState("");
  const [location, setLocation] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  const getLocation = () => {
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = pos.coords;
        setLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        setGettingLocation(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Failed to get location");
        setGettingLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      alert("Please provide your location before submitting.");
      return;
    }

    await addDoc(collection(db, "donations"), {
      foodItem,
      quantity,
      type,
      pickupDeadline: new Date(pickupDeadline),
      additionalInfo,
      location,
      status: "Pending",
      donorId: auth.currentUser.uid,
      donorName: auth.currentUser.displayName || "Anonymous",
      createdAt: new Date(),
    });

    // Reset form
    setFoodItem("");
    setQuantity("");
    setType("");
    setPickupDeadline("");
    setAdditionalInfo("");
    setLocation(null);
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>Create a Donation</h2>

        <input
          type="text"
          placeholder="Food Item"
          value={foodItem}
          onChange={(e) => setFoodItem(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          style={styles.input}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          style={styles.input}
        >
          <option value="">Select Type</option>
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
          <option value="Perishable">Perishable</option>
          <option value="Non-Perishable">Non-Perishable</option>
        </select>

        <input
          type="datetime-local"
          value={pickupDeadline}
          onChange={(e) => setPickupDeadline(e.target.value)}
          required
          style={styles.input}
        />

        <textarea
          placeholder="Additional Info"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          style={styles.textarea}
        />

        <button
          type="button"
          onClick={getLocation}
          style={{ ...styles.button, backgroundColor: "#48A6A7" }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#006A71")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#48A6A7")}
        >
          {gettingLocation ? "Getting Location..." : "📍 Give My Location"}
        </button>

        {location && (
          <p style={{ fontSize: "14px", color: "#006A71", margin: 0 }}>
            Location saved: ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
          </p>
        )}

        <button
          type="submit"
          style={{ ...styles.button, backgroundColor: "#48A6A7" }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#006A71")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#48A6A7")}
        >
          🚀 Create Donation
        </button>
      </form>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: "#9ACBD0",
    minHeight: "100vh",
    paddingTop: "40px",
    paddingBottom: "40px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    maxWidth: "400px",
    margin: "0 auto",
    background: "#F2EFE7",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "10px",
    color: "#006A71",
    fontSize: "29px",
    fontFamily: "'Poppins', sans-serif",
    fontWeight: "700",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    backgroundColor: "#9ACBD0",
    color: "#000",
  },
  textarea: {
    padding: "12px",
    fontSize: "16px",
    height: "80px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    backgroundColor: "#9ACBD0",
    color: "#000",
  },
  button: {
    padding: "12px",
    color: "white",
    fontWeight: "bold",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
};

export default CreateDonation;
