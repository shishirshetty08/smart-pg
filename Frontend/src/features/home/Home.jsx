// src/features/home/Home.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup, login } from "../../store";
import { FaHome, FaList, FaTasks, FaTimes, FaSearch, FaUser, FaBuilding } from "react-icons/fa";
import { motion } from "framer-motion";
import SearchBar from "../../components/SearchBar";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function Home() {
  const { role, user, users } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupRole, setSignupRole] = useState("user");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("users"); // Toggle state for Users/Owners

  const handleBrowseListings = () => {
    if (!user) setIsAuthModalOpen(true);
    else navigate("/listings");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const foundUser = users.find((u) => u.email === email && u.password === password);
    if (!foundUser) {
      setError("Invalid email or password.");
      return;
    }
    dispatch(login({ user: email, role: foundUser.role }));
    setIsAuthModalOpen(false);
    navigate("/listings");
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("All fields are required.");
      return;
    }
    if (users.some((u) => u.email === email)) {
      setError("Email already registered.");
      return;
    }
    dispatch(signup({ email, password, role: signupRole }));
    dispatch(login({ user: email, role: signupRole }));
    setIsAuthModalOpen(false);
    navigate("/listings");
  };

  const handleGoogleSignup = () => {
    const googleEmail = `googleuser${Date.now()}@example.com`;
    const googleRole = signupRole;
    if (users.some((u) => u.email === googleEmail)) {
      setError("Google account already registered.");
      return;
    }
    dispatch(signup({ email: googleEmail, password: "google-auth", role: googleRole }));
    dispatch(login({ user: googleEmail, role: googleRole }));
    setIsAuthModalOpen(false);
    navigate("/listings");
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-['Inter']">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="relative bg-gradient-to-br from-primary-500 to-secondary-600 text-white py-24 md:py-32"
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Find Your Perfect Stay
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 opacity-90">
            Discover PGs, rooms, and hostels with ease and comfort.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={handleBrowseListings}
              className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Browse Listings
            </button>
            {role === "owner" && (
              <Link
                to="/owner-dashboard"
                className="bg-secondary-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-secondary-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                Manage Listings
              </Link>
            )}
          </div>
          <SearchBar />
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="py-16 bg-neutral-100"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 text-center mb-12">
            How It Works
          </h2>

          {/* Toggle Buttons */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 ${
                activeTab === "users"
                  ? "bg-primary-500 text-white shadow-lg"
                  : "bg-white text-neutral-700 border border-neutral-200 hover:bg-primary-50"
              }`}
            >
              For Users
            </button>
            <button
              onClick={() => setActiveTab("owners")}
              className={`px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 ${
                activeTab === "owners"
                  ? "bg-primary-500 text-white shadow-lg"
                  : "bg-white text-neutral-700 border border-neutral-200 hover:bg-primary-50"
              }`}
            >
              For Owners
            </button>
          </div>

          {/* Content */}
          <motion.div
            key={activeTab} // Key ensures animation triggers on tab change
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {activeTab === "users" ? (
              <>
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="w-14 h-14 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaSearch size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 text-center mb-2">
                    Search Listings
                  </h3>
                  <p className="text-neutral-700 text-center">
                    Use our powerful search tools to find PGs, rooms, or hostels in your desired location.
                  </p>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="w-14 h-14 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaHome size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 text-center mb-2">
                    Choose Your Stay
                  </h3>
                  <p className="text-neutral-700 text-center">
                    Filter by rent, facilities, and type to select the perfect stay that fits your needs.
                  </p>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="w-14 h-14 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUser size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 text-center mb-2">
                    Book Easily
                  </h3>
                  <p className="text-neutral-700 text-center">
                    Sign up or log in to connect with owners and secure your stay hassle-free.
                  </p>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="w-14 h-14 bg-secondary-50 text-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaBuilding size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 text-center mb-2">
                    List Your Property
                  </h3>
                  <p className="text-neutral-700 text-center">
                    Sign up as an owner and add your PG, room, or hostel to our platform.
                  </p>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="w-14 h-14 bg-secondary-50 text-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaList size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 text-center mb-2">
                    Manage Listings
                  </h3>
                  <p className="text-neutral-700 text-center">
                    Update availability, pricing, and details from your owner dashboard.
                  </p>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="w-14 h-14 bg-secondary-50 text-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaTasks size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 text-center mb-2">
                    Connect with Tenants
                  </h3>
                  <p className="text-neutral-700 text-center">
                    Receive inquiries and bookings from verified users seamlessly.
                  </p>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md relative"
          >
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-700 hover:text-neutral-900"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 text-center">
              {isLogin ? "Login" : "Sign Up"}
            </h2>
            {error && (
              <p className="text-red-500 bg-red-50 p-2 rounded mb-4 text-center">
                {error}
              </p>
            )}
            <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-6">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50"
                required
              />
              {!isLogin && (
                <select
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value)}
                  className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50"
                >
                  <option value="user">User (Tenant)</option>
                  <option value="owner">Owner</option>
                </select>
              )}
              <button
                type="submit"
                className="w-full bg-primary-500 text-white p-3 rounded-lg hover:bg-primary-600 transition-all duration-300 font-semibold transform hover:-translate-y-1 shadow-md"
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>
            {!isLogin && (
              <button
                onClick={handleGoogleSignup}
                className="w-full mt-4 bg-white text-neutral-900 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-all duration-300 flex items-center justify-center shadow-md transform hover:-translate-y-1"
              >
                <span className="mr-2 text-red-500 font-bold">G</span> Sign Up with Google
              </button>
            )}
            <p className="text-center text-neutral-700 mt-4">
              {isLogin ? "Need an account?" : "Already have an account?"}{" "}
              <Link
                to={isLogin ? "/signup" : "/login"}
                className="text-primary-500 hover:underline font-medium"
                onClick={() => setIsAuthModalOpen(false)}
              >
                {isLogin ? "Sign Up" : "Login"}
              </Link>
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Home;