import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

// Redux Store Setup
const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, role: null, users: [] },
  reducers: {
    signup: (state, action) => {
      state.users.push(action.payload);
    },
    login: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
    },
  },
});

const listingsSlice = createSlice({
  name: "listings",
  initialState: { listings: [] },
  reducers: {
    addListing: (state, action) => {
      state.listings.push(action.payload);
    },
  },
});

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    listings: listingsSlice.reducer,
  },
});

const { signup, login, logout } = authSlice.actions;
const { addListing } = listingsSlice.actions;

// Navbar Component
function Navbar() {
  const { user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const userInitial = user ? user[0].toUpperCase() : "";

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md fixed w-full top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <span className="mr-2">Stay Finder</span>
          {user && (
            <span className="bg-white text-blue-600 w-8 h-8 flex items-center justify-center rounded-full">
              {userInitial}
            </span>
          )}
        </Link>
        <div className="space-x-4 flex items-center">
          <Link to="/" className="hover:text-gray-200">Home</Link>
          <Link to="/listings" className="hover:text-gray-200">Listings</Link>
          {role === "owner" && (
            <Link to="/owner-dashboard" className="hover:text-gray-200">Dashboard</Link>
          )}
          <button
            onClick={() => dispatch(logout())}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

// Signup Component
function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const { users, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

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
    dispatch(signup({ email, password, role }));
    dispatch(login({ user: email, role }));
    navigate("/");
  };

  const handleGoogleSignup = () => {
    const googleEmail = `googleuser${Date.now()}@example.com`;
    const googleRole = role;
    if (users.some((u) => u.email === googleEmail)) {
      setError("Google account already registered.");
      return;
    }
    dispatch(signup({ email: googleEmail, password: "google-auth", role: googleRole }));
    dispatch(login({ user: googleEmail, role: googleRole }));
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Welcome to Stay Finder</h2>
        <p className="text-center text-gray-600 mb-6">Sign up to find or list stays</p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">User (Tenant)</option>
              <option value="owner">Owner</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mb-4"
          >
            Sign Up
          </button>
        </form>
        <button
          onClick={handleGoogleSignup}
          className="w-full bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300 flex items-center justify-center"
        >
          <span className="mr-2">G</span> Sign Up with Google
        </button>
        <p className="text-center text-gray-600 mt-4">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

// Login Component
function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { users, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    const foundUser = users.find((u) => u.email === email && u.password === password);
    if (!foundUser) {
      setError("Invalid email or password.");
      return;
    }
    dispatch(login({ user: email, role: foundUser.role }));
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login to Stay Finder</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

// SearchBar Component
function SearchBar() {
  const [location, setLocation] = useState("");
  const [rent, setRent] = useState("");
  const [facility, setFacility] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/listings?location=${location}&rent=${rent}&facility=${facility}&type=${type}`);
  };

  return (
    <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Location (e.g., Mumbai)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Max Rent (e.g., 8000)"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={facility}
          onChange={(e) => setFacility(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Facility</option>
          <option value="WiFi">WiFi</option>
          <option value="Food">Food</option>
          <option value="AC">AC</option>
          <option value="Parking">Parking</option>
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Type</option>
          <option value="PG">PG</option>
          <option value="Room">Room</option>
          <option value="Hostel">Hostel</option>
        </select>
      </div>
      <button
        type="submit"
        className="mt-4 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Search Now
      </button>
    </form>
  );
}

// ListingCard Component
function ListingCard({ listing }) {
  const [showBooking, setShowBooking] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showContact, setShowContact] = useState(false);

  const handleBook = () => {
    alert(`Booking initiated for ${listing.type}: ${listing.title} with Razorpay!`);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % listing.photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + listing.photos.length) % listing.photos.length);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="relative">
        <img
          src={listing.photos[currentPhotoIndex] || "https://via.placeholder.com/300x200"}
          alt={`${listing.title} - Photo ${currentPhotoIndex + 1}`}
          className="w-full h-40 object-cover rounded-t-lg"
        />
        {listing.photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-1 rounded-full hover:bg-gray-600"
            >
              &lt;
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-1 rounded-full hover:bg-gray-600"
            >
              &gt;
            </button>
          </>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{listing.title}</h3>
        <p className="text-gray-600">Type: {listing.type}</p>
        <p className="text-gray-600">Rent: ₹{listing.rent}</p>
        <p className="text-gray-600">Location: {listing.location}</p>
        <p className="text-gray-600">Facilities: {listing.facilities.join(", ")}</p>
        <p className="text-gray-600">Available: {listing.available ? "Yes" : "No"}</p>
        <p className="text-gray-600">Rating: {listing.rating || "N/A"}</p>
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => setShowBooking(!showBooking)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showBooking ? "Cancel" : "Book Now"}
          </button>
          {showBooking && (
            <button
              onClick={handleBook}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Confirm Booking
            </button>
          )}
          <button
            onClick={() => setShowContact(!showContact)}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            {showContact ? "Hide Contact" : "Contact Owner"}
          </button>
        </div>
        {showContact && (
          <p className="mt-2 text-gray-800 font-semibold">
            Contact: {listing.contact || "Not provided"}
          </p>
        )}
      </div>
    </div>
  );
}

// Home Component
function Home() {
  const { role } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="bg-blue-600 text-white py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Find Your Perfect Stay with Ease
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6">
          Discover comfortable PGs, rooms, or hostels, or list your property effortlessly with Stay Finder – your one-stop solution for tenants and owners.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/listings"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200"
          >
            Browse Listings
          </Link>
          {role === "owner" && (
            <Link
              to="/owner-dashboard"
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600"
            >
              Manage Listings
            </Link>
          )}
        </div>
      </div>
      <div className="container mx-auto py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Search for Your Ideal Stay
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Find PGs, rooms, or hostels that match your preferences in seconds.
        </p>
        <SearchBar />
      </div>
      <div className="bg-white py-12">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Why Choose Stay Finder?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <span className="text-4xl text-blue-600 mb-4">🏠</span>
              <h3 className="text-xl font-semibold mb-2">For Tenants</h3>
              <p className="text-gray-600">
                Search verified PGs, rooms, and hostels, filter by location and budget, and book securely online.
              </p>
            </div>
            <div className="text-center p-6">
              <span className="text-4xl text-blue-600 mb-4">🔑</span>
              <h3 className="text-xl font-semibold mb-2">For Owners</h3>
              <p className="text-gray-600">
                List your PGs, rooms, or hostels, manage tenants, and track revenue with ease.
              </p>
            </div>
            <div className="text-center p-6">
              <span className="text-4xl text-blue-600 mb-4">✅</span>
              <h3 className="text-xl font-semibold mb-2">Trusted Platform</h3>
              <p className="text-gray-600">
                Join a growing community of satisfied tenants and owners.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 italic mb-4">
              "Found a perfect hostel near my college in no time!"
            </p>
            <p className="font-semibold">– Priya, Tenant</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 italic mb-4">
              "Listing my rooms was easy, and I got tenants quickly."
            </p>
            <p className="font-semibold">– Rajesh, Owner</p>
          </div>
        </div>
      </div>
      <div className="bg-blue-600 text-white py-8 text-center">
        <h3 className="text-xl md:text-2xl font-semibold mb-4">
          Ready to Find or List Your Stay?
        </h3>
        <Link
          to={role === "owner" ? "/owner-dashboard" : "/listings"}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200"
        >
          {role === "owner" ? "Manage Listings" : "Browse Now"}
        </Link>
      </div>
    </div>
  );
}

// Listings Component
function Listings() {
  const listings = useSelector((state) => state.listings.listings); // Get from Redux
  const [filteredListings, setFilteredListings] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filtered = listings.filter((listing) => {
      const locationParam = params.get("location");
      const rentParam = params.get("rent");
      const facilityParam = params.get("facility");
      const typeParam = params.get("type");
      return (
        (!locationParam || listing.location.toLowerCase().includes(locationParam.toLowerCase())) &&
        (!rentParam || listing.rent <= parseInt(rentParam)) &&
        (!facilityParam || listing.facilities.includes(facilityParam)) &&
        (!typeParam || listing.type === typeParam)
      );
    });
    setFilteredListings(filtered);
  }, [location.search, listings]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 pt-20">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Available Listings</h2>
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No listings found.</p>
        )}
      </div>
    </div>
  );
}

// OwnerDashboard Component
function OwnerDashboard() {
  const { role } = useSelector((state) => state.auth);
  const listings = useSelector((state) => state.listings.listings); // Get from Redux
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
    available: true, // Added default availability
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
      rent: parseInt(newListing.rent), // Convert rent to number
      rating: null, // Default rating
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

// AppWrapper Component
function AppWrapper() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      {user ? (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/owner-dashboard" element={<OwnerDashboard />} />
            <Route path="*" element={<Home />} />
          </Routes>
          <footer className="bg-gray-800 text-white p-4 text-center">
            <p>© 2025 Stay Finder. All rights reserved.</p>
          </footer>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Signup />} />
        </Routes>
      )}
    </Router>
  );
}

// Main App Component
function App() {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
}

export default App;