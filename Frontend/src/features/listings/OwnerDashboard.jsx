import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addListing } from "../../store";

function OwnerDashboard() {
  const { role } = useSelector((state) => state.auth);
  const listings = useSelector((state) => state.listings.listings);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "owner") {
      navigate("/listings");
    }
  }, [role, navigate]);

  const [newListing, setNewListing] = useState({
    title: "",
    type: "PG",
    rent: "",
    location: "",
    facilities: "",
    photos: "",
    contact: "",
    available: true,
  });

  const handleAddListing = (e) => {
    e.preventDefault();
    const photosArray = newListing.photos.split(",").map((url) => url.trim());
    const facilitiesArray = newListing.facilities.split(",").map((f) => f.trim());
    const listing = {
      ...newListing,
      facilities: facilitiesArray,
      photos: photosArray,
      _id: Date.now().toString(),
      rent: parseInt(newListing.rent),
      rating: null,
    };
    dispatch(addListing(listing));
    setNewListing({
      title: "",
      type: "PG",
      rent: "",
      location: "",
      facilities: "",
      photos: "",
      contact: "",
      available: true,
    });
    alert("Listing added!");
  };

  if (role !== "owner") return null;

  return (
    <div className="min-h-screen bg-gray-100 py-8 pt-20">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Owner Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Add New Listing</h3>
            <form onSubmit={handleAddListing}>
              <input
                type="text"
                placeholder="Title (e.g., Cozy Room)"
                value={newListing.title}
                onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newListing.type}
                onChange={(e) => setNewListing({ ...newListing, type: e.target.value })}
                className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PG">PG</option>
                <option value="Room">Room</option>
                <option value="Hostel">Hostel</option>
              </select>
              <input
                type="number"
                placeholder="Rent (e.g., 7000)"
                value={newListing.rent}
                onChange={(e) => setNewListing({ ...newListing, rent: e.target.value })}
                className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Location (e.g., Delhi)"
                value={newListing.location}
                onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Facilities (e.g., WiFi, Food)"
                value={newListing.facilities}
                onChange={(e) => setNewListing({ ...newListing, facilities: e.target.value })}
                className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Photo URLs (comma-separated)"
                value={newListing.photos}
                onChange={(e) => setNewListing({ ...newListing, photos: e.target.value })}
                className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Contact Number (e.g., 9876543210)"
                value={newListing.contact}
                onChange={(e) => setNewListing({ ...newListing, contact: e.target.value })}
                className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              >
                Add Listing
              </button>
            </form>
          </div>
          <div>
            {listings.length > 0 ? (
              listings.map((listing) => (
                <div key={listing._id} className="bg-white p-6 rounded-lg shadow-lg mb-4">
                  <h3 className="text-xl font-semibold">{listing.title}</h3>
                  <p className="text-gray-600">Type: {listing.type}</p>
                  <p className="text-gray-600">Rent: ₹{listing.rent}</p>
                  <p className="text-gray-600">Location: {listing.location}</p>
                  <p className="text-gray-600">Contact: {listing.contact}</p>
                  <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Chat with Tenants
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No listings added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;