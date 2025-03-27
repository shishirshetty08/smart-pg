import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ListingCard from "../../components/ListingCard";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Ensure this is imported here or in main.jsx
import { FaMapMarkerAlt, FaRupeeSign, FaUsers, FaHome, FaCalendarAlt, FaTimes, FaPhone, FaEnvelope, FaUser } from "react-icons/fa"; // Added FaUser

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const detailVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

function Listings() {
  const listings = useSelector((state) => state.listings.listings);
  const [filteredListings, setFilteredListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const locationParam = params.get("location")?.toLowerCase() || "";
    const rentParam = params.get("rent") ? parseInt(params.get("rent")) : null;
    const facilityParam = params.get("facility") || "";
    const typeParam = params.get("type") || "";

    const filtered = listings.filter((listing) => {
      const listingLocation = listing.location
        ? listing.location.toLowerCase()
        : `${listing.city}, ${listing.locality}`.toLowerCase();
      const facilities = listing.facilities || listing.amenities || [];

      return (
        (!locationParam || listingLocation.includes(locationParam)) &&
        (!rentParam || listing.rent <= rentParam) &&
        (!facilityParam || facilities.includes(facilityParam)) &&
        (!typeParam || listing.type.toLowerCase() === typeParam.toLowerCase())
      );
    });
    setFilteredListings(filtered);
    console.log("Filtered listings:", filtered);
  }, [location.search, listings]);

  const getTypeTitle = () => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type");
    if (!type) return "All Listings";
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() + " Listings";
  };

  const handleCardClick = (listing) => {
    console.log("Selected listing:", listing); // Debug log
    setSelectedListing(listing);
  };

  const handleClose = () => {
    setSelectedListing(null);
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
                <ListingCard listing={listing} onClick={() => handleCardClick(listing)} />
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

        {selectedListing && (
          <motion.div
            variants={detailVariants}
            initial="hidden"
            animate="visible"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleClose}
          >
            <div
              className="bg-white p-8 rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">{selectedListing.title}</h2>
                <button
                  onClick={handleClose}
                  className="text-neutral-600 hover:text-neutral-900 transition-colors duration-300"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {selectedListing.images && selectedListing.images.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedListing.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Image ${idx}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}

                <p className="text-neutral-700 flex items-center gap-1">
                  <FaMapMarkerAlt className="text-primary-500" /> Location: {selectedListing.location}
                </p>
                <p className="text-neutral-700 flex items-center gap-1">
                  <FaRupeeSign className="text-primary-500" /> Rent: ₹{selectedListing.rent}/month
                </p>
                <p className="text-neutral-700 capitalize">Type: {selectedListing.type}</p>

                {selectedListing.description && (
                  <p className="text-neutral-700">Description: {selectedListing.description}</p>
                )}

                {selectedListing.type === "flatmate" && (
                  <>
                    <p className="text-neutral-700 flex items-center gap-1">
                      <FaUsers className="text-primary-500" /> Number of Flatmates: {selectedListing.numFlatmates}
                    </p>
                    <p className="text-neutral-700">Gender Preference: {selectedListing.gender}</p>
                    <p className="text-neutral-700">House Model: {selectedListing.houseModel}</p>
                    <p className="text-neutral-700">House Type: {selectedListing.houseType}</p>
                    <p className="text-neutral-700 flex items-center gap-1">
                      <FaRupeeSign className="text-primary-500" /> Deposit: ₹{selectedListing.deposit}
                    </p>
                    <p className="text-neutral-700 flex items-center gap-1">
                      <FaRupeeSign className="text-primary-500" /> Maintenance: ₹{selectedListing.maintenance}/month
                    </p>
                    <p className="text-neutral-700">Negotiable: {selectedListing.negotiable ? "Yes" : "No"}</p>
                    <p className="text-neutral-700">Furnishing Type: {selectedListing.furnishingType}</p>
                  </>
                )}

                {(selectedListing.facilities || selectedListing.amenities) && (
                  <p className="text-neutral-700">
                    Amenities: {(selectedListing.facilities || selectedListing.amenities).join(", ")}
                  </p>
                )}

                {selectedListing.availableFrom && (
                  <p className="text-neutral-700 flex items-center gap-1">
                    <FaCalendarAlt className="text-primary-500" /> Available From: {new Date(selectedListing.availableFrom).toLocaleDateString()}
                  </p>
                )}

                {selectedListing.ownerContact && (
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">Owner Contact</h3>
                    <p className="text-neutral-700 flex items-center gap-1">
                      <FaUser className="text-primary-500" /> Name: {selectedListing.ownerContact.name}
                    </p>
                    <p className="text-neutral-700 flex items-center gap-1">
                      <FaPhone className="text-primary-500" /> Phone: {selectedListing.ownerContact.phone}
                    </p>
                    <p className="text-neutral-700 flex items-center gap-1">
                      <FaEnvelope className="text-primary-500" /> Email: {selectedListing.ownerContact.email}
                    </p>
                  </div>
                )}

                {selectedListing.location && typeof selectedListing.location !== "string" && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">Location on Map</h3>
                    <div className="w-full h-64 rounded-lg overflow-hidden border border-neutral-200">
                      <MapContainer
                        center={[selectedListing.location.lat, selectedListing.location.lng]}
                        zoom={13}
                        style={{ height: "100%", width: "100%" }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[selectedListing.location.lat, selectedListing.location.lng]} />
                      </MapContainer>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Listings;