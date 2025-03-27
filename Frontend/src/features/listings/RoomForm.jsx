// src/features/listings/RoomForm.jsx
import StepForm from "../../components/StepForm";
import { FaHome, FaMoneyBillAlt, FaList, FaBed, FaImage } from "react-icons/fa";

const fields = [
  { name: "title", label: "Title", type: "text", placeholder: "e.g., Spacious Room in Pune", required: true, icon: FaHome },
  { name: "location", label: "Location", type: "text", placeholder: "e.g., Pune", required: true, icon: FaHome },
  { name: "rent", label: "Rent (₹/month)", type: "number", placeholder: "e.g., 5000", required: true, icon: FaMoneyBillAlt },
  { name: "facilities", label: "Facilities", type: "checkbox", options: ["WiFi", "Food", "AC", "Parking"], icon: FaList },
  { name: "size", label: "Room Size (sq ft)", type: "number", placeholder: "e.g., 200", required: true, icon: FaBed },
  { name: "furnished", label: "Furnished", type: "select", options: ["No", "Yes"], required: true },
  { name: "bathroom", label: "Attached Bathroom", type: "select", options: ["No", "Yes"], required: true },
  { name: "image", label: "Image URL", type: "text", placeholder: "e.g., https://example.com/image.jpg", icon: FaImage },
];

function RoomForm() {
  return <StepForm type="Room" fields={fields} />;
}

export default RoomForm;