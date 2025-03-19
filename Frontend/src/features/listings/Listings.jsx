import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ListingCard from "../../components/ListingCard";

function Listings() {
  const listings = useSelector((state) => state.listings.listings);
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

export default Listings;