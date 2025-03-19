// src/features/home/Home.jsx
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchBar from "../../components/SearchBar";
import { FaUserPlus, FaSearch, FaBook, FaHome, FaList, FaTasks } from "react-icons/fa";
import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

function Home() {
  const { role } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 md:py-32"
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Discover Your Perfect Stay
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 opacity-90">
            A seamless platform to find or list PGs, rooms, and hostels with ease.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/listings"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 hover:shadow-lg transition-all duration-300 font-semibold"
            >
              Browse Listings
            </Link>
            {role === "owner" && (
              <Link
                to="/owner-dashboard"
                className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 hover:shadow-lg transition-all duration-300 font-semibold"
              >
                Manage Listings
              </Link>
            )}
          </div>
        </div>
        <div className="absolute inset-0 bg-gray-200 opacity-10 backdrop-blur-sm pointer-events-none"></div>
      </motion.section>

      {/* Search Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="container mx-auto py-16 px-4 -mt-10"
      >
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center mb-6">
            Find Your Ideal Stay
          </h2>
          <SearchBar />
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="bg-gray-100 py-16"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-12">
            Why Stay Finder?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={cardVariants} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHome size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
                For Tenants
              </h3>
              <p className="text-gray-600 text-center">
                Search verified stays, filter by preferences, and book effortlessly.
              </p>
            </motion.div>
            <motion.div variants={cardVariants} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaList size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
                For Owners
              </h3>
              <p className="text-gray-600 text-center">
                List properties, manage bookings, and connect with tenants easily.
              </p>
            </motion.div>
            <motion.div variants={cardVariants} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTasks size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
                Trusted Platform
              </h3>
              <p className="text-gray-600 text-center">
                Join a community built on reliability and satisfaction.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-12">
            How It Works
          </h2>
          <div className="mb-16">
            <h3 className="text-xl md:text-2xl font-semibold text-blue-600 text-center mb-8">
              For Tenants
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div variants={cardVariants} className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUserPlus size={24} />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 text-center mb-2">1. Sign Up</h4>
                <p className="text-gray-600 text-center">Create your tenant account.</p>
              </motion.div>
              <motion.div variants={cardVariants} className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSearch size={24} />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 text-center mb-2">2. Search</h4>
                <p className="text-gray-600 text-center">Find stays that match your needs.</p>
              </motion.div>
              <motion.div variants={cardVariants} className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBook size={24} />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 text-center mb-2">3. Book</h4>
                <p className="text-gray-600 text-center">Reserve your stay securely.</p>
              </motion.div>
            </div>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-green-600 text-center mb-8">
              For Owners
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div variants={cardVariants} className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUserPlus size={24} />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 text-center mb-2">1. Sign Up</h4>
                <p className="text-gray-600 text-center">Join as a property owner.</p>
              </motion.div>
              <motion.div variants={cardVariants} className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaList size={24} />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 text-center mb-2">2. List</h4>
                <p className="text-gray-600 text-center">Add your property details.</p>
              </motion.div>
              <motion.div variants={cardVariants} className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTasks size={24} />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 text-center mb-2">3. Manage</h4>
                <p className="text-gray-600 text-center">Oversee bookings and tenants.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="py-16 bg-gray-100"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={cardVariants} className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-gray-600 italic mb-4">
                "Found a perfect hostel near my college in no time!"
              </p>
              <p className="text-gray-800 font-semibold">– Priya, Tenant</p>
            </motion.div>
            <motion.div variants={cardVariants} className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-gray-600 italic mb-4">
                "Listing my rooms was easy, and I got tenants quickly."
              </p>
              <p className="text-gray-800 font-semibold">– Rajesh, Owner</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Call-to-Action Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 text-center"
      >
        <h3 className="text-2xl md:text-3xl font-semibold mb-6">
          Ready to Get Started?
        </h3>
        <Link
          to={role === "owner" ? "/owner-dashboard" : "/listings"}
          className="bg-white text-blue-600 px-8 py-4 rounded-lg shadow-md hover:bg-gray-100 hover:shadow-lg transition-all duration-300 font-semibold text-lg"
        >
          {role === "owner" ? "Manage Listings" : "Browse Now"}
        </Link>
      </motion.section>
      {/* No Footer here; handled by AppWrapper */}
    </div>
  );
}

export default Home;