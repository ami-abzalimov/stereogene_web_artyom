import React, { useState, useEffect, useRef } from "react";
import Plotly from "plotly.js-dist";
import styled from "styled-components";

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 70%;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  border: 1px solid #34495e; /* Thin, dirty dark blue border */
`;

const CloseButton = styled.span`
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 24px;
  color: black;
  opacity: 0.7;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;

const ModalTitle = styled.h2`
  color: black;
  text-align: center;
  padding: 10px 0;
  margin: 0;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;

const GraphContainer = styled.div`
  width: 50%;
  padding: 10px;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
`;

const PlotContainer = styled.div`
  flex: 1;
`;

const SubModeButtons = styled.div`
  display: flex;
  justify-content: center;
  padding: 5px;
`;

const SidebarContainer = styled.div`
  width: 50%;
  padding: 10px;
  box-sizing: border-box;
  color: black;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
`;

const TableContainer = styled.div`
  height: 100%;
  overflow-y: auto;
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  background-color: white;
  color: black;
  padding: 8px;
  border-bottom: 1px solid #ddd;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 8px;
  border-bottom: 1px solid #ddd;
  text-align: left;
`;

const ModeButtons = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
`;

const ModeButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${(props) => (props.active ? "#3498db" : "#f2f2f2")};
  color: ${(props) => (props.active ? "white" : "black")};

  &:hover {
    background-color: #2980b9;
    color: white;
  }
`;

const SubModeButton = styled.button`
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  background-color: ${(props) => (props.active ? "#3498db" : "#f2f2f2")};
  color: ${(props) => (props.active ? "white" : "black")};
  margin: 0 5px;

  &:hover {
    background-color: #2980b9;
    color: white;
  }
