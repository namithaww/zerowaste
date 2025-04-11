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
        // Automatically add user to Firestore with default role
        await setDoc(userDocRef, {
          email: user.email,
          role: "donor", // default role
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
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Login to ZeroWaste</h1>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
    </div>
  );
};

export default Auth;
