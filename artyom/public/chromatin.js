import React, { useState, useEffect } from "react";
import "./App.css";

function ChromatinTable() {
  const [tableData, setTableData] = useState([]);
  const [linksData, setLinksData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("data.json");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setTableData(data);

        const linksResponse = await fetch("links.json");
        if (!linksResponse.ok) throw new Error("Network response was not ok");
        const links = await linksResponse.json();
        setLinksData(links);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
  }, []);

  if (!tableData.length || !linksData.length) {
    return <div>Загрузка данных...</div>; // Индикатор загрузки
  }

  const handleRowSwap = (index1, index2) => {
    const newRows = [...tableData];
    [newRows[index1], newRows[index2]] = [newRows[index2], newRows[index1]];
    setTableData(newRows);
  };

  const handleColumnSwap = (index1, index2) => {
    const newColumns = [...tableData];
    for (let row of newColumns) {
      [row.values[index1], row.values[index2]] = [
        row.values[index2],
        row.values[index1],
      ];
    }
    setTableData(newColumns);
  };

  const handleRowDelete = (index) => {
    const newRows = tableData.filter((_, i) => i !== index);
    setTableData(newRows);
  };

  const handleColumnDelete = (index) => {
    const newColumns = tableData.map((row) => ({
      ...row,
      values: row.values.filter((_, i) => i !== index),
    }));
    setTableData(newColumns);
  };

  return (
    <main>
      <div className="container">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr style={{ backgroundColor: "#003366", color: "#FFFFFF" }}>
                <th style={{ position: "sticky", left: 0 }}>
                  Chromatin Matrix
                </th>
                {tableData[0] &&
                  tableData[0].values.slice(0, -1).map((col, index) => (
                    <th
                      key={index}
                      onClick={() =>
                        handleColumnSwap(
                          index,
                          (index + 1) % (tableData[0].values.length - 1)
                        )
                      }
                    >
                      {col}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody id="data-body">
              {tableData.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td
                    style={{
                      backgroundColor: "#003366",
                      color: "#FFFFFF",
                      position: "sticky",
                      left: 0,
                    }}
                  >
                    {row.name}
                  </td>
                  {row.values.slice(0, -1).map((value, cellIndex) => (
                    <td key={cellIndex}>
                      {linksData[rowIndex + 1] &&
                      linksData[rowIndex + 1].links[cellIndex] ? (
                        <a
                          href={linksData[rowIndex + 1].links[cellIndex]}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: "none", color: "black" }}
                        >
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </td>
                  ))}
                  <td>
                    <button onClick={() => handleRowDelete(rowIndex)}>
                      Удалить строку
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default ChromatinTable;
