import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./features/home/Home";
import Listings from "./features/listings/Listings";
import OwnerDashboard from "./features/listings/OwnerDashboard";
import Signup from "./features/auth/Signup";
import Login from "./features/auth/Login";

function AppWrapper() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      {user ? (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/owner-dashboard" element={<OwnerDashboard />} />
            <Route path="*" element={<Home />} />
          </Routes>
          <Footer />
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Signup />} />
        </Routes>
      )}
    </Router>
  );
}

export default AppWrapper;