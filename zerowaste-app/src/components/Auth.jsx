import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Donor"); // Default role
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const toggleMode = () => {
    setIsSignup((prev) => !prev);
    setError("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Set displayName in Firebase Auth profile
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // Save user data in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        email,
        role,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center", marginTop: "50px" }}>
      <h2>{isSignup ? "Sign Up" : "Log In"}</h2>
      <form onSubmit={isSignup ? handleSignup : handleLogin}>
        {isSignup && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ display: "block", width: "100%", marginBottom: "10px" }}
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              style={{ display: "block", width: "100%", marginBottom: "10px" }}
            >
              <option value="Donor">Donor</option>
              <option value="Receiver">Receiver</option>
            </select>
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
        />

        <button
          type="submit"
          style={{ padding: "10px 20px", marginBottom: "10px", cursor: "pointer" }}
        >
          {isSignup ? "Sign Up" : "Log In"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      <p onClick={toggleMode} style={{ color: "blue", cursor: "pointer" }}>
        {isSignup ? "Already have an account? Log in" : "Don't have an account? Sign up"}
      </p>
    </div>
  );
};

export default Auth;
