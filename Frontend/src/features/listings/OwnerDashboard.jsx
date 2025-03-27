import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateListing, deleteListing } from "../../store"; // Import new actions
import { FaUsers, FaBed, FaHouseUser, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

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

  const handleEdit = (listing) => {
    setEditingId(listing._id);
    setEditedData({ ...listing });
  };

  const handleSave = () => {
    dispatch(updateListing({ id: editingId, updatedListing: editedData }));
    setEditingId(null);
    setEditedData({});
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      dispatch(deleteListing(id));
    }
  };

  const handleChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8 pt-24 font-['Inter']">
      <div className="container mx-auto px-4">
        {/* Add New Listing Section */}
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

        {/* My Listings Section */}
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 text-center mt-16 mb-12">
          My Listings
        </h2>
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
                    <input
                      type="text"
                      value={editedData.title || ""}
                      onChange={(e) => handleChange("title", e.target.value)}
                      className="w-full p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Title"
                    />
                    <input
                      type="text"
                      value={editedData.location || ""}
                      onChange={(e) => handleChange("location", e.target.value)}
                      className="w-full p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Location"
                    />
                    <input
                      type="number"
                      value={editedData.rent || ""}
                      onChange={(e) => handleChange("rent", e.target.value)}
                      className="w-full p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Rent"
                    />
                    <textarea
                      value={editedData.description || ""}
                      onChange={(e) => handleChange("description", e.target.value)}
                      className="w-full p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Description"
                      rows="3"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleSave}
                        className="bg-green-500 text-white p-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-all duration-300"
                      >
                        <FaSave /> Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-red-500 text-white p-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-all duration-300"
                      >
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900">{listing.title}</h3>
                    <p className="text-neutral-700">Location: {listing.location}</p>
                    <p className="text-neutral-700">Rent: ₹{listing.rent}/month</p>
                    <p className="text-neutral-700">Type: {listing.type}</p>
                    {listing.description && (
                      <p className="text-neutral-700">Description: {listing.description}</p>
                    )}
                    {listing.ownerContact && (
                      <>
                        <p className="text-neutral-700">Owner: {listing.ownerContact.name}</p>
                        <p className="text-neutral-700">Phone: {listing.ownerContact.phone}</p>
                        <p className="text-neutral-700">Email: {listing.ownerContact.email}</p>
                      </>
                    )}
                    {listing.images && listing.images.length > 0 && (
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {listing.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Image ${idx}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => handleEdit(listing)}
                        className="bg-blue-500 text-white p-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-all duration-300"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(listing._id)}
                        className="bg-red-500 text-white p-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-all duration-300"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Back to Home Button */}
        <button
          onClick={() => navigate("/")}
          className="mt-12 bg-primary-500 text-white p-3 rounded-lg w-full max-w-md mx-auto flex justify-center items-center hover:bg-primary-600 transition-all duration-300"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default OwnerDashboard;