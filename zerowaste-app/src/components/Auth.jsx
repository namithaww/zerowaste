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

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        email,
        role,
      });
      window.location.replace("/dashboard");
    } catch (err) {
      let errorMessage = "Signup failed. Please try again.";
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "Email is already in use.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email.";
      }
      console.error(err.message);
      setError(errorMessage);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.replace("/dashboard");
    } catch (err) {
      let errorMessage = "Invalid email or password.";
      if (err.code === "auth/user-not-found") {
        errorMessage = "No user found with this email.";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      }
      console.error(err.message);
      setError(errorMessage);
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
        </form>

        {error && <p style={styles.error}>{error}</p>}

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
    background: "#F2EFE7",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Poppins', sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#FFFFFF",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    fontSize: "24px",
    color: "#006A71",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #9ACBD0",
    backgroundColor: "#F2EFE7",
    color: "#333",
    fontSize: "15px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#48A6A7",
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
    color: "#006A71",
    cursor: "pointer",
    fontWeight: "500",
  },
  error: {
    color: "#f44336",
    marginTop: "10px",
    fontSize: "14px",
  },
};

export default Auth;
