// src/AppWrapper.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./features/home/Home";
import Listings from "./features/listings/Listings";
import OwnerDashboard from "./features/listings/OwnerDashboard";
import Signup from "./features/auth/Signup";
import Login from "./features/auth/Login";
import FlatmateForm from "./features/listings/FlatmateForm";
import RoommateForm from "./features/listings/RoommateForm";
import RoomForm from "./features/listings/RoomForm";
import EntireHouseForm from "./features/listings/EntireHouseForm";
import PGForm from "./features/listings/PGForm";
import ColivingForm from "./features/listings/ColivingForm";

function AppWrapper() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/owner-dashboard/flatmate" element={<FlatmateForm />} />
        <Route path="/owner-dashboard/roommate" element={<RoommateForm />} />
        <Route path="/owner-dashboard/room" element={<RoomForm />} />
        <Route path="/owner-dashboard/entire-house" element={<EntireHouseForm />} />
        <Route path="/owner-dashboard/pg" element={<PGForm />} />
        <Route path="/owner-dashboard/coliving" element={<ColivingForm />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default AppWrapper;