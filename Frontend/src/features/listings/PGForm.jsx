// src/features/listings/PGForm.jsx
import StepForm from "../../components/StepForm";
import { FaHome, FaMoneyBillAlt, FaList, FaImage } from "react-icons/fa";

const fields = [
  { name: "title", label: "Title", type: "text", placeholder: "e.g., Cozy PG in Chennai", required: true, icon: FaHome },
  { name: "location", label: "Location", type: "text", placeholder: "e.g., Chennai", required: true, icon: FaHome },
  { name: "rent", label: "Rent (₹/month)", type: "number", placeholder: "e.g., 8000", required: true, icon: FaMoneyBillAlt },
  { name: "facilities", label: "Facilities", type: "checkbox", options: ["WiFi", "Food", "AC", "Parking"], icon: FaList },
  { name: "meals", label: "Meals Included", type: "select", options: ["No", "Yes"], required: true },
  { name: "curfew", label: "Curfew", type: "select", options: ["No", "Yes"], required: true },
  { name: "occupancy", label: "Occupancy", type: "select", options: ["Single", "Double"], required: true },
  { name: "image", label: "Image URL", type: "text", placeholder: "e.g., https://example.com/image.jpg", icon: FaImage },
];

function PGForm() {
  return <StepForm type="PG" fields={fields} />;
}

export default PGForm;