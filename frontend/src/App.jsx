import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./pages/NavBar";
import Login from "./pages/Login";
import Plans from "./pages/JourneyPlans";
import TravelLog from "./pages/TravelLog";
import TravelLogDetail from "./pages/TravelLogDetail";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  return (
    <div>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Travel Logs Routes */}
          <Route
            path="/travel-log"
            element={
              <ProtectedRoute>
                <TravelLog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/travel-log/:id"
            element={
              <ProtectedRoute>
                <TravelLogDetail />
              </ProtectedRoute>
            }
          />

          {/* Journey Plans Routes */}
          <Route
            path="/journey-plans"
            element={
              <ProtectedRoute>
                <Plans />
              </ProtectedRoute>
            }
          />

          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
