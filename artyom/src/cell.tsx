import React, { useState, useEffect } from "react";
import Plotly from "plotly.js-dist";
import "./App2.css";

function Cell() {
  const [heatData, setHeatData] = useState([]);
  const [linksHeatData, setLinksHeatData] = useState([]);

  useEffect(() => {
    fetch("heat.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Heatmap", data);
        setHeatData(data);
      })
      .catch((error) => {
        console.error("Heatmap error", error);
      });

    fetch("linksheat.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`error HTTP! status: ${response.status}`);
        }
        return response.json();
      })
      .then((links) => {
        console.log("success heatmap", links);
        setLinksHeatData(links);
      })
      .catch((error) => {
        console.error("error heatmap", error);
      });
  }, []);

  useEffect(() => {
    if (heatData.length > 0 && linksHeatData.length > 0) {
      const zValues = heatData.map((row) => row.values.map((val) => val.value));
      const labels = heatData.map((row) => row.name);

      const heatmapData = [
        {
          z: zValues,
          x: labels,
          y: labels,
          type: "heatmap",
          hovertemplate: "%{x} | %{y} <br> %{z}",
          text: zValues.map((row) => row.map((value) => value)),
          texttemplate: "%{text}",
          colorscale: [
            [0, "#e6f7ff"],
            [1, "#003366"],
          ],
          showscale: true,
        },
      ];

      Plotly.newPlot("heatmap-container", heatmapData, {
        margin: { l: 150, r: 50, b: 50, t: 30 },
        xaxis: {
          autorange: true,
          showgrid: true,
          zeroline: false,
          title: " X",
        },
        yaxis: {
          autorange: true,
          showgrid: true,
          zeroline: false,
          title: " Y",
        },
        scrollZoom: true,
        showlegend: false,
      });
    } else if (heatData.length === 0) {
      console.warn("null");
    } else if (linksHeatData.length === 0) {
      console.warn("null");
    }
  }, [heatData, linksHeatData]);

  return (
    <div className="app">
      <main>
        <div
          id="heatmap-container"
          style={{ width: "100%", height: "100vh", position: "relative" }}
        ></div>

        <div className="overlay"></div>
      </main>
    </div>
  );
}

export default Cell;
