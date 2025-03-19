// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"; // Must be present

const root = createRoot(document.getElementById("root"));
root.render(<App />);