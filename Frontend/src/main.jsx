// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"; // Must be present
import "leaflet/dist/leaflet.css";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

const root = createRoot(document.getElementById("root"));
root.render(<App />);