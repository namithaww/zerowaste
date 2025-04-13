import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const GeoMapDashboard = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "donations"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDonations(data);
    });

    return () => unsubscribe();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#FFB703";
      case "Accepted":
        return "#4CAF50";
      case "Completed":
        return "#2196F3";
      default:
        return "#999";
    }
  };

  const createCustomIcon = (color) =>
    L.divIcon({
      className: "custom-marker",
      html: `<div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 4px rgba(0,0,0,0.3);
      "></div>`,
    });

  return (
    <div style={{ height: "90vh", paddingTop: "10px" }}>
      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

{donations
  .filter(
    (donation) =>
      donation.location &&
      typeof donation.location.latitude === "number" &&
      typeof donation.location.longitude === "number"
  )
  .map((donation) => (
    <Marker
      key={donation.id}
      position={[donation.location.latitude, donation.location.longitude]}
      icon={createCustomIcon(getStatusColor(donation.status))}
    >
      <Popup>
        <strong>{donation.foodItem}</strong> <br />
        Quantity: {donation.quantity} <br />
        Status: <span style={{ color: getStatusColor(donation.status) }}>{donation.status}</span> <br />
        Donor: {donation.donorName || "Anonymous"}
      </Popup>
    </Marker>
))}

      </MapContainer>
    </div>
  );
};

export default GeoMapDashboard;
