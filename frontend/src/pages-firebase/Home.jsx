import "../App";
import "../App.css";
import bgImage from "../assets/images/img.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // true if user exists
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false); // optional; onAuthStateChanged will also trigger
      localStorage.removeItem("userInfo"); // clear stored session if used
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div>
      <h1>
        Welcome to Travel Blog <span className="palm">🏝️</span>
      </h1>

      {/* Background blur */}
      <div
        style={{
          backgroundImage: `url("${bgImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          opacity: 0.15,
          filter: "blur(1px)",
        }}
      ></div>

      {/* Login box */}
      {!isLoggedIn ? (
        <div className="home-login-wrapper">
          <div className="home-login-box">
            <Link to="/login" className="login-link">
              <div className="home-login">Log In / Sign Up</div>
            </Link>
          </div>
        </div>
      ) : (
        <div className="home-login-wrapper">
          <div className="home-login-box">
            <button onClick={handleLogout} className="login-link home-login">
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
