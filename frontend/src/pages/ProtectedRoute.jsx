import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (!user?.id) {
      navigate(-1); // Go back instead of redirecting to /login
    }
  }, [navigate, user]);

  // If user is valid, show the page
  return user?.id ? children : null;
}

export default ProtectedRoute;
