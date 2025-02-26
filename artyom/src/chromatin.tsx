import React, { useState, useEffect } from "react";
import "./App.css"; 

function ChromatinTable() {
  const [tableData, setTableData] = useState([]);
  const [linksData, setLinksData] = useState([]);
  const [activeColumnIndex, setActiveColumnIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("data.json");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        console.log("Data loaded successfully:", data);
        setTableData(data);

        const linksResponse = await fetch("links.json");
        if (!linksResponse.ok) throw new Error("Network response was not ok");
        const links = await linksResponse.json();
        console.log("Links loaded successfully:", links); 
        setLinksData(links);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
  }, []);

  if (!tableData.length || !linksData.length) {
    return <div>Download Table data...</div>;
  }

  const handleColumnToggle = (index) => {
    console.log("Column toggle:", index); 
    setActiveColumnIndex(activeColumnIndex === index ? null : index);
  };

  const handleRowDelete = (rowIndex) => {
    console.log("Row delete:", rowIndex); 
    const updatedTableData = tableData.filter((_, index) => index !== rowIndex);
    setTableData(updatedTableData);
  };

  const handleColumnDelete = (colIndex) => {
    console.log("Column delete:", colIndex); 
    const updatedTableData = tableData.map((row) => {
      const updatedValues = row.values.filter((_, index) => index !== colIndex);
      return { ...row, values: updatedValues };
    });
    setTableData(updatedTableData);
  };

  console.log("tableData:", tableData); 
  console.log("linksData:", linksData); 
  console.log("activeColumnIndex:", activeColumnIndex);

  return (
    <main className="chromatin-table-main">
      <div className="container">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr className="table-header-row">
                <th className="table-header-cell sticky-left"></th>
                {tableData[0]?.values.map((col, index) => (
                  <th key={index}>
                    <div className="column-header-buttons">
                      <button
                        className="column-toggle-button"
                        onClick={() => handleColumnToggle(index)}
                      >
                        {activeColumnIndex === index ? "-" : "+"}
                      </button>
                      <button
                        className="column-delete-button"
                        onClick={() => handleColumnDelete(index)}
                      >
                        &times;
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
              <tr className="table-header-row">
                <th className="table-header-cell sticky-left">
                  Chromatin Matrix
                </th>
                {tableData[0]?.values.map((col, index) =>
                  activeColumnIndex === null || activeColumnIndex === index ? (
                    <th key={index} className="table-header-cell">
                      {col}
                    </th>
                  ) : null
                )}
              </tr>
            </thead>
            <tbody>
              {tableData.slice(1).map((row, rowIndex) => {
                console.log("Row data:", row);
                return (
                  <tr key={rowIndex}>
                    <td className="table-cell sticky-left">{row.name}</td>
                    {row.values.map((value, cellIndex) => {
                      console.log("Cell data:", { rowIndex, cellIndex, value });
                      const link = linksData[rowIndex + 1]?.links[cellIndex];

                      return (
                        (activeColumnIndex === null ||
                          activeColumnIndex === cellIndex) && (
                          <td key={cellIndex} className="table-cell">
                            {link ? (
                              <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="table-link"
                              >
                                {value}
                              </a>
                            ) : (
                              value
                            )}
                          </td>
                        )
                      );
                    })}
                    <td>
                      <button onClick={() => handleRowDelete(rowIndex)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {activeColumnIndex !== null && (
            <div className="transposed-headers">
              <h4>Transposed-headers:</h4>
              <table className="table">
                <thead>
                  <tr className="table-header-row">
                    <th>Название</th>
                    {tableData[0]?.values.map((col, index) =>
                      activeColumnIndex === index ? (
                        <th key={index}>{col}</th>
                      ) : null
                    )}
                  </tr>
                </thead>
                <tbody>
                  {tableData.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td>{row.name}</td>
                      {row.values.map((value, cellIndex) =>
                        activeColumnIndex === cellIndex ? (
                          <td key={cellIndex}>{value}</td>
                        ) : null
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default ChromatinTable;
