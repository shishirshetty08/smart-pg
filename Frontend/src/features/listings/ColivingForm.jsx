// src/features/listings/ColivingForm.jsx
import StepForm from "../../components/StepForm";
import { FaHome, FaMoneyBillAlt, FaList, FaImage } from "react-icons/fa";

const fields = [
  { name: "title", label: "Title", type: "text", placeholder: "e.g., Co-Living in Hyderabad", required: true, icon: FaHome },
  { name: "location", label: "Location", type: "text", placeholder: "e.g., Hyderabad", required: true, icon: FaHome },
  { name: "rent", label: "Rent (₹/month)", type: "number", placeholder: "e.g., 7000", required: true, icon: FaMoneyBillAlt },
  { name: "facilities", label: "Facilities", type: "checkbox", options: ["WiFi", "Food", "AC", "Parking"], icon: FaList },
  { name: "events", label: "Community Events", type: "select", options: ["No", "Yes"], required: true },
  { name: "amenities", label: "Shared Amenities", type: "checkbox", options: ["Gym", "Lounge", "Kitchen"] },
  { name: "leaseTerm", label: "Lease Term (Months)", type: "number", placeholder: "e.g., 6", required: true },
  { name: "image", label: "Image URL", type: "text", placeholder: "e.g., https://example.com/image.jpg", icon: FaImage },
];

function ColivingForm() {
  return <StepForm type="Co-Living" fields={fields} />;
}

export default ColivingForm;