import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
      const res = await axios.post("http://localhost:5000/api/login", {
        username: userName,
        password: password,
      });

      setUserInfo(res.data.user);
      setIsLoggedIn(true);
      setError("");
      localStorage.setItem("userInfo", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("storage")); // trigger event
      navigate("/profile");
    } catch (err) {
      const message = err.response?.data?.error;

      if (message === "User not found") {
        alert("No account found for this username. Please sign up first.");
        setShowSignup(true); // Automatically open the signup form!
      } else if (message === "Incorrect password") {
        alert("Oops! Wrong password. Try again.");
      } else {
        alert("No account found for this username. Please sign up first.");
      }

      setError(message || "Login failed.");
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
      await axios.post("http://localhost:5000/api/signup", signupData);

      setShowSignup(false);
      setError("");

      // Show confirmation alert
      alert("Account created successfully! Please log in.");

      // Redirect explicitly to the login page
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-title">Login</h2>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={userName}
          placeholder="Username"
          onChange={(e) => setUserName(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
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
            {error.includes("sign up") && (
              <button onClick={() => setShowSignup(true)}>Sign Up Now</button>
            )}
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
