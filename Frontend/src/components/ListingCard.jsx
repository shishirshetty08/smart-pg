import { FaMapMarkerAlt, FaMoneyBillAlt } from "react-icons/fa";

function ListingCard({ listing, onClick }) {
  // Handle location: prioritize locationString, then location (string or object), then city/locality
  const getLocationDisplay = (listing) => {
    if (listing.locationString) return listing.locationString;
    if (typeof listing.location === "string") return listing.location;
    if (listing.location && typeof listing.location === "object" && listing.location.lat && listing.location.lng) {
      return `Lat: ${listing.location.lat.toFixed(4)}, Lng: ${listing.location.lng.toFixed(4)}`;
    }
    if (listing.city && listing.locality) return `${listing.city}, ${listing.locality}`;
    return "Not specified";
  };

  // Handle image: use image if present, otherwise first from images array or fallback
  const imageSrc = listing.image || (listing.images && listing.images.length > 0 ? listing.images[0] : "https://via.placeholder.com/150");

  // Handle facilities/amenities
  const facilities = listing.facilities || listing.amenities || [];

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onClick={onClick} // Trigger detailed view on click
    >
      <img
        src={imageSrc}
        alt={listing.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">{listing.title}</h3>
        <div className="flex items-center gap-2 text-neutral-700 mb-2">
          <FaMapMarkerAlt className="text-primary-500" />
          <p>{getLocationDisplay(listing)}</p>
        </div>
        <div className="flex items-center gap-2 text-neutral-700 mb-2">
          <FaMoneyBillAlt className="text-primary-500" />
          <p>₹{listing.rent}/month</p>
        </div>
        <p className="text-neutral-600 text-sm">
          Facilities: {facilities.length > 0 ? facilities.join(", ") : "None"}
        </p>
      </div>
    </div>
  );
}

export default ListingCard;