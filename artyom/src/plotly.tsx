import React, { useState, useEffect } from "react";
import Plotly from "plotly.js-dist";
import Modal from "./modal.tsx";
import "./App.css";

function Heatmap() {
  const [heatData, setHeatData] = useState([]);
  const [linksHeatData, setLinksHeatData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCellData, setSelectedCellData] = useState(null);

  useEffect(() => {
    fetch("heat.json")
      .then((response) => response.json())
      .then((data) => setHeatData(data))
      .catch((error) => console.error("Error heat.json:", error));

    fetch("linksheat.json")
      .then((response) => response.json())
      .then((links) => setLinksHeatData(links))
      .catch((error) =>
        console.error("Error linksheat.json:", error)
      );
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
        margin: { l: 150, r: 50, b: 50, t: 80 }, // Уменьшить верхнее поле (t)
        xaxis: {
          autorange: true,
          showgrid: true,
          zeroline: false,
          title: "",
          tickvals: labels,
          ticktext: labels,
          tickangle: -30,
          side: "top",
        },
        yaxis: {
          autorange: true,
          showgrid: true,
          zeroline: false,
          title: "",
          tickvals: labels,
          ticktext: labels,
        },
        scrollZoom: true,
        showlegend: false,
      });

      document
        .getElementById("heatmap-container")
        .on("plotly_click", function (data) {
          const pointIndex = data.points[0].pointIndex;
          const xValue = data.points[0].x;
          const yValue = data.points[0].y;

          setSelectedCellData({ xValue, yValue, index: pointIndex });
          setModalVisible(true);
        });
    }
  }, [heatData, linksHeatData]);

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCellData(null);
  };

  return (
    <div className="app">
      <main>
        <div
          id="heatmap-container"
          style={{ width: "100%", height: "100vh" }}
        ></div>

        {modalVisible && (
          <Modal
            isVisible={modalVisible}
            onClose={closeModal}
            selectedCell={selectedCellData}
          />
        )}
      </main>
    </div>
  );
}

export default Heatmap;
