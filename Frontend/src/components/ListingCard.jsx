import { useState } from "react";

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

export default ListingCard;