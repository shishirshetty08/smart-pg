import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addListing } from "../../store";
import { FaArrowLeft, FaArrowRight, FaCheck, FaMale, FaFemale, FaUsers, FaHome, FaMapMarkerAlt, FaRupeeSign, FaFan, FaSnowflake, FaTv, FaCouch, FaCalendarAlt, FaCamera, FaUser, FaPhone, FaEnvelope } from "react-icons/fa";
import { GiWashingMachine } from "react-icons/gi";
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

const FlatmateForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    gender: "Any",
    numFlatmates: 1,
    houseModel: "1RK",
    houseType: "Flat",
    city: "",
    locality: "",
    address: "",
    landmark: "",
    zipCode: "",
    location: null, // Stores { lat, lng }
    deposit: "",
    rent: "",
    maintenance: "",
    negotiable: false,
    amenities: [],
    furnishingType: "Unfurnished",
    description: "",
    availableFrom: new Date(),
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    images: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fields = [
    { name: "flatmateDetails", label: "Flatmate Details", type: "custom", required: true },
    { name: "houseDetails", label: "House Details", type: "custom", required: true },
    { name: "addressDetails", label: "Enter Address", type: "custom", required: true },
    { name: "pinLocation", label: "Pin Location", type: "custom", required: true },
    { name: "basicDetails", label: "Enter Basic Details", type: "custom", required: true },
    { name: "amenities", label: "Amenities", type: "custom", required: true },
    { name: "titleDescription", label: "Add Title and Description", type: "custom", required: true },
    { name: "ownerContact", label: "Owner Contact", type: "custom", required: true },
    { name: "uploadImages", label: "Upload Property Images", type: "custom", required: true },
  ];

  const handleNext = () => {
    if (step === 0 && (!formData.title || formData.numFlatmates < 1)) {
      setError("Title and at least 1 flatmate are required.");
      return;
    }
    if (step === 1 && (!formData.houseModel || !formData.houseType)) {
      setError("Please select both house model and type.");
      return;
    }
    if (step === 2 && (!formData.city || !formData.locality || !formData.address)) {
      setError("City, locality, and address are required.");
      return;
    }
    if (step === 3 && !formData.location) {
      setError("Please pin a location on the map.");
      return;
    }
    if (step === 4 && (!formData.deposit || !formData.rent || !formData.maintenance)) {
      setError("Deposit, rent, and maintenance are required.");
      return;
    }
    if (step === 5 && !formData.furnishingType) {
      setError("Please select furnishing type.");
      return;
    }
    if (step === 6 && (!formData.title || !formData.description)) {
      setError("Title and description are required.");
      return;
    }
    if (step === 7 && (!formData.ownerName || !formData.ownerPhone || !formData.ownerEmail)) {
      setError("Owner name, phone, and email are required.");
      return;
    }
    if (step === 8 && formData.images.length === 0) {
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
    const requiredFields = [
      "title", "gender", "numFlatmates", "houseModel", "houseType", "city", "locality", "address",
      "location", "deposit", "rent", "maintenance", "furnishingType", "description",
      "ownerName", "ownerPhone", "ownerEmail", "images"
    ];
    const missingFields = requiredFields.filter((field) => !formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0));
    if (missingFields.length > 0) {
      setError("Please fill all required fields.");
      console.log("Missing fields:", missingFields);
      return;
    }

    const newListing = {
      _id: Date.now().toString(),
      title: formData.title,
      location: formData.location, // { lat, lng }
      locationString: `${formData.city}, ${formData.locality}`,
      rent: parseInt(formData.rent),
      facilities: formData.amenities,
      type: "flatmate",
      image: formData.images[0], // First image for preview
      images: formData.images, // Full array for detailed view
      numFlatmates: parseInt(formData.numFlatmates),
      deposit: parseInt(formData.deposit),
      maintenance: parseInt(formData.maintenance),
      availableFrom: formData.availableFrom.toISOString(),
      gender: formData.gender,
      houseModel: formData.houseModel,
      houseType: formData.houseType,
      furnishingType: formData.furnishingType,
      description: formData.description,
      ownerContact: {
        name: formData.ownerName,
        phone: formData.ownerPhone,
        email: formData.ownerEmail,
      },
    };

    console.log("Dispatching flatmate listing:", newListing);
    dispatch(addListing(newListing));
    setSuccess("Flatmate listing added successfully!");
    setTimeout(() => navigate("/owner-dashboard"), 2000);
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const LocationMarker = () => {
    const map = useMapEvents({
      dblclick(e) {
        handleChange("location", { lat: e.latlng.lat, lng: e.latlng.lng });
        map.flyTo(e.latlng, map.getZoom());
      },
    });
    return formData.location ? (
      <Marker position={[formData.location.lat, formData.location.lng]} />
    ) : null;
  };

  const renderField = () => {
    const field = fields[step];
    if (field.type === "custom") {
      if (field.name === "flatmateDetails") {
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaUsers className="text-primary-500" /> Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Modern Flatmate in Delhi"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaUsers className="text-primary-500" /> Gender Preference *
              </label>
              <div className="flex gap-4">
                {[
                  { value: "Male", icon: FaMale },
                  { value: "Female", icon: FaFemale },
                  { value: "Any", icon: FaUsers },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChange("gender", option.value)}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-300 ${
                      formData.gender === option.value
                        ? "bg-primary-500 text-white border-primary-500"
                        : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                    }`}
                  >
                    <option.icon size={20} />
                    {option.value}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaUsers className="text-primary-500" /> Number of Flatmates Required *
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleChange("numFlatmates", Math.max(1, formData.numFlatmates - 1))}
                  className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-all duration-300"
                >
                  -
                </button>
                <span className="text-xl font-semibold text-neutral-900">{formData.numFlatmates}</span>
                <button
                  type="button"
                  onClick={() => handleChange("numFlatmates", formData.numFlatmates + 1)}
                  className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-all duration-300"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        );
      } else if (field.name === "houseDetails") {
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaHome className="text-primary-500" /> Select House Model *
              </label>
              <div className="flex flex-wrap gap-3">
                {["1RK", "1BHK", "2BHK", "3BHK", "4BHK", "4+BHK"].map((model) => (
                  <button
                    key={model}
                    type="button"
                    onClick={() => handleChange("houseModel", model)}
                    className={`p-3 rounded-lg border transition-all duration-300 ${
                      formData.houseModel === model
                        ? "bg-primary-500 text-white border-primary-500"
                        : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaHome className="text-primary-500" /> Select House Type *
              </label>
              <div className="flex gap-4">
                {["Flat", "Apartment", "House"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleChange("houseType", type)}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-300 ${
                      formData.houseType === type
                        ? "bg-primary-500 text-white border-primary-500"
                        : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                    }`}
                  >
                    <FaHome size={20} />
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      } else if (field.name === "addressDetails") {
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaHome className="text-primary-500" /> City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="e.g., Delhi"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaHome className="text-primary-500" /> Select Locality *
              </label>
              <input
                type="text"
                value={formData.locality}
                onChange={(e) => handleChange("locality", e.target.value)}
                placeholder="e.g., Karol Bagh"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaHome className="text-primary-500" /> Address *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="e.g., 123 Main Street"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50"
                rows="3"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaHome className="text-primary-500" /> Landmark (Optional)
              </label>
              <input
                type="text"
                value={formData.landmark}
                onChange={(e) => handleChange("landmark", e.target.value)}
                placeholder="e.g., Near Metro Station"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaHome className="text-primary-500" /> Zip Code (Optional)
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => handleChange("zipCode", e.target.value)}
                placeholder="e.g., 110005"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50"
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
              <div className="relative w-full h-64 rounded-lg overflow-hidden border border-neutral-200">
                <MapContainer
                  center={[28.6139, 77.2090]}
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
              {formData.location && (
                <p className="text-neutral-600 mt-2">
                  Pinned: Lat {formData.location.lat.toFixed(4)}, Lng {formData.location.lng.toFixed(4)}
                </p>
              )}
            </div>
          </div>
        );
      } else if (field.name === "basicDetails") {
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaRupeeSign className="text-primary-500" /> Deposit *
              </label>
              <input
                type="number"
                value={formData.deposit}
                onChange={(e) => handleChange("deposit", e.target.value)}
                placeholder="e.g., 10000"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaRupeeSign className="text-primary-500" /> Rent (₹/month) *
              </label>
              <input
                type="number"
                value={formData.rent}
                onChange={(e) => handleChange("rent", e.target.value)}
                placeholder="e.g., 7000"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaRupeeSign className="text-primary-500" /> Maintenance (₹/month) *
              </label>
              <input
                type="number"
                value={formData.maintenance}
                onChange={(e) => handleChange("maintenance", e.target.value)}
                placeholder="e.g., 500"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                Negotiable?
              </label>
              <div className="flex items-center gap-4">
                <span className="text-neutral-700">{formData.negotiable ? "Yes" : "No"}</span>
                <button
                  type="button"
                  onClick={() => handleChange("negotiable", !formData.negotiable)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                    formData.negotiable ? "bg-primary-500" : "bg-neutral-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 ${
                      formData.negotiable ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        );
      } else if (field.name === "amenities") {
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaHome className="text-primary-500" /> Amenities
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: "Fan", icon: FaFan },
                  { name: "AC", icon: FaSnowflake },
                  { name: "Refrigerator", icon: FaSnowflake },
                  { name: "TV", icon: FaTv },
                  { name: "Washing Machine", icon: GiWashingMachine },
                  { name: "Sofa", icon: FaCouch },
                ].map((amenity) => (
                  <button
                    key={amenity.name}
                    type="button"
                    onClick={() => {
                      const updatedAmenities = formData.amenities.includes(amenity.name)
                        ? formData.amenities.filter((a) => a !== amenity.name)
                        : [...formData.amenities, amenity.name];
                      handleChange("amenities", updatedAmenities);
                    }}
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      formData.amenities.includes(amenity.name)
                        ? "bg-primary-500 text-white border-primary-500"
                        : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                    }`}
                  >
                    <amenity.icon size={24} className="mx-auto" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaHome className="text-primary-500" /> Select Furnishing Type *
              </label>
              <div className="flex gap-4">
                {["Semi Furnished", "Furnished", "Unfurnished"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleChange("furnishingType", type)}
                    className={`p-3 rounded-lg border transition-all duration-300 ${
                      formData.furnishingType === type
                        ? "bg-primary-500 text-white border-primary-500"
                        : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      } else if (field.name === "titleDescription") {
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaUsers className="text-primary-500" /> Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Modern Flatmate in Delhi"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaUsers className="text-primary-500" /> Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="e.g., Spacious flat with great amenities..."
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50"
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
                className="w-full p-3 border border-neutral-200 rounded-lg bg-neutral-50"
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
                placeholder="e.g., John Doe"
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
                placeholder="e.g., john.doe@example.com"
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
                className="w-full p-3 border border-neutral-200 rounded-lg bg-neutral-50"
              />
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {formData.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`Preview ${idx}`} className="w-full h-24 object-cover rounded-lg" />
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
            Add Flatmate Listing
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

export default FlatmateForm;