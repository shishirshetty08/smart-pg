// src/features/listings/Listings.jsx
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ListingCard from "../../components/ListingCard";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function Listings() {
  const listings = useSelector((state) => state.listings.listings); // Fix: Access nested listings
  const [filteredListings, setFilteredListings] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const locationParam = params.get("location")?.toLowerCase() || "";
    const rentParam = params.get("rent") ? parseInt(params.get("rent")) : null;
    const facilityParam = params.get("facility") || "";
    const typeParam = params.get("type") || "";

    const filtered = listings.filter((listing) => {
      // Handle both location formats: string (initial data) or city/locality (form data)
      const listingLocation = listing.location
        ? listing.location.toLowerCase()
        : `${listing.city}, ${listing.locality}`.toLowerCase();
      // Handle both facilities (initial) and amenities (form)
      const facilities = listing.facilities || listing.amenities || [];

      return (
        (!locationParam || listingLocation.includes(locationParam)) &&
        (!rentParam || listing.rent <= rentParam) &&
        (!facilityParam || facilities.includes(facilityParam)) &&
        (!typeParam || listing.type.toLowerCase() === typeParam.toLowerCase())
      );
    });
    setFilteredListings(filtered);
    console.log("Filtered listings:", filtered); // Debug log
  }, [location.search, listings]);

  const getTypeTitle = () => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type");
    if (!type) return "All Listings";
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() + " Listings";
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8 pt-24 font-['Inter']">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            {getTypeTitle()}
          </h2>
          <p className="text-neutral-700 text-lg max-w-2xl mx-auto">
            Browse our latest {getTypeTitle().toLowerCase()} tailored to your preferences.
          </p>
        </motion.div>

        {filteredListings.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredListings.map((listing) => (
              <motion.div key={listing._id} variants={itemVariants}>
                <ListingCard listing={listing} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-neutral-600 text-lg bg-neutral-100 p-6 rounded-lg shadow-md"
          >
            No listings found for this category. Try adjusting your search or browse all listings.
          </motion.p>
        )}
      </div>
    </div>
  );
}

export default Listings;