`;

const Modal = ({
  isVisible,
  onClose,
  selectedCell,
  fgData,
  distData,
  autoData,
  chromData,
  LChistData,
}) => {
  const [activeMode, setActiveMode] = useState("raw data");
  const [activeSubMode, setActiveSubMode] = useState(
    "distributionOfCorrelations"
  ); // Default sub-mode
  const plotRef = useRef(null);

  useEffect(() => {
    let data = [];
    let layout = {};
    let config = { responsive: true };

    switch (activeSubMode) {
      case "distributionOfCorrelations":
        data = [
          {
            x: [
              -1.0, -0.5, -0.2, -0.1, -0.05, -0.01, -0.005, -0.001, 0, 0.001,
              0.005, 0.01, 0.05, 0.1, 0.2, 0.5, 1.0,
            ],
            y: [
              0.1, 0.3, 0.5, 1.2, 2.4, 3.8, 4.3, 4.5, 4.6, 4.5, 4.3, 3.8, 2.4,
              1.2, 0.5, 0.3, 0.1,
            ],
            type: "scatter",
            mode: "lines",
            name: "Foreground",
            line: { color: "blue", shape: "spline", smoothing: 1.3 },
          },
          {
            x: [
              -1.0, -0.5, -0.2, -0.1, -0.05, -0.01, -0.005, -0.001, 0, 0.001,
              0.005, 0.01, 0.05, 0.1, 0.2, 0.5, 1.0,
            ],
            y: [
              0.3, 1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.4, 0.5, 0.6, 0.7,
              0.8, 0.9, 1, 0.3,
            ],
            type: "scatter",
            mode: "lines",
            name: "Background",
            line: { color: "red", shape: "spline", smoothing: 1.3 },
          },
        ];

        layout = {
          title: "Distribution of correlations",
          xaxis: {
            title: "correlation coefficient",
          },
          yaxis: { title: "density" },
        };
        break;
      case "crossCorrelation":
        // Cross-correlation function
        data = [
          {
            x: [-10, -5, 0, 5, 10],
            y: [0.0, 0.5, 2.5, 0.5, 0.0],
            type: "scatter",
            mode: "lines",
            name: "Foreground",
            line: { color: "blue", shape: "spline", smoothing: 1.3 },
          },
          {
            x: [-10, -5, 0, 5, 10],
            y: [0.0, 0.3, 1.5, 0.3, 0.0],
            type: "scatter",
            mode: "lines",
            name: "Background",
            line: { color: "red", shape: "spline", smoothing: 1.3 },
          },
        ];

        layout = {
          title: "Cross-correlation function",
          xaxis: { title: "Distance (kb)" },
          yaxis: { title: "density*100" },
        };
        break;
      case "autocorrelation":
        // Autocorrelation
        data = [
          {
            x: [-10, -5, 0, 5, 10],
            y: [0.6, 0.8, 1.0, 0.8, 0.6],
            type: "scatter",
            mode: "lines",
            name: "filtH3K27me3rep2copycopy",
            line: { color: "orange", shape: "spline", smoothing: 1.3 },
          },
          {
            x: [-10, -5, 0, 5, 10],
            y: [-0.4, -0.2, 0.0, 0.2, 0.4],
            type: "scatter",
            mode: "lines",
            name: "filtH3K4me3rep2copycopy",
            line: { color: "purple", shape: "spline", smoothing: 1.3 },
          },
        ];
        layout = {
          title: "Autocorrelation",
          xaxis: { title: "distance (kb)" },
          yaxis: { title: "autocorr" },
        };
        break;
      case "chrom":
        data = [
          {
            x: [
              "chr1",
              "chr2",
              "chr3",
              "chr4",
              "chr5",
              "chr6",
              "chr7",
              "chrX",
              "chr8",
              "chr9",
              "chr11",
              "chr10",
              "chr12",
              "chr13",
              "chr14",
              "chr15",
              "chr16",
              "chr17",
              "chr18",
              "chr20",
              "chr19",
              "chrY",
              "chr22",
              "chr21",
            ],
            y: [
              -0.4, -0.2, 0.0, 0.2, 0.4, 0.6, 0.8, 1.0, -0.4, -0.2, 0.0, 0.2,
              0.4, 0.6, 0.8, 1.0, -0.4, -0.2, 0.0, 0.2, 0.4, 0.6, 0.8, 1.0,
            ],
            type: "bar",
            marker: { color: "teal" }, // You can change the color as needed
          },
        ];

        layout = {
          title: "Chrom",
          xaxis: {
            title: "Chromosome",
            categoryorder: "array",
            categoryarray: [
              "chr1",
              "chr2",
              "chr3",
              "chr4",
              "chr5",
              "chr6",
              "chr7",
              "chrX",
              "chr8",
              "chr9",
              "chr11",
              "chr10",
              "chr12",
              "chr13",
              "chr14",
              "chr15",
              "chr16",
              "chr17",
              "chr18",
              "chr20",
              "chr19",
              "chrY",
              "chr22",
              "chr21",
            ],
          },
          yaxis: { title: "Value" },
        };
        break;
      default:
        data = [
          {
            x: [1, 2, 3],
            y: [1, 2, 3],
            type: "scatter",
            mode: "lines+markers",
          },
        ];
        layout = { title: "Default Plot" };
        break;
    }

    Plotly.newPlot(plotRef.current, data, layout, config);
  }, [activeMode, activeSubMode]);

  const tableData = [
    { label: "Status", value: "released" },
    { label: "Assay", value: "ChIP-seq (Histone ChIP-seq)" },
    { label: "Target", value: "H3K4me3&H3K4ac" },
    { label: "Biosample summary", value: "Homo sapiens SK-N-SH" },
    { label: "Platform", value: "Illumina HiSeq 2500" },
    { label: "Controls", value: "ENCSR185OHN" },
    { label: "Attribution", value: "ENCODE3 project" },
    { label: "Lab", value: "Bradley Bernstein, Broad" },
  ];

  if (!isVisible || !selectedCell) return null;

  return (
    <ModalContainer>
      <CloseButton onClick={onClose}>&times;</CloseButton>
      <ModalTitle>
        {selectedCell.xValue} & {selectedCell.yValue}
      </ModalTitle>

      <ContentContainer>
        <RowContainer>
          <GraphContainer>
            {/* SubMode Buttons */}
            <SubModeButtons>
              <SubModeButton
                active={activeSubMode === "distributionOfCorrelations"}
                onClick={() => setActiveSubMode("distributionOfCorrelations")}
              >
                Distribution
              </SubModeButton>
              <SubModeButton
                active={activeSubMode === "crossCorrelation"}
                onClick={() => setActiveSubMode("crossCorrelation")}
              >
                Cross-Correlation
              </SubModeButton>
              <SubModeButton
                active={activeSubMode === "autocorrelation"}
                onClick={() => setActiveSubMode("autocorrelation")}
              >
                Autocorrelation
              </SubModeButton>
              <SubModeButton
                active={activeSubMode === "chrom"}
                onClick={() => setActiveSubMode("chrom")}
              >
                Chrom
              </SubModeButton>
            </SubModeButtons>
            <PlotContainer>
              <div
                id="graph-container"
                style={{ width: "100%", height: "100%" }}
                ref={plotRef}
              />
            </PlotContainer>
          </GraphContainer>
          <SidebarContainer>
            <TableContainer>
              <DataTable>
                <tbody>
                  {tableData.map((item, index) => (
                    <tr key={index}>
                      <TableHeader>{item.label}</TableHeader>
                      <TableCell>{item.value}</TableCell>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </TableContainer>
          </SidebarContainer>
        </RowContainer>

        <ModeButtons>
          {["raw data", "norm data", "peaks", "idr"].map((mode) => (
            <ModeButton
              key={mode}
              onClick={() => setActiveMode(mode)}
              active={activeMode === mode}
            >
              {mode}
            </ModeButton>
          ))}
        </ModeButtons>
      </ContentContainer>
    </ModalContainer>
  );
};

export default Modal;
