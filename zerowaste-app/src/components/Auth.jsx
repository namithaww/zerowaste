// Auth.jsx
import React from "react";
import { auth, db } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Auth = () => {
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Google Login Successful:", user);

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          role: "donor",
          createdAt: new Date(),
        });
        console.log("New user document created in Firestore.");
      } else {
        console.log("User already exists in Firestore.");
      }
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundImage: "url('https://images.unsplash.com/photo-1581090700227-1b664b0906c9?auto=format&fit=crop&w=1350&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          padding: "40px 30px",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
          minWidth: "350px",
          maxWidth: "400px",
        }}
      >
        <h1 style={{ marginBottom: "24px", color: "#333", fontSize: "32px", fontWeight: "bold" }}>
          Welcome to <span style={{ color: "#4CAF50" }}>ZeroWaste</span>
        </h1>
        <p style={{ marginBottom: "30px", color: "#666", fontSize: "16px" }}>
          Sign in to continue
        </p>

        <button
          onClick={handleGoogleLogin}
          style={{
            backgroundColor: "#4285F4",
            color: "white",
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            justifyContent: "center",
            width: "100%",
            transition: "all 0.3s ease",
          }}
          className="google-login-button"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google Logo"
            style={{ width: "20px", height: "20px" }}
          />
          Sign in with Google
        </button>
      </div>

      <style>
        {`
          .google-login-button:hover {
            background-color: #357ae8;
          }
        `}
      </style>
    </div>
  );
};

export default Auth;