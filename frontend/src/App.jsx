import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./pages-firebase/NavBar";
import Login from "./pages-firebase/Login";
import Plans from "./pages-firebase/JourneyPlans";
import TravelLog from "./pages-firebase/TravelLog";
import TravelLogDetail from "./pages-firebase/TravelLogDetail";
import Home from "./pages-firebase/Home";
import Profile from "./pages-firebase/Profile";
import TravelPlanDetails from "./pages-firebase/TravelPlanDetails";
import PlacesMapPage from "./pages-firebase/PlacesMapPage";
import ProtectedRoute from "./pages-firebase/ProtectedRoute";
import "leaflet/dist/leaflet.css";
import Modal from "react-modal";
Modal.setAppElement("#root");

function App() {
  return (
    <div>
      <Router>
        <NavBar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />

          {/* Protected Travel Log Routes */}
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

          {/* Protected Journey Plans Routes */}
          <Route
            path="/journey-plans"
            element={
              <ProtectedRoute>
                <Plans />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plans/:planId"
            element={
              <ProtectedRoute>
                <TravelPlanDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <PlacesMapPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
