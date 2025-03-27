// src/components/SearchBar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaFilter } from "react-icons/fa";
import { motion } from "framer-motion";

const filterDropdownVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

function SearchBar() {
  const [location, setLocation] = useState("");
  const [rent, setRent] = useState("");
  const [facility, setFacility] = useState("");
  const [type, setType] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  const fetchSuggestions = async (input) => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${input}&limit=5`
      );
      setSuggestions(response.data.map((place) => place.display_name));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion);
    setSuggestions([]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/listings?location=${location}&rent=${rent}&facility=${facility}&type=${type}`);
    setSuggestions([]);
    setIsFilterOpen(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 relative">
      <form onSubmit={handleSearch} className="flex items-center bg-white rounded-full shadow-lg border border-neutral-200 p-2">
        {/* Location Input */}
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by location (e.g., Mumbai)"
            value={location}
            onChange={handleLocationChange}
            className="w-full p-2 pl-4 bg-transparent rounded-full focus:outline-none focus:ring-0 text-neutral-700 placeholder-neutral-400"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-20 w-full bg-white border border-neutral-200 rounded-lg shadow-lg mt-2 max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 text-neutral-700 hover:bg-primary-50 hover:text-primary-500 cursor-pointer transition-colors duration-200"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search Icon */}
        <button
          type="submit"
          className="p-2 text-neutral-700 hover:text-primary-500 transition-colors duration-300"
        >
          <FaSearch size={18} />
        </button>

        {/* Filter Icon with Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="p-2 text-neutral-700 hover:text-primary-500 transition-colors duration-300"
          >
            <FaFilter size={18} />
          </button>
          {isFilterOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={filterDropdownVariants}
              className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-20 border border-neutral-200"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Max Rent
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 8000"
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Facility
                  </label>
                  <select
                    value={facility}
                    onChange={(e) => setFacility(e.target.value)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-700"
                  >
                    <option value="">Select Facility</option>
                    <option value="WiFi">WiFi</option>
                    <option value="Food">Food</option>
                    <option value="AC">AC</option>
                    <option value="Parking">Parking</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-700"
                  >
                    <option value="">Select Type</option>
                    <option value="PG">PG</option>
                    <option value="Room">Room</option>
                    <option value="Hostel">Hostel</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-500 text-white p-2 rounded-lg hover:bg-primary-600 transition-all duration-300 font-semibold"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </form>
    </div>
  );
}

export default SearchBar;