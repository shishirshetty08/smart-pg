// pg-finder/src/App.jsx
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
  initialState: { user: null, role: null },
  reducers: {
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

const store = configureStore({ reducer: { auth: authSlice.reducer } });
const { login, logout } = authSlice.actions;

// Navbar Component
function Navbar() {
  const { user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <section id="header">
      <div className="inner">
        <span className="icon solid major fa-home"></span>
        <h1>
          <Link to="/">
            <strong>PG Finder</strong>
          </Link>
        </h1>
        <ul className="actions special">
          <li>
            <Link to="/" className="button">Home</Link>
          </li>
          <li>
            <Link to="/listings" className="button">Listings</Link>
          </li>
          {user && role === "owner" && (
            <li>
              <Link to="/owner-dashboard" className="button">Dashboard</Link>
            </li>
          )}
          {user && role === "admin" && (
            <li>
              <Link to="/admin-dashboard" className="button">Admin</Link>
            </li>
          )}
          {user ? (
            <li>
              <button onClick={() => dispatch(logout())} className="button">
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link to="/login" className="button">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}

// Login Component
function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("tenant");

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({ user: email, role }));
    navigate(role === "owner" ? "/owner-dashboard" : role === "admin" ? "/admin-dashboard" : "/");
  };

  return (
    <section id="one" className="main style1">
      <div className="container">
        <header className="major">
          <h2>Login to PG Finder</h2>
        </header>
        <form onSubmit={handleLogin} className="box">
          <div className="row gtr-uniform gtr-50">
            <div className="col-12">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="col-12">
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="tenant">Tenant</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="col-12">
              <ul className="actions">
                <li><input type="submit" value="Login" className="primary" /></li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

// SearchBar Component
function SearchBar() {
  const [location, setLocation] = useState("");
  const [rent, setRent] = useState("");
  const [facility, setFacility] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/listings?location=${location}&rent=${rent}&facility=${facility}`);
  };

  return (
    <form onSubmit={handleSearch} className="box">
      <div className="row gtr-uniform gtr-50">
        <div className="col-4 col-12-medium">
          <input
            type="text"
            placeholder="Location (e.g., Mumbai)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="col-4 col-12-medium">
          <input
            type="number"
            placeholder="Max Rent (e.g., 8000)"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
          />
        </div>
        <div className="col-4 col-12-medium">
          <select value={facility} onChange={(e) => setFacility(e.target.value)}>
            <option value="">Select Facility</option>
            <option value="WiFi">WiFi</option>
            <option value="Food">Food</option>
            <option value="AC">AC</option>
            <option value="Parking">Parking</option>
          </select>
        </div>
        <div className="col-12">
          <ul className="actions">
            <li><input type="submit" value="Search" className="primary" /></li>
          </ul>
        </div>
      </div>
    </form>
  );
}

// ListingCard Component
function ListingCard({ listing }) {
  const [showBooking, setShowBooking] = useState(false);

  const handleBook = () => {
    alert("Booking initiated with Razorpay!");
  };

  return (
    <div className="col-4 col-12-medium">
      <span className="image fit">
        <img src={listing.photos[0] || "https://via.placeholder.com/300x200"} alt={listing.title} />
      </span>
      <h3>{listing.title}</h3>
      <p>Rent: ₹{listing.rent}</p>
      <p>Location: {listing.location}</p>
      <p>Facilities: {listing.facilities.join(", ")}</p>
      <p>Available: {listing.available ? "Yes" : "No"}</p>
      <p>Rating: {listing.rating || "N/A"}</p>
      <ul className="actions special">
        <li>
          <button
            onClick={() => setShowBooking(!showBooking)}
            className="button primary"
          >
            {showBooking ? "Cancel" : "Book Now"}
          </button>
        </li>
        {showBooking && (
          <li>
            <button onClick={handleBook} className="button">
              Confirm Booking
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}

// Home Component
function Home() {
  return (
    <>
      <section id="header">
        <div className="inner">
          <span className="icon solid major fa-cloud"></span>
          <h1>
            Welcome to <strong>PG Finder</strong><br />
            Your perfect stay awaits!
          </h1>
          <p>Search, book, and manage PGs, hostels, and rooms with ease.</p>
          <ul className="actions special">
            <li><a href="#search" className="button scrolly">Start Searching</a></li>
          </ul>
        </div>
      </section>
      <section id="search" className="main style1">
        <div className="container">
          <header className="major">
            <h2>Find Your Stay</h2>
          </header>
          <SearchBar />
        </div>
      </section>
    </>
  );
}

// Listings Component
function Listings() {
  const [listings, setListings] = useState([]);
  const location = useLocation();

  const dummyListings = [
    {
      _id: "1",
      title: "2-Bed PG Near Station",
      rent: 8000,
      location: "Mumbai",
      facilities: ["WiFi", "Food"],
      photos: ["https://via.placeholder.com/300x200"],
      available: true,
      rating: 4.5,
    },
    {
      _id: "2",
      title: "Cozy Rental Room",
      rent: 6000,
      location: "Delhi",
      facilities: ["AC", "Parking"],
      photos: ["https://via.placeholder.com/300x200"],
      available: false,
      rating: 4.0,
    },
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filteredListings = dummyListings.filter((listing) => {
      const locationParam = params.get("location");
      const rentParam = params.get("rent");
      const facilityParam = params.get("facility");
      return (
        (!locationParam || listing.location.toLowerCase().includes(locationParam.toLowerCase())) &&
        (!rentParam || listing.rent <= parseInt(rentParam)) &&
        (!facilityParam || listing.facilities.includes(facilityParam))
      );
    });
    setListings(filteredListings);
  }, [location.search]);

  return (
    <section id="three" className="main style1 special">
      <div className="container">
        <header className="major">
          <h2>Available Listings</h2>
        </header>
        {listings.length > 0 ? (
          <div className="row gtr-150">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        ) : (
          <p>No listings found.</p>
        )}
      </div>
    </section>
  );
}

// OwnerDashboard Component
function OwnerDashboard() {
  const [listings, setListings] = useState([]);
  const [newListing, setNewListing] = useState({
    title: "",
    rent: "",
    location: "",
    facilities: [],
    photos: [],
  });

  const dummyOwnerListings = [
    { _id: "1", title: "PG 1", rent: 8000, tenants: 2, revenue: 16000 },
  ];

  const handleAddListing = (e) => {
    e.preventDefault();
    setListings([...listings, { ...newListing, _id: Date.now().toString() }]);
    setNewListing({ title: "", rent: "", location: "", facilities: [], photos: [] });
    alert("Listing added! Notification sent to tenants.");
  };

  return (
    <section id="two" className="main style2">
      <div className="container">
        <header className="major">
          <h2>Owner Dashboard</h2>
        </header>
        <div className="row gtr-150">
          <div className="col-6 col-12-medium">
            <form onSubmit={handleAddListing} className="box">
              <div className="row gtr-uniform gtr-50">
                <div className="col-12">
                  <input
                    type="text"
                    placeholder="Title"
                    value={newListing.title}
                    onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <input
                    type="number"
                    placeholder="Rent"
                    value={newListing.rent}
                    onChange={(e) => setNewListing({ ...newListing, rent: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    placeholder="Location"
                    value={newListing.location}
                    onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    placeholder="Facilities (comma-separated)"
                    onChange={(e) =>
                      setNewListing({ ...newListing, facilities: e.target.value.split(",") })
                    }
                  />
                </div>
                <div className="col-12">
                  <ul className="actions">
                    <li><input type="submit" value="Add Listing" className="primary" /></li>
                  </ul>
                </div>
              </div>
            </form>
          </div>
          <div className="col-6 col-12-medium">
            {dummyOwnerListings.map((listing) => (
              <div key={listing._id} className="box">
                <h3>{listing.title}</h3>
                <p>Tenants: {listing.tenants}</p>
                <p>Revenue: ₹{listing.revenue}</p>
                <ul className="actions special">
                  <li><button className="button primary">Chat with Tenants</button></li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// AdminDashboard Component
function AdminDashboard() {
  const [pendingListings, setPendingListings] = useState([
    { _id: "1", title: "New PG", owner: "owner1@example.com" },
  ]);

  const handleApprove = (id) => {
    setPendingListings(pendingListings.filter((l) => l._id !== id));
    alert("Listing approved!");
  };

  return (
    <section id="three" className="main style1 special">
      <div className="container">
        <header className="major">
          <h2>Admin Dashboard</h2>
        </header>
        <div className="box">
          <h3>Pending Listings</h3>
          {pendingListings.map((listing) => (
            <div key={listing._id} className="row gtr-50">
              <div className="col-6 col-12-medium">
                <p>{listing.title} - {listing.owner}</p>
              </div>
              <div className="col-6 col-12-medium">
                <ul className="actions">
                  <li>
                    <button
                      onClick={() => handleApprove(listing._id)}
                      className="button primary"
                    >
                      Approve
                    </button>
                  </li>
                  <li>
                    <button className="button">Reject</button>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main App Component
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
        <section id="footer">
          <ul className="icons">
            <li><a href="#" className="icon brands alt fa-twitter"><span className="label">Twitter</span></a></li>
            <li><a href="#" className="icon brands alt fa-facebook-f"><span className="label">Facebook</span></a></li>
            <li><a href="#" className="icon brands alt fa-instagram"><span className="label">Instagram</span></a></li>
            <li><a href="#" className="icon brands alt fa-github"><span className="label">GitHub</span></a></li>
            <li><a href="#" className="icon solid alt fa-envelope"><span className="label">Email</span></a></li>
          </ul>
          <ul className="copyright">
            <li>© PG Finder</li>
            <li>Design: <a href="http://html5up.net">HTML5 UP</a></li>
          </ul>
        </section>
      </Router>
    </Provider>
  );
}

export default App;