import StepForm from "../../components/StepForm";

const RoommateForm = () => {
  const fields = [
    { name: "title", label: "Title", type: "text", placeholder: "e.g., Roommate Needed in Mumbai", required: true },
    { name: "location", label: "Location", type: "text", placeholder: "e.g., Mumbai", required: true },
    { name: "rent", label: "Rent (₹/month)", type: "number", placeholder: "e.g., 5000", required: true },
    { name: "numRoommates", label: "Number of Roommates", type: "number", placeholder: "e.g., 2", required: true },
    { name: "smoking", label: "Smoking Allowed", type: "select", options: ["Yes", "No"], required: true },
    { name: "pets", label: "Pets Allowed", type: "select", options: ["Yes", "No"], required: true },
    { name: "description", label: "Description", type: "text", placeholder: "e.g., Looking for a tidy roommate...", required: true },
    { name: "images", label: "Upload Images", type: "file", required: true },
  ];

  return <StepForm type="Roommate" fields={fields} />;
};

export default RoommateForm;