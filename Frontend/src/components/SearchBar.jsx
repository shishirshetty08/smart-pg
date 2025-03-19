import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SearchBar() {
  const [location, setLocation] = useState("");
  const [rent, setRent] = useState("");
  const [facility, setFacility] = useState("");
  const [type, setType] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const fetchSuggestions = async (input) => {
    if (input.length < 2) return; // Prevent unnecessary API calls

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${input}`
      );
      setSuggestions(response.data.map((place) => place.display_name));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
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
  };

  return (
    <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto relative">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location Input with Autocomplete */}
        <div className="relative">
          <input
            type="text"
            placeholder="Location (e.g., Mumbai)"
            value={location}
            onChange={handleLocationChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border rounded shadow-lg mt-1 max-h-40 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Other Inputs */}
        <input
          type="number"
          placeholder="Max Rent (e.g., 8000)"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select value={facility} onChange={(e) => setFacility(e.target.value)} className="p-2 border rounded">
          <option value="">Select Facility</option>
          <option value="WiFi">WiFi</option>
          <option value="Food">Food</option>
          <option value="AC">AC</option>
          <option value="Parking">Parking</option>
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="p-2 border rounded">
          <option value="">Select Type</option>
          <option value="PG">PG</option>
          <option value="Room">Room</option>
          <option value="Hostel">Hostel</option>
        </select>
      </div>
      
      {/* Search Button */}
      <button type="submit" className="mt-4 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        Search Now
      </button>
    </form>
  );
}

export default SearchBar;
