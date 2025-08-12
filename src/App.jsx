import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useWallet } from "./hooks/useWallet";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
// import AsteroidMap from "./pages/AsteroidMap";

function App() {
  const { isConnected } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("isConnected:", isConnected); // Debug log
    if (isConnected) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, [isConnected, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* <Route path="/dashboard" element={<AsteroidMap />} /> */}
      <Route path="*" element={<Home />} /> {/* Fallback route */}
    </Routes>
  );
}

export default App;
