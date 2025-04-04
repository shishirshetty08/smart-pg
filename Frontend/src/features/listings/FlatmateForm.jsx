import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createListing } from "../../store";
import { 
  FaArrowLeft, FaArrowRight, FaCheck, FaMale, FaFemale, 
  FaUsers, FaHome, FaMapMarkerAlt, FaRupeeSign, FaFan, 
  FaSnowflake, FaTv, FaCouch, FaCalendarAlt, FaCamera, 
  FaUser, FaPhone, FaEnvelope, FaExclamationTriangle 
} from "react-icons/fa";
import { GiWashingMachine } from "react-icons/gi";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import L from "leaflet";

// Fix for Leaflet marker icons in Vite
const iconRetinaUrl = new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href;
const iconUrl = new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href;
const shadowUrl = new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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
    location: null,
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fields = [
    { name: "flatmateDetails", label: "Flatmate Details" },
    { name: "houseDetails", label: "House Details" },
    { name: "addressDetails", label: "Enter Address" },
    { name: "pinLocation", label: "Pin Location" },
    { name: "basicDetails", label: "Enter Basic Details" },
    { name: "amenities", label: "Amenities" },
    { name: "titleDescription", label: "Add Title and Description" },
    { name: "ownerContact", label: "Owner Contact" },
    { name: "uploadImages", label: "Upload Property Images" },
  ];

  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!formData.title || formData.numFlatmates < 1) {
          return "Title and at least 1 flatmate are required.";
        }
        break;
      case 1:
        if (!formData.houseModel || !formData.houseType) {
          return "Please select both house model and type.";
        }
        break;
      case 2:
        if (!formData.city || !formData.locality || !formData.address) {
          return "City, locality, and address are required.";
        }
        break;
      case 3:
        if (!formData.location) {
          return "Please pin a location on the map.";
        }
        break;
      case 4:
        if (!formData.deposit || !formData.rent || !formData.maintenance) {
          return "Deposit, rent, and maintenance are required.";
        }
        break;
      case 5:
        if (!formData.furnishingType) {
          return "Please select furnishing type.";
        }
        break;
      case 6:
        if (!formData.title || !formData.description) {
          return "Title and description are required.";
        }
        break;
      case 7:
        if (!formData.ownerName || !formData.ownerPhone || !formData.ownerEmail) {
          return "Owner name, phone, and email are required.";
        }
        break;
      case 8:
        if (formData.images.length === 0) {
          return "Please upload at least one image.";
        }
        break;
      default:
        return "";
    }
    return "";
  };

  const handleNext = () => {
    const validationError = validateStep(step);
    if (validationError) {
      setError(validationError);
      return;
    }
    setStep((prev) => Math.min(prev + 1, fields.length - 1));
    setError("");
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 0));
    setError("");
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const validationError = validateStep(step);
      if (validationError) {
        setError(validationError);
        setIsSubmitting(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("location", JSON.stringify(formData.location || { lat: 0, lng: 0 }));
      formDataToSend.append("locationString", `${formData.city}, ${formData.locality}${formData.landmark ? `, ${formData.landmark}` : ""}${formData.zipCode ? `, ${formData.zipCode}` : ""}`);
      formDataToSend.append("rent", formData.rent);
      formDataToSend.append("facilities", JSON.stringify([formData.houseModel, formData.houseType, formData.furnishingType]));
      formDataToSend.append("type", "Flatmate");
      formDataToSend.append("description", `${formData.description}\nGender: ${formData.gender}\nFlatmates: ${formData.numFlatmates}\nDeposit: ${formData.deposit}\nMaintenance: ${formData.maintenance}\nNegotiable: ${formData.negotiable ? "Yes" : "No"}`);
      formDataToSend.append("availableFrom", formData.availableFrom.toISOString());
      formDataToSend.append("events", "No");
      formDataToSend.append("amenities", JSON.stringify(formData.amenities));
      formDataToSend.append("leaseTerm", "0");
      formDataToSend.append("ownerContact", JSON.stringify({
        name: formData.ownerName,
        phone: formData.ownerPhone,
        email: formData.ownerEmail,
      }));
      formData.images.forEach((file) => formDataToSend.append("images", file));

      const result = await dispatch(createListing(formDataToSend));
      
      if (result.error) {
        throw new Error(result.error.message || "Failed to create listing");
      }

      setSuccess("Flatmate listing added successfully!");
      setTimeout(() => navigate("/owner-dashboard"), 2000);
      
    } catch (error) {
      console.error("Submission error:", error);
      setError(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
    switch (field.name) {
      case "flatmateDetails":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaUsers className="text-blue-500" /> Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Modern Flatmate in Delhi"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaUsers className="text-blue-500" /> Gender Preference *
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
                      formData.gender === option.value ? "bg-blue-500 text-white" : "bg-white text-neutral-700 hover:bg-neutral-100"
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
                <FaUsers className="text-blue-500" /> Number of Flatmates *
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleChange("numFlatmates", Math.max(1, formData.numFlatmates - 1))}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                >
                  -
                </button>
                <span className="text-xl font-semibold text-neutral-900">{formData.numFlatmates}</span>
                <button
                  type="button"
                  onClick={() => handleChange("numFlatmates", formData.numFlatmates + 1)}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        );
      case "houseDetails":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaHome className="text-blue-500" /> House Model *
              </label>
              <div className="flex flex-wrap gap-3">
                {["1RK", "1BHK", "2BHK", "3BHK", "4BHK", "4+BHK"].map((model) => (
                  <button
                    key={model}
                    type="button"
                    onClick={() => handleChange("houseModel", model)}
                    className={`p-3 rounded-lg border transition-all duration-300 ${
                      formData.houseModel === model ? "bg-blue-500 text-white" : "bg-white text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaHome className="text-blue-500" /> House Type *
              </label>
              <div className="flex gap-4">
                {["Flat", "Apartment", "House"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleChange("houseType", type)}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-300 ${
                      formData.houseType === type ? "bg-blue-500 text-white" : "bg-white text-neutral-700 hover:bg-neutral-100"
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
      case "addressDetails":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaHome className="text-blue-500" /> City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="e.g., Delhi"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaHome className="text-blue-500" /> Locality *
              </label>
              <input
                type="text"
                value={formData.locality}
                onChange={(e) => handleChange("locality", e.target.value)}
                placeholder="e.g., Karol Bagh"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaHome className="text-blue-500" /> Address *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="e.g., 123 Main Street"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                rows="3"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaHome className="text-blue-500" /> Landmark (Optional)
              </label>
              <input
                type="text"
                value={formData.landmark}
                onChange={(e) => handleChange("landmark", e.target.value)}
                placeholder="e.g., Near Metro Station"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaHome className="text-blue-500" /> Zip Code (Optional)
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => handleChange("zipCode", e.target.value)}
                placeholder="e.g., 110005"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
              />
            </div>
          </div>
        );
      case "pinLocation":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-500" /> Pin Location *
              </label>
              <p className="text-neutral-600 mb-4">Double-click on the map to pin the location</p>
              <div className="relative w-full h-64 rounded-lg overflow-hidden border border-neutral-200">
                <MapContainer center={[28.6139, 77.2090]} zoom={13} style={{ height: "100%", width: "100%" }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
      case "basicDetails":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaRupeeSign className="text-blue-500" /> Deposit *
              </label>
              <input
                type="number"
                value={formData.deposit}
                onChange={(e) => handleChange("deposit", e.target.value)}
                placeholder="e.g., 10000"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaRupeeSign className="text-blue-500" /> Rent (₹/month) *
              </label>
              <input
                type="number"
                value={formData.rent}
                onChange={(e) => handleChange("rent", e.target.value)}
                placeholder="e.g., 7000"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaRupeeSign className="text-blue-500" /> Maintenance (₹/month) *
              </label>
              <input
                type="number"
                value={formData.maintenance}
                onChange={(e) => handleChange("maintenance", e.target.value)}
                placeholder="e.g., 500"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2">Negotiable?</label>
              <div className="flex items-center gap-4">
                <span className="text-neutral-700">{formData.negotiable ? "Yes" : "No"}</span>
                <button
                  type="button"
                  onClick={() => handleChange("negotiable", !formData.negotiable)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${formData.negotiable ? "bg-blue-500" : "bg-neutral-300"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 ${formData.negotiable ? "translate-x-5" : "translate-x-1"}`}
                  />
                </button>
              </div>
            </div>
          </div>
        );
      case "amenities":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaHome className="text-blue-500" /> Amenities
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
                      const updated = formData.amenities.includes(amenity.name)
                        ? formData.amenities.filter((a) => a !== amenity.name)
                        : [...formData.amenities, amenity.name];
                      handleChange("amenities", updated);
                    }}
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      formData.amenities.includes(amenity.name) ? "bg-blue-500 text-white" : "bg-white text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    <amenity.icon size={24} className="mx-auto" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaHome className="text-blue-500" /> Furnishing Type *
              </label>
              <div className="flex gap-4">
                {["Unfurnished", "Semi Furnished", "Furnished"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleChange("furnishingType", type)}
                    className={`p-3 rounded-lg border transition-all duration-300 ${
                      formData.furnishingType === type ? "bg-blue-500 text-white" : "bg-white text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case "titleDescription":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaHome className="text-blue-500" /> Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Modern Flatmate in Delhi"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaHome className="text-blue-500" /> Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="e.g., Spacious flat with great amenities..."
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                rows="4"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-500" /> Available From *
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
      case "ownerContact":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaUser className="text-blue-500" /> Owner Name *
              </label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => handleChange("ownerName", e.target.value)}
                placeholder="e.g., John Doe"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaPhone className="text-blue-500" /> Owner Phone *
              </label>
              <input
                type="tel"
                value={formData.ownerPhone}
                onChange={(e) => handleChange("ownerPhone", e.target.value)}
                placeholder="e.g., +91 9876543210"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaEnvelope className="text-blue-500" /> Owner Email *
              </label>
              <input
                type="email"
                value={formData.ownerEmail}
                onChange={(e) => handleChange("ownerEmail", e.target.value)}
                placeholder="e.g., john.doe@example.com"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                required
              />
            </div>
          </div>
        );
      case "uploadImages":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                <FaCamera className="text-blue-500" /> Upload Property Images *
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
                  handleChange("images", validFiles);
                }}
                className="w-full p-3 border border-neutral-200 rounded-lg bg-neutral-50"
              />
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {formData.images.map((file, idx) => (
                    <img key={idx} src={URL.createObjectURL(file)} alt={`Preview ${idx}`} className="w-full h-24 object-cover rounded-lg" />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
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
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaExclamationTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaCheck className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {renderField()}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={step === 0}
                className={`p-3 rounded-lg flex items-center gap-2 ${step === 0 ? "bg-neutral-300 text-neutral-600 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"} transition-all duration-300`}
              >
                <FaArrowLeft /> Previous
              </button>
              {step < fields.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="bg-blue-500 text-white p-3 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-all duration-300"
                >
                  Next <FaArrowRight />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`bg-blue-500 text-white p-3 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-all duration-300 ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCheck /> Submit
                    </>
                  )}
                </button>
              )}
            </div>
            <p className="text-neutral-600 text-center">Step {step + 1} of {fields.length}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FlatmateForm;