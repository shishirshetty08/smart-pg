// src/AppWrapper.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./features/home/Home";
import Listings from "./features/listings/Listings";
import OwnerDashboard from "./features/listings/OwnerDashboard";
import Signup from "./features/auth/Signup";
import Login from "./features/auth/Login";

function AppWrapper() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default AppWrapper;