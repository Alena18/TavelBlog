import "../App";
import "../App.css";
import bgImage from "../assets/images/img.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [carState, setCarState] = useState("stop");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      localStorage.removeItem("userInfo");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const startCar = () => {
    setCarState("drive");
    const animation = document.getElementById("driveAnimation");
    if (animation) animation.beginElement();
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
      <div className="home-button-wrapper">
        <div className="home-button">
          {!isLoggedIn ? (
            <Link to="/login" className="button-text">
              Log In / Sign Up
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="button-text"
              id="signout-button"
            >
              Sign Out
            </button>
          )}
        </div>

        <div className="home-button">
          <button
            onClick={startCar}
            className="button-text"
            style={{
              outline: "none",
              boxShadow: "none",
              textDecoration: "none",
            }}
          >
            Start{" "}
            <span
              className="palm"
              style={{ fontSize: "1.2em", marginLeft: "5px" }}
            >
              🧳
            </span>
          </button>
        </div>
      </div>

      {/* SVG Car Route */}
      <div className="car-map-wrapper">
        <svg
          viewBox="0 0 1000 300"
          className="road-path"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sea */}
          <rect x="0" y="70" width="1000" height="300" fill="#a0e9ff" />

          {/* Hills */}
          <path
            d="
      M 0 100 
      Q 100 10, 200 90 
      T 400 90 
      T 600 90 
      T 800 90 
      T 1000 100 
      V 300 
      H 0 
      Z
    "
            fill="#88c57f"
          />

          {/* Group Road + Car */}
          <g transform="translate(0, 90)">
            {/* Curvier road */}
            <path
              d="M 0 60 C 150 0, 600 160, 1000 180"
              fill="none"
              stroke="#333"
              strokeWidth="20"
              strokeLinecap="round"
            />

            {/* Dashed center line & motion path */}
            <path
              id="motionPath"
              d="M 0 60 C 150 0, 600 160, 1000 180"
              fill="none"
              stroke="#fff"
              strokeWidth="4"
              strokeDasharray="12 6"
            />

            {/* Trees (more of them!) */}
            {[
              [30, 25],
              [100, 72],
              [150, 15],
              [200, 90],
              [250, 95],
              [320, 50],
              [400, 115],
              [500, 85],
              [600, 92],
              [720, 120],
              [800, 190],
              [900, 135],
            ].map(([x, y], i) => (
              <g key={i}>
                <rect x={x} y={y} width="4" height="10" fill="#663300" />
                <circle cx={x + 2} cy={y - 5} r="8" fill="#2e8b57" />
              </g>
            ))}

            {/* Car */}
            <image
              href="/images/ferrari.png"
              width="60"
              height="30"
              transform="translate(0, -12)"
              className="car-svg"
            >
              <animateMotion
                id="driveAnimation"
                dur="7s"
                repeatCount="1"
                fill="freeze"
                keyPoints="0;1"
                keyTimes="0;1"
                calcMode="linear"
              >
                <mpath href="#motionPath" />
              </animateMotion>
            </image>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default Home;
