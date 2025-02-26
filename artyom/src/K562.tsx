import React from "react";
import ReactDOM from "react-dom/client";
import Plotly from "plotly.js-dist"; 
import ChromatinTable from "./chromatin";
import Heatmap from "./plotly.tsx"; 

const container = document.getElementById("Heatmap");

if (container) {
  const root = ReactDOM.createRoot(container); 
  root.render(<Heatmap />); 
} else {
  console.error("Target container2 for Heatmap is not a DOM element");
}
