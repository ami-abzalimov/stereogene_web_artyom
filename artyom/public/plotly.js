import React, { useState, useEffect } from "react";
import Plotly from "plotly.js-dist";

function Heatmap() {
  const [heatData, setHeatData] = useState([]);
  const [linksHeatData, setLinksHeatData] = useState([]);

  useEffect(() => {
    // Загрузка данных из heat.json
    fetch("heat.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Данные тепловой карты загружены успешно:", data);
        setHeatData(data);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке данных тепловой карты:", error);
      });

    // Загрузка ссылок из linksheat.json
    fetch("linksheat.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
        }
        return response.json();
      })
      .then((links) => {
        console.log("Данные ссылок тепловой карты загружены успешно:", links);
        setLinksHeatData(links);
      })
      .catch((error) => {
        console.error(
          "Ошибка при загрузке данных ссылок тепловой карты:",
          error
        );
      });
  }, []);

  useEffect(() => {
    if (heatData.length > 0 && linksHeatData.length > 0) {
      const zValues = heatData.map((row) => row.values.map((val) => val.value));
      const xLabels = heatData.map((_, index) => `X${index + 1}`);
      const yLabels = heatData[0].values.map((_, index) => `Y${index + 1}`);

      const heatmapData = [
        {
          z: zValues,
          x: xLabels,
          y: yLabels,
          type: "heatmap",
          hovertemplate: "%{x} | %{y} <br> %{z}",
          hoverinfo: "x+y+z",
          text: linksHeatData.map((row, i) =>
            row.map((link, j) =>
              link
                ? `<a href="${link}" style="color:black;">${zValues[i][j]}</a>`
                : zValues[i][j]
            )
          ),
          texttemplate: "%{text}",
          colorscale: "Viridis",
          showscale: true,
        },
      ];

      Plotly.newPlot("heatmap-container", heatmapData, {
        margin: { l: 150, r: 50, b: 50, t: 30 },
        xaxis: {
          autorange: true,
          showgrid: true,
          zeroline: false,
          title: "Ось X",
        },
        yaxis: {
          autorange: true,
          showgrid: true,
          zeroline: false,
          title: "Ось Y",
        },
        scrollZoom: true,
        showlegend: false,
      });
    } else if (heatData.length === 0) {
      console.warn(
        "Данные тепловой карты пусты. Пожалуйста, проверьте источник данных."
      );
    } else if (linksHeatData.length === 0) {
      console.warn(
        "Данные ссылок тепловой карты пусты. Пожалуйста, проверьте источник данных."
      );
    }
  }, [heatData, linksHeatData]);

  return (
    <div className="app">
      <div id="navigation"></div>
      <main>
        <div
          id="heatmap-container"
          style={{ width: "100%", height: "100vh" }}
        ></div>
      </main>
    </div>
  );
}

export default Heatmap;
