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
      setTimeout(() => setShowAlert(false), 3000); // Hide after 3 sec
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

          {!isLoggedIn ? (
            <Link to="/login">Login</Link>
          ) : (
            <Link to="/profile" className="profile-icon" title="Your Profile">
              <FaUserCircle size={32} color="white" />
            </Link>
          )}
        </div>
      </nav>

      {/* Inline Alert Banner */}
      {showAlert && (
        <div className="navbar-alert">
          You need to sign in to access this section.
        </div>
      )}
    </>
  );
}

export default NavBar;
