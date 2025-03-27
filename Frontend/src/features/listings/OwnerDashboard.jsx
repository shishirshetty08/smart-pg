// src/features/listings/OwnerDashboard.jsx
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaBed, FaHouseUser } from "react-icons/fa";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

function OwnerDashboard() {
  const { user, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || role !== "owner") {
      navigate("/login");
    }
  }, [user, role, navigate]);

  const listingTypes = [
    { name: "Flatmate", icon: FaUsers, path: "/owner-dashboard/flatmate" },
    { name: "Roommate", icon: FaUsers, path: "/owner-dashboard/roommate" },
    { name: "Room", icon: FaBed, path: "/owner-dashboard/room" },
    { name: "Entire House", icon: FaHouseUser, path: "/owner-dashboard/entire-house" },
    { name: "PG", icon: FaBed, path: "/owner-dashboard/pg" },
    { name: "Co-Living", icon: FaUsers, path: "/owner-dashboard/coliving" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-8 pt-24 font-['Inter']">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 text-center mb-12">
          Add a New Listing
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {listingTypes.map((type) => (
            <motion.div
              key={type.name}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-xl shadow-lg cursor-pointer flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl"
              onClick={() => navigate(type.path)}
            >
              <type.icon className="text-primary-500 mb-4" size={40} />
              <h3 className="text-xl font-semibold text-neutral-900">{type.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;