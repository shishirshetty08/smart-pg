import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ListingCard from "../../components/ListingCard";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { 
  FaMapMarkerAlt, FaRupeeSign, FaUsers, FaHome, FaCalendarAlt, 
  FaTimes, FaPhone, FaEnvelope, FaUser, FaBed, FaBath, FaRulerCombined 
} from "react-icons/fa";

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png'
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.1,
      when: "beforeChildren"
    } 
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      type: "spring",
      damping: 25,
      stiffness: 300
    } 
  },
  exit: { opacity: 0, scale: 0.95 }
};

function Listings() {
  const listings = useSelector((state) => state.listings.listings);
  const [filteredListings, setFilteredListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams(location.search);
    const locationParam = params.get("location")?.toLowerCase() || "";
    const rentParam = params.get("rent") ? parseInt(params.get("rent")) : null;
    const facilityParam = params.get("facility") || "";
    const typeParam = params.get("type") || "";

    const filtered = listings.filter((listing) => {
      const listingLocation = listing.locationString
        ? listing.locationString.toLowerCase()
        : listing.location && typeof listing.location === "string"
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
    setIsLoading(false);
  }, [location.search, listings]);

  useEffect(() => {
    if (selectedListing) {
      const images = selectedListing.images?.length > 0
        ? selectedListing.images.map(img => img.startsWith('http') ? img : `http://localhost:5000${img}`)
        : selectedListing.image
        ? [selectedListing.image.startsWith('http') ? selectedListing.image : `http://localhost:5000${selectedListing.image}`]
        : [];
      setMainImage(images[0] || "https://via.placeholder.com/800x500?text=No+Image+Available");
      setActiveImageIndex(0);
    }
  }, [selectedListing]);

  const handleThumbnailClick = (image, index) => {
    setMainImage(image.startsWith('http') ? image : `http://localhost:5000${image}`);
    setActiveImageIndex(index);
  };

  const getTypeTitle = () => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type");
    return type ? `${type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()} Listings` : "All Listings";
  };

  const handleCardClick = (listing) => {
    setSelectedListing(listing);
    document.body.style.overflow = 'hidden';
  };

  const handleClose = () => {
    setSelectedListing(null);
    setMainImage(null);
    document.body.style.overflow = 'auto';
  };

  const getLocationDisplay = (listing) => {
    if (listing.locationString) return listing.locationString;
    if (typeof listing.location === "string") return listing.location;
    if (listing.location?.lat && listing.location?.lng) {
      return `Lat: ${listing.location.lat.toFixed(4)}, Lng: ${listing.location.lng.toFixed(4)}`;
    }
    return `${listing.city || ''}${listing.city && listing.locality ? ', ' : ''}${listing.locality || 'Not specified'}`;
  };

  const getMapLocation = (listing) => {
    return listing.location?.lat && listing.location?.lng
      ? [listing.location.lat, listing.location.lng]
      : listing.mapLocation?.lat && listing.mapLocation?.lng
      ? [listing.mapLocation.lat, listing.mapLocation.lng]
      : null;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 font-['Inter']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            {getTypeTitle()}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our premium selection of {getTypeTitle().toLowerCase()} tailored to your needs
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading listings...</p>
          </div>
        ) : filteredListings.length > 0 ? (
          /* Listings Grid */
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredListings.map((listing) => (
              <motion.div 
                key={listing._id} 
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <ListingCard 
                  listing={listing} 
                  onClick={() => handleCardClick(listing)} 
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* No Listings Found */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm p-8 text-center max-w-2xl mx-auto border border-gray-100"
          >
            <div className="mb-4">
              <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Listings Available</h3>
            <p className="text-gray-600 mb-6">
              {listings.length === 0 
                ? "No properties have been loaded yet. Please wait or refresh the page."
                : "No listings match your current filters. Try adjusting your search criteria."}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
            >
              Refresh Page
            </button>
          </motion.div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {selectedListing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50 p-4 md:p-6 backdrop-blur-sm"
              onClick={handleClose}
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="sticky top-0 bg-white z-10 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{selectedListing.title}</h2>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <div className="p-6 space-y-8">
                  {/* Image Gallery */}
                  <div className="space-y-4">
                    <div className="relative bg-gray-100 rounded-xl overflow-hidden">
                      <motion.img
                        key={mainImage}
                        src={mainImage}
                        alt={selectedListing.title}
                        className="w-full h-[32rem] object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        onError={(e) => e.target.src = "https://via.placeholder.com/800x500?text=Image+Not+Available"}
                      />
                    </div>
                    {(selectedListing.images?.length > 0 || selectedListing.image) && (
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {(selectedListing.images || [selectedListing.image]).map((img, idx) => (
                          img && (
                            <motion.div
                              key={idx}
                              className={`flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden border-2 cursor-pointer ${
                                activeImageIndex === idx ? "border-indigo-500" : "border-gray-200"
                              }`}
                              onClick={() => handleThumbnailClick(img, idx)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <img
                                src={img.startsWith('http') ? img : `http://localhost:5000${img}`}
                                alt={`Thumbnail ${idx}`}
                                className="w-full h-full object-cover"
                              />
                            </motion.div>
                          )
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Main Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                      {/* Property Details */}
                      <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Overview</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {[
                            { icon: FaRupeeSign, label: "Rent", value: formatCurrency(selectedListing.rent) + "/month" },
                            { icon: FaHome, label: "Type", value: selectedListing.type, capitalize: true },
                            ...(selectedListing.bedrooms ? [{ icon: FaBed, label: "Bedrooms", value: selectedListing.bedrooms }] : []),
                            ...(selectedListing.bathrooms ? [{ icon: FaBath, label: "Bathrooms", value: selectedListing.bathrooms }] : []),
                            ...(selectedListing.area ? [{ icon: FaRulerCombined, label: "Area", value: `${selectedListing.area} sq.ft` }] : []),
                            ...(selectedListing.availableFrom ? [{ icon: FaCalendarAlt, label: "Available", value: new Date(selectedListing.availableFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }] : []),
                          ].map((item, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <item.icon className="text-indigo-500" />
                                <span className="text-sm">{item.label}</span>
                              </div>
                              <p className={`text-lg font-medium text-gray-900 ${item.capitalize ? 'capitalize' : ''}`}>
                                {item.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Description */}
                      {selectedListing.description && (
                        <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                          <p className="text-gray-600 leading-relaxed">{selectedListing.description}</p>
                        </section>
                      )}

                      {/* Amenities */}
                      {(selectedListing.facilities || selectedListing.amenities) && (
                        <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h3>
                          <div className="flex flex-wrap gap-3">
                            {(selectedListing.facilities || selectedListing.amenities).map((item, idx) => (
                              <span 
                                key={idx} 
                                className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </section>
                      )}

                      {/* Flatmate Details */}
                      {selectedListing.type.toLowerCase() === "flatmate" && (
                        <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">Flatmate Details</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {[
                              { icon: FaUsers, label: "Flatmates", value: selectedListing.numFlatmates || 'N/A' },
                              { icon: FaUser, label: "Gender", value: selectedListing.gender || 'Any', capitalize: true },
                              ...(selectedListing.deposit ? [{ icon: FaRupeeSign, label: "Deposit", value: formatCurrency(selectedListing.deposit) }] : []),
                              ...(selectedListing.houseType ? [{ icon: FaHome, label: "House Type", value: selectedListing.houseType, capitalize: true }] : []),
                            ].map((item, idx) => (
                              <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600 mb-1">
                                  <item.icon className="text-indigo-500" />
                                  <span className="text-sm">{item.label}</span>
                                </div>
                                <p className={`text-lg font-medium text-gray-900 ${item.capitalize ? 'capitalize' : ''}`}>
                                  {item.value}
                                </p>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      {/* Location */}
                      <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-indigo-500" /> Location
                        </h3>
                        <p className="text-gray-600 mb-4">{getLocationDisplay(selectedListing)}</p>
                        {getMapLocation(selectedListing) && (
                          <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
                            <MapContainer
                              center={getMapLocation(selectedListing)}
                              zoom={15}
                              style={{ height: "100%", width: "100%" }}
                              scrollWheelZoom={false}
                            >
                              <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                              />
                              <Marker position={getMapLocation(selectedListing)}>
                                <Popup>{selectedListing.title}</Popup>
                              </Marker>
                            </MapContainer>
                          </div>
                        )}
                      </section>

                      {/* Contact */}
                      {selectedListing.ownerContact && (
                        <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                                <FaUser className="text-indigo-600" size={20} />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{selectedListing.ownerContact.name || 'N/A'}</p>
                                <p className="text-sm text-gray-500">Property Owner</p>
                              </div>
                            </div>
                            <div className="space-y-3">
                              {selectedListing.ownerContact.phone && (
                                <a href={`tel:${selectedListing.ownerContact.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
                                  <FaPhone className="text-indigo-500" />
                                  {selectedListing.ownerContact.phone}
                                </a>
                              )}
                              {selectedListing.ownerContact.email && (
                                <a href={`mailto:${selectedListing.ownerContact.email}`} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
                                  <FaEnvelope className="text-indigo-500" />
                                  {selectedListing.ownerContact.email}
                                </a>
                              )}
                            </div>
                            <button className="w-full mt-4 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2">
                              <FaPhone /> Contact Now
                            </button>
                          </div>
                        </section>
                      )}

                      {/* Quick Facts */}
                      <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Facts</h3>
                        <dl className="space-y-3 text-sm">
                          {[
                            { label: "Property ID", value: selectedListing._id?.slice(-8) || 'N/A' },
                            { label: "Posted", value: selectedListing.createdAt ? new Date(selectedListing.createdAt).toLocaleDateString() : 'N/A' },
                            { label: "Furnishing", value: selectedListing.furnishing || 'Not specified', capitalize: true },
                            ...(selectedListing.floor ? [{ label: "Floor", value: selectedListing.floor }] : []),
                          ].map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <dt className="text-gray-600">{item.label}</dt>
                              <dd className={`font-medium text-gray-900 ${item.capitalize ? 'capitalize' : ''}`}>
                                {item.value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </section>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-4">
                  <button 
                    onClick={handleClose}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Close
                  </button>
                  {selectedListing.ownerContact && (
                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2">
                      <FaEnvelope /> Contact Owner
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Listings;