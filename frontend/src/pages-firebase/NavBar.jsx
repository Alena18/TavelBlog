import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import NavLinks from "./NavLinks";
import "../App.css";
import "../Responsive.css";

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
      setMenuOpen(false);
      navigate(path);
    }
  };

  return (
    <>
      {/* Hamburger Button - shown on small screens */}
      <div className="nav-wrapper">
        <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {/* Full desktop nav & toggleable mobile menu */}
      <nav className="navbar">
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <NavLinks
            isLoggedIn={isLoggedIn}
            handleProtectedClick={handleProtectedClick}
            setMenuOpen={setMenuOpen}
          />
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
