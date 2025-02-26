import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./App.css";

const container = document.getElementById("root");

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
} else {
  console.error("Target container for App is not a DOM element");
}
