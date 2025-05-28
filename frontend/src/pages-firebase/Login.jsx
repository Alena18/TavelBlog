import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [signupData, setSignupData] = useState({
    username: "",
    password: "",
    email: "",
    address: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userName,
        password
      );
      const user = userCredential.user;

      setUserInfo(user);
      setIsLoggedIn(true);
      setError("");
      localStorage.setItem("userInfo", JSON.stringify(user));
      window.dispatchEvent(new Event("storage"));
      navigate("/profile");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/user-not-found") {
        alert("No account found for this email. Please sign up first.");
        setShowSignup(true);
      } else if (err.code === "auth/wrong-password") {
        alert("Oops! Wrong password. Try again.");
      } else {
        alert("Login failed. Please try again.");
      }
      setError(err.message || "Login failed.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (signupData.password.length < 8) {
      setError("Password must be at least 8 characters");
      alert("Password must be at least 8 characters");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signupData.email,
        signupData.password
      );
      const user = userCredential.user;

      // Store extra data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: signupData.username,
        address: signupData.address,
        email: signupData.email,
        createdAt: new Date(),
      });

      setShowSignup(false);
      setError("");
      alert("Account created successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.message || "Signup failed");
      alert(err.message || "Signup failed");
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-title">Login</h2>

        <label htmlFor="username">Email</label>
        <input
          type="email"
          id="username"
          value={userName}
          placeholder="Email"
          onChange={(e) => setUserName(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="button-group">
          <button type="submit">Login</button>
          <button type="button" onClick={() => setShowSignup(true)}>
            Sign Up
          </button>
        </div>

        {error && (
          <div className="error-msg">
            <p>{error}</p>
          </div>
        )}
      </form>

      {/* Signup Modal */}
      {showSignup && (
        <div className="signup-overlay">
          <div className="signup-panel">
            <h2 className="login-title">Sign Up</h2>
            <form onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Username"
                value={signupData.username}
                onChange={(e) =>
                  setSignupData({ ...signupData, username: e.target.value })
                }
                className="signup-input"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                className="signup-input"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={signupData.address}
                onChange={(e) =>
                  setSignupData({ ...signupData, address: e.target.value })
                }
                className="signup-input"
                required
              />
              <input
                type="password"
                placeholder="Password (min 8 chars)"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
                className="signup-input"
                required
              />

              <div className="button-group">
                <button type="submit">Create</button>
                <button type="button" onClick={() => setShowSignup(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
