// components/NavLinks.jsx
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";

function NavLinks({ isLoggedIn, handleProtectedClick, setMenuOpen }) {
  const [showGamesDropdown, setShowGamesDropdown] = useState(false);

  return (
    <>
      <Link to="/" onClick={() => setMenuOpen(false)}>
        Home
      </Link>

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

      {/* Games dropdown should come before Map, as in original layout */}
      <div
        onMouseEnter={() => setShowGamesDropdown(true)}
        onMouseLeave={() => setShowGamesDropdown(false)}
        className="games-dropdown-wrapper"
      >
        Games
        {showGamesDropdown && (
          <div className="games-dropdown-menu">
            <a
              href="https://alena18.github.io/FlashcardsEnglishBelarusianPetsMemoryGame/"
              target="_blank"
              rel="noopener noreferrer"
              className="games-dropdown-link"
            >
              Flashcards Memory Game
            </a>
            <a
              href="https://alena18.github.io/JavaMaze/"
              target="_blank"
              rel="noopener noreferrer"
              className="games-dropdown-link"
            >
              Maze
            </a>
            <a
              href="https://hangadictator.onrender.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="games-dropdown-link"
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
        <Link to="/login" onClick={() => setMenuOpen(false)}>
          Login
        </Link>
      ) : (
        <Link
          to="/profile"
          className="profile-icon"
          title="Your Profile"
          onClick={() => setMenuOpen(false)}
        >
          <FaUserCircle size={24} color="white" />
        </Link>
      )}
    </>
  );
}

export default NavLinks;
