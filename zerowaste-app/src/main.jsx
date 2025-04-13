// src/main.jsx
import './Styles/global.css';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
// import "./index.css";
import { BrowserRouter } from "react-router-dom";
import 'leaflet/dist/leaflet.css'; // Required globally

// import { AuthProvider } from "./context/AuthContext"; // 👈 import it

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <AuthProvider> */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    {/* </AuthProvider> */}
  </React.StrictMode>
);
