import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchListings, updateListing, deleteListing } from "../../store";
import { FaUsers, FaBed, FaHouseUser, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

// Animations for smooth UI transitions
const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const listingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function OwnerDashboard() {
  const { user, role } = useSelector((state) => state.auth);
  const listings = useSelector((state) => state.listings.listings);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [error, setError] = useState("");

  // Fetch listings on component mount
  useEffect(() => {
    if (!user || role !== "owner") {
      navigate("/login");
      return;
    }
    const loadListings = async () => {
      try {
        await dispatch(fetchListings());
        setError("");
      } catch (err) {
        setError("Failed to load listings: " + (err.message || "Unknown error"));
      }
    };
    loadListings();
  }, [user, role, navigate, dispatch]);

  const listingTypes = [
    { name: "Flatmate", icon: FaUsers, path: "/owner-dashboard/flatmate" },
    { name: "Roommate", icon: FaUsers, path: "/owner-dashboard/roommate" },
    { name: "Room", icon: FaBed, path: "/owner-dashboard/room" },
    { name: "Entire House", icon: FaHouseUser, path: "/owner-dashboard/entire-house" },
    { name: "PG", icon: FaBed, path: "/owner-dashboard/pg" },
    { name: "Co-Living", icon: FaUsers, path: "/owner-dashboard/coliving" },
  ];

  const getLocationDisplay = (listing) => {
    if (listing.locationString) return listing.locationString;
    if (typeof listing.location === "string") return listing.location;
    if (listing.location?.lat && listing.location?.lng) {
      return `Lat: ${listing.location.lat.toFixed(4)}, Lng: ${listing.location.lng.toFixed(4)}`;
    }
    return "Not specified";
  };

  const handleEdit = (listing) => {
    setEditingId(listing._id);
    setEditedData({ ...listing });
  };

  const handleSave = async () => {
    try {
      await dispatch(updateListing({ id: editingId, updatedListing: editedData }));
      setEditingId(null);
      setEditedData({});
      setError("");
    } catch (err) {
      setError("Failed to update listing: " + (err.message || "Unknown error"));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await dispatch(deleteListing(id));
        setError("");
      } catch (err) {
        setError("Failed to delete listing: " + (err.message || "Unknown error"));
      }
    }
  };

  const handleChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

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
              className="bg-white p-6 rounded-xl shadow-lg cursor-pointer flex flex-col items-center justify-center hover:shadow-xl"
              onClick={() => navigate(type.path)}
            >
              <type.icon className="text-primary-500 mb-4" size={40} />
              <h3 className="text-xl font-semibold">{type.name}</h3>
            </motion.div>
          ))}
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 text-center mt-16 mb-12">
          My Listings
        </h2>
        {error && <p className="text-red-500 bg-red-50 p-3 rounded mb-4 text-center">{error}</p>}

        {listings.length === 0 ? (
          <p className="text-neutral-600 text-center">You have no listings yet.</p>
        ) : (
          <div className="space-y-6">
            {listings.map((listing) => (
              <motion.div
                key={listing._id}
                variants={listingVariants}
                initial="hidden"
                animate="visible"
                className="bg-white p-6 rounded-xl shadow-lg border border-neutral-200"
              >
                {editingId === listing._id ? (
                  <div className="space-y-4">
                    <input type="text" value={editedData.title || ""} onChange={(e) => handleChange("title", e.target.value)} className="input-field" placeholder="Title" />
                    <input type="text" value={editedData.locationString || ""} onChange={(e) => handleChange("locationString", e.target.value)} className="input-field" placeholder="Location" />
                    <input type="number" value={editedData.rent || ""} onChange={(e) => handleChange("rent", e.target.value)} className="input-field" placeholder="Rent" />
                    <textarea value={editedData.description || ""} onChange={(e) => handleChange("description", e.target.value)} className="input-field" placeholder="Description" rows="3" />
                    <div className="flex justify-end gap-2">
                      <button onClick={handleSave} className="btn-save"><FaSave /> Save</button>
                      <button onClick={() => setEditingId(null)} className="btn-cancel"><FaTimes /> Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold">{listing.title}</h3>
                    <p>Location: {getLocationDisplay(listing)}</p>
                    <p>Rent: ₹{listing.rent}/month</p>
                    <p>Type: {listing.type}</p>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {listing.images?.map((img, idx) => (
                        <img key={idx} src={`http://localhost:5000${img}`} alt="Listing" className="h-24 w-full object-cover rounded-md" />
                      ))}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button onClick={() => handleEdit(listing)} className="btn-edit"><FaEdit /> Edit</button>
                      <button onClick={() => handleDelete(listing._id)} className="btn-delete"><FaTrash /> Delete</button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OwnerDashboard;
