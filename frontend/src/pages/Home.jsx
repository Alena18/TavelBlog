import "../App";
import "../App.css";
import bgImage from "../assets/images/img.png";

function Home() {
  return (
    <div>
      <h1>
        Welcome to Travel Blog <span className="palm">🏝️</span>
      </h1>
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
    </div>
  );
}

export default Home;
