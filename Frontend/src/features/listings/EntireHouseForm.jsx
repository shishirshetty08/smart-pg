// src/features/listings/EntireHouseForm.jsx
import StepForm from "../../components/StepForm";
import { FaHome, FaMoneyBillAlt, FaList, FaBed, FaBath, FaParking, FaImage } from "react-icons/fa";

const fields = [
  { name: "title", label: "Title", type: "text", placeholder: "e.g., Modern House in Bangalore", required: true, icon: FaHome },
  { name: "location", label: "Location", type: "text", placeholder: "e.g., Bangalore", required: true, icon: FaHome },
  { name: "rent", label: "Rent (₹/month)", type: "number", placeholder: "e.g., 15000", required: true, icon: FaMoneyBillAlt },
  { name: "facilities", label: "Facilities", type: "checkbox", options: ["WiFi", "Food", "AC", "Parking"], icon: FaList },
  { name: "bedrooms", label: "Number of Bedrooms", type: "number", placeholder: "e.g., 3", required: true, icon: FaBed },
  { name: "bathrooms", label: "Number of Bathrooms", type: "number", placeholder: "e.g., 2", required: true, icon: FaBath },
  { name: "parking", label: "Parking Spaces", type: "number", placeholder: "e.g., 1", required: true, icon: FaParking },
  { name: "image", label: "Image URL", type: "text", placeholder: "e.g., https://example.com/image.jpg", icon: FaImage },
];

function EntireHouseForm() {
  return <StepForm type="Entire House" fields={fields} />;
}

export default EntireHouseForm;