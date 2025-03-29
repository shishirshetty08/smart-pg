import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

const dropdownVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

function Navbar() {
  const { user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-20 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary-500">
          Stay Finder
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/listings"
            className="text-neutral-700 hover:text-primary-500 transition-colors duration-300 font-medium"
          >
            Listings
          </Link>
          {role === "owner" && (
            <Link
              to="/owner-dashboard"
              className="text-neutral-700 hover:text-primary-500 transition-colors duration-300 font-medium"
            >
              Dashboard
            </Link>
          )}
          <div className="relative">
            <button
              onClick={toggleProfileDropdown}
              className="text-neutral-700 hover:text-primary-500 transition-colors duration-300"
            >
              <FaUser size={24} />
            </button>
            {isProfileDropdownOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={dropdownVariants}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10"
              >
                {user ? (
                  <>
                    <span className="block px-4 py-2 text-neutral-700 text-sm">
                      {user.split("@")[0]}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-neutral-700 hover:bg-primary-50 hover:text-primary-500 transition-colors duration-300"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-neutral-700 hover:bg-primary-50 hover:text-primary-500 transition-colors duration-300"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-neutral-700 hover:bg-primary-50 hover:text-primary-500 transition-colors duration-300"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-neutral-700 focus:outline-none">
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={dropdownVariants}
          className="md:hidden bg-white shadow-lg py-4 px-4 absolute top-16 left-0 w-full"
        >
          <div className="flex flex-col gap-4">
            <Link
              to="/listings"
              onClick={toggleMobileMenu}
              className="text-neutral-700 hover:text-primary-500 transition-colors duration-300 font-medium"
            >
              Listings
            </Link>
            {role === "owner" && (
              <Link
                to="/owner-dashboard"
                onClick={toggleMobileMenu}
                className="text-neutral-700 hover:text-primary-500 transition-colors duration-300 font-medium"
              >
                Dashboard
            </Link>
            )}
            {user ? (
              <>
                <span className="text-neutral-700 font-medium">{user.split("@")[0]}</span>
                <button
                  onClick={handleLogout}
                  className="bg-primary-500 text-white px-4 py-2 rounded-full hover:bg-primary-600 transition-all duration-300 font-semibold w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={toggleMobileMenu}
                  className="text-neutral-700 hover:text-primary-500 transition-colors duration-300 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={toggleMobileMenu}
                  className="bg-secondary-500 text-white px-4 py-2 rounded-full hover:bg-secondary-600 transition-all duration-300 font-semibold w-full text-left"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}

export default Navbar;