import React, { useState, useEffect } from "react";
import Plotly from "plotly.js-dist";
import "./App2.css"; // Подключаем стили

function Cell() {
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
      const zValues = heatData.map((row) => row.values.map((val) => val.value)); // Извлечение значений для оси Z
      const labels = heatData.map((row) => row.name); // Метки для оси X и Y

      const heatmapData = [
        {
          z: zValues,
          x: labels, // Используем одни и те же метки для оси X
          y: labels, // Используем одни и те же метки для оси Y
          type: "heatmap",
          hovertemplate: "%{x} | %{y} <br> %{z}",
          text: zValues.map((row) => row.map((value) => value)), // Значения для отображения в ячейках
          texttemplate: "%{text}", // Формат текста в ячейках
          colorscale: [
            [0, "#e6f7ff"], // Светло-синий
            [1, "#003366"], // Темно-синий
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
      <main>
        <div
          id="heatmap-container"
          style={{ width: "100%", height: "100vh", position: "relative" }}
        ></div>

        {/* Прямоугольник с закругленными краями и серым фоном */}
        <div className="overlay"></div>
      </main>
    </div>
  );
}

export default Cell;