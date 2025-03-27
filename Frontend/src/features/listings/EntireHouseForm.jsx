import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addListing } from "../../store";
import { FaArrowLeft, FaArrowRight, FaCheck, FaHome, FaMoneyBillAlt, FaList, FaBed, FaBath, FaParking, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser, FaCamera, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

const formVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

const EntireHouseForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    rent: "",
    facilities: [],
    bedrooms: "",
    bathrooms: "",
    parking: "",
    images: [],
    description: "",
    availableFrom: new Date(),
    mapLocation: null,
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fields = [
    { name: "basicDetails", label: "Basic Details", type: "custom", required: true },
    { name: "pinLocation", label: "Pin Location", type: "custom", required: true },
    { name: "titleDescription", label: "Title and Description", type: "custom", required: true },
    { name: "ownerContact", label: "Owner Contact", type: "custom", required: true },
    { name: "uploadImages", label: "Upload Property Images", type: "custom", required: true },
  ];

  const handleNext = () => {
    if (step === 0 && (!formData.title || !formData.location || !formData.rent || !formData.bedrooms)) {
      setError("Title, location, rent, and bedrooms are required.");
      return;
    }
    if (step === 1 && !formData.mapLocation) {
      setError("Please pin a location on the map.");
      return;
    }
    if (step === 2 && (!formData.description)) {
      setError("Description is required.");
      return;
    }
    if (step === 3 && (!formData.ownerName || !formData.ownerPhone || !formData.ownerEmail)) {
      setError("Owner name, phone, and email are required.");
      return;
    }
    if (step === 4 && formData.images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }
    setStep((prev) => Math.min(prev + 1, fields.length - 1));
    setError("");
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 0));
    setError("");
  };

  const handleSubmit = () => {
    const requiredFields = ["title", "location", "rent", "bedrooms", "mapLocation", "description", "ownerName", "ownerPhone", "ownerEmail", "images"];
    const missingFields = requiredFields.filter((field) => !formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0));
    if (missingFields.length > 0) {
      setError("Please fill all required fields.");
      console.log("Missing fields:", missingFields);
      return;
    }

    const newListing = {
      _id: Date.now().toString(),
      title: formData.title,
      location: formData.location,
      rent: parseInt(formData.rent),
      facilities: formData.facilities,
      type: "entireHouse",
      image: formData.images[0], // Use first image as primary
      images: formData.images, // Store all images
      description: formData.description,
      availableFrom: formData.availableFrom.toISOString(),
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      parking: parseInt(formData.parking),
      ownerContact: {
        name: formData.ownerName,
        phone: formData.ownerPhone,
        email: formData.ownerEmail,
      },
    };

    console.log("Dispatching Entire House listing:", newListing);
    dispatch(addListing(newListing));
    setSuccess("Entire House listing added successfully!");
    setTimeout(() => navigate("/owner-dashboard"), 2000); // Navigate to dashboard
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const LocationMarker = () => {
    const map = useMapEvents({
      dblclick(e) {
        handleChange("mapLocation", { lat: e.latlng.lat, lng: e.latlng.lng });
        map.flyTo(e.latlng, map.getZoom());
      },
    });
    return formData.mapLocation ? (
      <Marker position={[formData.mapLocation.lat, formData.mapLocation.lng]} />
    ) : null;
  };

  const renderField = () => {
    const field = fields[step];
    if (field.type === "custom") {
      if (field.name === "basicDetails") {
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaHome className="text-primary-500" /> Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Modern House in Bangalore"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50 shadow-sm hover:shadow-md transition-shadow duration-300"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaHome className="text-primary-500" /> Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="e.g., Bangalore"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50 shadow-sm hover:shadow-md transition-shadow duration-300"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaMoneyBillAlt className="text-primary-500" /> Rent (₹/month) *
              </label>
              <input
                type="number"
                value={formData.rent}
                onChange={(e) => handleChange("rent", e.target.value)}
                placeholder="e.g., 15000"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50 shadow-sm hover:shadow-md transition-shadow duration-300"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaList className="text-primary-500" /> Facilities
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["WiFi", "Food", "AC", "Parking"].map((option) => (
                  <label key={option} className="flex items-center gap-2 text-neutral-700">
                    <input
                      type="checkbox"
                      value={option}
                      checked={formData.facilities.includes(option)}
                      onChange={() => {
                        const updated = formData.facilities.includes(option)
                          ? formData.facilities.filter((f) => f !== option)
                          : [...formData.facilities, option];
                        handleChange("facilities", updated);
                      }}
                      className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-neutral-200 rounded"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaBed className="text-primary-500" /> Number of Bedrooms *
              </label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => handleChange("bedrooms", e.target.value)}
                placeholder="e.g., 3"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50 shadow-sm hover:shadow-md transition-shadow duration-300"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaBath className="text-primary-500" /> Number of Bathrooms
              </label>
              <input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => handleChange("bathrooms", e.target.value)}
                placeholder="e.g., 2"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50 shadow-sm hover:shadow-md transition-shadow duration-300"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaParking className="text-primary-500" /> Parking Spaces
              </label>
              <input
                type="number"
                value={formData.parking}
                onChange={(e) => handleChange("parking", e.target.value)}
                placeholder="e.g., 1"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50 shadow-sm hover:shadow-md transition-shadow duration-300"
              />
            </div>
          </div>
        );
      } else if (field.name === "pinLocation") {
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-primary-500" /> Pin Location *
              </label>
              <p className="text-neutral-600 mb-4">Double-tap on the map to pin the location</p>
              <div className="relative w-full h-64 rounded-lg overflow-hidden border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <MapContainer
                  center={[12.9716, 77.5946]} // Bangalore coordinates
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationMarker />
                </MapContainer>
              </div>
              {formData.mapLocation && (
                <p className="text-neutral-600 mt-2">
                  Pinned: Lat {formData.mapLocation.lat.toFixed(4)}, Lng {formData.mapLocation.lng.toFixed(4)}
                </p>
              )}
            </div>
          </div>
        );
      } else if (field.name === "titleDescription") {
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaHome className="text-primary-500" /> Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Modern House in Bangalore"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50 shadow-sm hover:shadow-md transition-shadow duration-300"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaHome className="text-primary-500" /> Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="e.g., Spacious house with modern amenities..."
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50 shadow-sm hover:shadow-md transition-shadow duration-300"
                rows="4"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaCalendarAlt className="text-primary-500" /> Available From *
              </label>
              <DatePicker
                onChange={(date) => handleChange("availableFrom", date)}
                value={formData.availableFrom}
                className="w-full p-3 border border-neutral-200 rounded-lg bg-neutral-50 shadow-sm hover:shadow-md transition-shadow duration-300"
                calendarClassName="border border-neutral-200 rounded-lg shadow-lg"
                clearIcon={null}
                format="dd/MM/yyyy"
              />
            </div>
          </div>
        );
      } else if (field.name === "ownerContact") {
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaUser className="text-primary-500" /> Owner Name *
              </label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => handleChange("ownerName", e.target.value)}
                placeholder="e.g., Jane Smith"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50 shadow-sm hover:shadow-md transition-shadow duration-300"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaPhone className="text-primary-500" /> Owner Phone *
              </label>
              <input
                type="tel"
                value={formData.ownerPhone}
                onChange={(e) => handleChange("ownerPhone", e.target.value)}
                placeholder="e.g., +91 9876543210"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50 shadow-sm hover:shadow-md transition-shadow duration-300"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaEnvelope className="text-primary-500" /> Owner Email *
              </label>
              <input
                type="email"
                value={formData.ownerEmail}
                onChange={(e) => handleChange("ownerEmail", e.target.value)}
                placeholder="e.g., jane.smith@example.com"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50 shadow-sm hover:shadow-md transition-shadow duration-300"
                required
              />
            </div>
          </div>
        );
      } else if (field.name === "uploadImages") {
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaCamera className="text-primary-500" /> Upload Property Images *
              </label>
              <p className="text-neutral-600 mb-4">Max File Size: 5MB, Accepted: JPG, GIF, PNG</p>
              <input
                type="file"
                multiple
                accept=".jpg,.gif,.png"
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024);
                  if (validFiles.length !== files.length) {
                    setError("Some files exceed 5MB limit.");
                  }
                  handleChange("images", validFiles.map((file) => URL.createObjectURL(file)));
                }}
                className="w-full p-3 border border-neutral-200 rounded-lg bg-neutral-50 shadow-sm hover:shadow-md transition-shadow duration-300"
              />
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {formData.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`Preview ${idx}`} className="w-full h-24 object-cover rounded-lg shadow-sm" />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      }
    }
    return <p className="text-red-500">Next steps coming soon!</p>;
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8 pt-24 font-['Inter']">
      <div className="container mx-auto px-4">
        <motion.div
          key={step}
          initial="hidden"
          animate="visible"
          variants={formVariants}
          className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg"
        >
          <h2 className="text-3xl font-bold text-neutral-900 mb-6 text-center capitalize">
            Add Entire House Listing
          </h2>
          {error && (
            <p className="text-red-500 bg-red-50 p-2 rounded mb-4 text-center">{error}</p>
          )}
          {success && (
            <p className="text-green-500 bg-green-50 p-2 rounded mb-4 text-center">{success}</p>
          )}
          <div className="space-y-6">
            {renderField()}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={step === 0}
                className={`p-3 rounded-lg flex items-center gap-2 ${
                  step === 0
                    ? "bg-neutral-300 text-neutral-600 cursor-not-allowed"
                    : "bg-primary-500 text-white hover:bg-primary-600"
                } transition-all duration-300`}
              >
                <FaArrowLeft /> Previous
              </button>
              {step < fields.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="bg-primary-500 text-white p-3 rounded-lg flex items-center gap-2 hover:bg-primary-600 transition-all duration-300"
                >
                  Next <FaArrowRight />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="bg-primary-500 text-white p-3 rounded-lg flex items-center gap-2 hover:bg-primary-600 transition-all duration-300"
                >
                  <FaCheck /> Submit
                </button>
              )}
            </div>
            <p className="text-neutral-600 text-center">
              Step {step + 1} of {fields.length}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EntireHouseForm;