import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Heatmap from "./plotly.tsx"; 
import ChromatinTable from "./chromatin.tsx"; 
import Cell from "./cell.tsx";

function App() {
  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route path="/K562.html" element={<Heatmap />} />{" "}
            {/* Путь к тепловой карте */}
            <Route path="/index.html" element={<ChromatinTable />} />{" "}
            <Route path="/cell.html" element={<Cell />} />{" "}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
