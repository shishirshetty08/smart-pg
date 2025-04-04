import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createListing } from "../store";
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";

const formVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

function StepForm({ type, fields }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.type === "checkbox" ? [] : field.type === "number" ? "" : "",
    }), {})
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleNext = () => {
    const currentField = fields[step];
    if (currentField.required && !formData[currentField.name]) {
      setError(`${currentField.label} is required.`);
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
    const requiredFields = fields.filter((f) => f.required).map((f) => f.name);
    const missingFields = requiredFields.filter((field) => !formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0));
    if (missingFields.length > 0) {
      setError("Please fill all required fields.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("type", type.toLowerCase());
    fields.forEach((field) => {
      if (field.name === "images" && formData[field.name]) {
        formData[field.name].forEach((file) => formDataToSend.append("images", file));
      } else if (Array.isArray(formData[field.name])) {
        formDataToSend.append(field.name, JSON.stringify(formData[field.name]));
      } else if (field.name === "location" && formData[field.name]) {
        formDataToSend.append(field.name, JSON.stringify(formData[field.name]));
      } else if (field.name === "availableFrom" && formData[field.name]) {
        formDataToSend.append(field.name, formData[field.name].toISOString());
      } else if (formData[field.name]) {
        formDataToSend.append(field.name, formData[field.name]);
      }
    });

    try {
      await dispatch(createListing(formDataToSend));
      setSuccess(`${type} listing added successfully!`);
      setTimeout(() => navigate(`/listings?type=${type.toLowerCase()}`), 2000);
    } catch (error) {
      setError("Error adding listing: " + error.message);
    }
  };

  const currentField = fields[step];
  let fieldComponent;
  if (!currentField) {
    fieldComponent = <p className="text-red-500">Invalid step</p>;
  } else {
    switch (currentField.type) {
      case "text":
      case "number":
        fieldComponent = (
          <input
            type={currentField.type}
            value={formData[currentField.name] || ""}
            onChange={(e) => handleChange(currentField.name, e.target.value)}
            placeholder={currentField.placeholder}
            className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50"
            required={currentField.required}
          />
        );
        break;
      case "select":
        fieldComponent = (
          <select
            value={formData[currentField.name] || ""}
            onChange={(e) => handleChange(currentField.name, e.target.value)}
            className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50"
            required={currentField.required}
          >
            <option value="">Select</option>
            {currentField.options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
        break;
      case "checkbox":
        fieldComponent = (
          <div className="grid grid-cols-2 gap-2">
            {currentField.options.map((option) => (
              <label key={option} className="flex items-center gap-2 text-neutral-700">
                <input
                  type="checkbox"
                  value={option}
                  checked={(formData[currentField.name] || []).includes(option)}
                  onChange={(e) => {
                    const values = formData[currentField.name] || [];
                    handleChange(
                      currentField.name,
                      values.includes(option)
                        ? values.filter((v) => v !== option)
                        : [...values, option]
                    );
                  }}
                  className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-neutral-200 rounded"
                />
                {option}
              </label>
            ))}
          </div>
        );
        break;
      case "file":
        fieldComponent = (
          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.gif"
            onChange={(e) => handleChange(currentField.name, Array.from(e.target.files))}
            className="w-full p-3 border border-neutral-200 rounded-lg bg-neutral-50"
            required={currentField.required}
          />
        );
        break;
      default:
        fieldComponent = <p className="text-red-500">Invalid field type</p>;
    }
  }

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
            Add {type} Listing
          </h2>
          {error && (
            <p className="text-red-500 bg-red-50 p-2 rounded mb-4 text-center">{error}</p>
          )}
          {success && (
            <p className="text-green-500 bg-green-50 p-2 rounded mb-4 text-center">{success}</p>
          )}
          <div className="space-y-6">
            <div>
              <label className="block text-neutral-700 font-medium mb-2 flex items-center gap-2">
                {currentField?.label} {currentField?.required && "*"}
              </label>
              {fieldComponent}
            </div>
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
}

export default StepForm;