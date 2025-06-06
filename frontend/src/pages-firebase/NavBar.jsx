import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import "../App.css";

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showGamesDropdown, setShowGamesDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setIsLoggedIn(true);
        setUser(currentUser);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleProtectedClick = (e, path) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-links">
          <Link to="/">Home</Link>

          <a
            href="/journey-plans"
            onClick={(e) => handleProtectedClick(e, "/journey-plans")}
          >
            Journey Plans
          </a>

          <a
            href="/travel-log"
            onClick={(e) => handleProtectedClick(e, "/travel-log")}
          >
            Travel Log
          </a>

          {/* Games dropdown styled like a nav link */}
          <div
            onMouseEnter={() => setShowGamesDropdown(true)}
            onMouseLeave={() => setShowGamesDropdown(false)}
            style={{
              position: "relative",
              padding: "0.5rem 0",
              fontWeight: "500",
              fontSize: "1.1rem",
            }}
          >
            <span
              style={{
                color: "white",
                textDecoration: "none",
                padding: "0.5rem",
                cursor: "pointer",
              }}
            >
              Games
            </span>
            {showGamesDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  background: "#fff",
                  border: "1px solid #ddd",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  zIndex: 10,
                }}
              >
                <a
                  href="https://alena18.github.io/FlashcardsEnglishBelarusianPetsMemoryGame/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    padding: "8px 12px",
                    textDecoration: "none",
                    color: "#333",
                    whiteSpace: "nowrap",
                  }}
                >
                  Flashcards Memory Game
                </a>
                <a
                  href="https://hangadictator.onrender.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    padding: "8px 12px",
                    textDecoration: "none",
                    color: "#333",
                    whiteSpace: "nowrap",
                  }}
                >
                  Hang Dictator
                </a>
              </div>
            )}
          </div>
          <a href="/map" onClick={(e) => handleProtectedClick(e, "/map")}>
            Map
          </a>
          {!isLoggedIn ? (
            <Link to="/login">Login</Link>
          ) : (
            <Link to="/profile" className="profile-icon" title="Your Profile">
              <FaUserCircle size={32} color="white" />
            </Link>
          )}
        </div>
      </nav>

      {showAlert && (
        <div className="navbar-alert">
          You need to sign in to access this section.
        </div>
      )}
    </>
  );
}

export default NavBar;
