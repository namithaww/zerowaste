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
  const [role, setRole] = useState("Donor");
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
      await updateProfile(userCredential.user, { displayName: name });
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
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isSignup ? "Sign Up" : "Log In"}</h2>
        <form onSubmit={isSignup ? handleSignup : handleLogin} style={styles.form}>
          {isSignup && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={styles.input}
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                style={styles.input}
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
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            {isSignup ? "Sign Up" : "Log In"}
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
        <p onClick={toggleMode} style={styles.toggle}>
          {isSignup ? "Already have an account? Log in" : "Don't have an account? Sign up"}
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    background: "#121212",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#1E1E1E",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    fontSize: "24px",
    color: "#ffffff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #444",
    backgroundColor: "#2C2C2C",
    color: "#fff",
    fontSize: "15px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#00BCD4", // cyan
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    transition: "background 0.3s",
  },
  toggle: {
    marginTop: "15px",
    color: "#90CAF9", // light blue
    cursor: "pointer",
    fontWeight: "500",
  },
  error: {
    color: "#FF5252",
    marginTop: "10px",
    fontSize: "14px",
  },
};

export default Auth;
