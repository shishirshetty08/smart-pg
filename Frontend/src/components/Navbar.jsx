// src/components/Navbar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store";
import { FaBars, FaTimes } from "react-icons/fa"; // Icons for hamburger menu
import { motion } from "framer-motion";

// Animation Variants
const menuVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function Navbar() {
  const { user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const userInitial = user ? user[0].toUpperCase() : "";
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-10 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center">
          <span className="mr-2">Stay Finder</span>
          {user && (
            <span className="bg-blue-100 text-blue-600 w-8 h-8 flex items-center justify-center rounded-full font-semibold">
              {userInitial}
            </span>
          )}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
          >
            Home
          </Link>
          <Link
            to="/listings"
            className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
          >
            Listings
          </Link>
          {role === "owner" && (
            <Link
              to="/owner-dashboard"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
            >
              Dashboard
            </Link>
          )}
          <button
            onClick={() => dispatch(logout())}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 font-semibold"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={menuVariants}
          className="md:hidden bg-white shadow-lg py-4 px-4 absolute top-16 left-0 w-full"
        >
          <div className="flex flex-col gap-4">
            <Link
              to="/"
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
            >
              Home
            </Link>
            <Link
              to="/listings"
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
            >
              Listings
            </Link>
            {role === "owner" && (
              <Link
                to="/owner-dashboard"
                onClick={toggleMenu}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
              >
              Dashboard
              </Link>
            )}
            <button
              onClick={() => {
                dispatch(logout());
                toggleMenu();
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 font-semibold w-full text-left"
            >
              Logout
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

export default Navbar;