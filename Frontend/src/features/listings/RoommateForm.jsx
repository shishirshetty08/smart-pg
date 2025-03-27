// src/features/listings/RoommateForm.jsx
import StepForm from "../../components/StepForm";
import { FaHome, FaMoneyBillAlt, FaList, FaUsers, FaImage } from "react-icons/fa";

const fields = [
  { name: "title", label: "Title", type: "text", placeholder: "e.g., Cozy Roommate in Mumbai", required: true, icon: FaHome },
  { name: "location", label: "Location", type: "text", placeholder: "e.g., Mumbai", required: true, icon: FaHome },
  { name: "rent", label: "Rent (₹/month)", type: "number", placeholder: "e.g., 6000", required: true, icon: FaMoneyBillAlt },
  { name: "facilities", label: "Facilities", type: "checkbox", options: ["WiFi", "Food", "AC", "Parking"], icon: FaList },
  { name: "numRoommates", label: "Number of Roommates", type: "number", placeholder: "e.g., 3", required: true, icon: FaUsers },
  { name: "smoking", label: "Smoking Allowed", type: "select", options: ["No", "Yes"], required: true },
  { name: "pets", label: "Pet Friendly", type: "select", options: ["No", "Yes"], required: true },
  { name: "image", label: "Image URL", type: "text", placeholder: "e.g., https://example.com/image.jpg", icon: FaImage },
];

function RoommateForm() {
  return <StepForm type="Roommate" fields={fields} />;
}

export default RoommateForm;