import React, { useState, useEffect, useRef } from "react";
import { Sun, Moon, Mic, Send, ArrowLeft } from "lucide-react";
import smallLogo from "../../../images/smallLogo.png";
import { getRandomPrompts, getMappedResponse } from "./hrmAIDataHelpers";

// --- 1. HELPER COMPONENTS (The Renderers) ---

// Helper to format specialized chart type names for display
const formatChartType = (t) => {
  if (!t) return "Data";
  const specialTypes = {
    gantt: "Gantt Chart",
    waterfall: "Waterfall Chart",
    heatmap: "Heatmap",
    treemap: "Treemap",
    funnel: "Funnel Chart",
    boxplot: "Box Plot",
    stackedbar: "Stacked Bar Chart",
    table: "Data Table",
    chart: "Standard Chart",
    text: "Formatted Text Report",
  };
  return specialTypes[t] || t.charAt(0).toUpperCase() + t.slice(1);
};

// --- TEXT RENDERER (Correctly formats rich text response) ---
const TextRenderer = ({ text, theme }) => {
  const renderContent = (content) => {
    const parts = content.split("\n").map((line, index) => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith("###")) {
        return (
          <h3
            key={index}
            style={{
              margin: "15px 0 8px 0",
              fontSize: "1.1em",
              fontWeight : "600",
              color: theme === "light" ? "#333" : "#fff",
            }}
          >
            {trimmedLine.replace("###", "").trim()}
          </h3>
        );
      }
      if (trimmedLine.startsWith("####")) {
        return (
          <h4
            key={index}
            style={{
              margin: "10px 0 5px 0",
              fontSize: "1.0em",
              color: theme === "light" ? "#007bff" : "#8ab4f8",
            }}
          >
            {trimmedLine.replace("####", "").trim()}
          </h4>
        );
      }
      if (trimmedLine.startsWith("*")) {
        return (
          <li
            key={index}
            style={{
              marginLeft: "20px",
              fontSize: "0.8em",
              fontWeight: "500", 
              listStyleType: "disc",
            }}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: trimmedLine
                  .replace("*", "")
                  .trim()
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
              }}
            />
          </li>
        );
      }
      if (trimmedLine.startsWith("---")) {
        return (
          <hr
            key={index}
            style={{
              margin: "10px 0",
              borderTop: `1px solid ${theme === "light" ? "#ddd" : "#333"}`,
            }}
          />
        );
      }

      let formattedLine = trimmedLine.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
      );
      return (
        <p
          key={index}
          style={{ margin: "5px 0", fontSize: "0.8em", fontWeight: "500" }}
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    });
    return <div style={{ padding: "5px 0" }}>{parts}</div>;
  };
  return <div style={{ padding: "10px 0" }}>{renderContent(text)}</div>;
};

// --- BASE RENDERER FOR TABLE (AND RAW DATA FALLBACK) ---
const DataTableRenderer = ({ data, title, description, theme, type }) => {
  const isLight = theme === "light";

  return (
    <div
      style={{
        marginTop: "10px",
        padding: "15px",
      }}
    >
      <h4
        style={{
          margin: "0 0 5px 0",
          fontSize: "1.1em",
          fontWeight: 600,
          color: isLight ? "#333" : "#fff",
        }}
      >
        {title}
      </h4>
      <p style={{ margin: "0 0 10px 0", fontSize: "0.85em", opacity: 0.7 , fontWeight: 500}}>
        {description}
      </p>
      {type !== "table" && type !== "text" && (
        <p
          style={{
            margin: "0 0 10px 0",
            fontSize: "0.8em",
            color: isLight ? "#888" : "#aaa",
            fontWeight: "bold",
          }}
        >
          Data Structured For: {formatChartType(type)} (Showing Raw Data)
        </p>
      )}
      <table
       className="square-table"
      >
        <thead>
          <tr style={{ backgroundColor: isLight ? "#e9ecef" : "#2a2a2a" }}>
            {data.headers.map((header, i) => (
              <th
                key={i}
                style={{
                  padding: "8px",
                  border: `1px solid ${isLight ? "#ddd" : "#555"}`,
                  textAlign: "left",
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr
              key={i}
              style={{ borderBottom: `1px solid ${isLight ? "#eee" : "#333"}` }}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    padding: "8px",
                    border: `1px solid ${isLight ? "#ddd" : "#555"}`,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- STANDARD CHART RENDERER (BAR, LINE, PIE) ---
const DataChartRenderer = ({ data, title, description, theme }) => {
  const { chartType, data: chartData } = data;
  const isLight = theme === "light";
  const colors = [
    "#007bff",
    "#28a745",
    "#ffc107",
    "#dc3545",
    "#6f42c1",
    "#17a2b8",
  ];

  const renderBarChart = () => {
    const maxValue = Math.max(...chartData.map((d) => d.value));
    return (
      <div style={{ padding: "10px 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            height: "150px",
            gap: "20px",
            paddingBottom: "5px",
            borderBottom: `1px solid ${isLight ? "#333" : "#fff"}`,
          }}
        >
          {chartData.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "30px",
                position : "relative"
              }}
            >
              <div
                style={{
                  height: `${(item.value / maxValue) * 100}px`,
                  width: "25px",
                  backgroundColor: colors[i % colors.length],
                  transition: "height 0.5s ease",
                  borderRadius: "3px 3px 0 0",
                }}
                title={`${item.label}: ${item.value}`}
              />
              <span
                style={{
                  fontSize: "0.70em",
                  marginTop: "4px",
                  textAlign: "center",
                  position : "absolute",
                  bottom: -40
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <p
          style={{
            margin: "35px 0 0 0",
            fontSize: "0.75em",
            textAlign: "right",
            opacity: 0.9,
          }}
        >
          Value Scale: 0 to {maxValue}
        </p>
      </div>
    );
  };

  const renderLineChart = () => {
    const maxValue = Math.max(...chartData.map((d) => d.value));
    const normalizedPoints = chartData.map((item) => ({
      ...item,
      normalizedY: 150 - (item.value / maxValue) * 150,
    }));
    const pathData = normalizedPoints
      .map((p, i) => {
        const x = (i / (normalizedPoints.length - 1)) * 100;
        const y = (p.normalizedY / 150) * 100;
        return `${i === 0 ? "M" : "L"} ${x}% ${y}%`;
      })
      .join(" ");

    return (
      <div style={{ padding: "10px 0", position: "relative" }}>
        <svg
          viewBox="0 0 100 150"
          height="150px"
          width="100%"
          style={{ overflow: "visible" }}
        >
          <line
            x1="0"
            y1="150"
            x2="100"
            y2="150"
            stroke={isLight ? "#ccc" : "#444"}
            strokeWidth="0.5"
          />
          <path
            d={pathData}
            fill="none"
            stroke="#007bff"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {normalizedPoints.map((p, i) => (
            <circle
              key={i}
              cx={`${(i / (normalizedPoints.length - 1)) * 100}%`}
              cy={`${(p.normalizedY / 150) * 100}%`}
              r="2"
              fill="#007bff"
              title={`${p.label}: ${p.value}`}
            />
          ))}
        </svg>
      </div>
    );
  };

  const renderPieChart = () => {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    let startAngle = 0;
    const getPath = (value, total, color, index) => {
      const ratio = value / total;
      const angle = ratio * 360;
      const endAngle = startAngle + angle;
      const toCoord = (a) => {
        const rad = (a * Math.PI) / 180;
        return [Math.cos(rad) * 50 + 50, Math.sin(rad) * 50 + 50];
      };
      const [startX, startY] = toCoord(startAngle);
      const [endX, endY] = toCoord(endAngle);
      const largeArcFlag = angle > 180 ? 1 : 0;
      const path = [
        `M 50 50`,
        `L ${startX} ${startY}`,
        `A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        `Z`,
      ].join(" ");
      startAngle = endAngle;
      return (
        <path
          key={index}
          d={path}
          fill={color}
          title={`${chartData[index].label}: ${value}`}
        />
      );
    };

    return (
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "20px",
          padding: "10px 0",
        }}
      >
        <svg viewBox="0 0 100 100" width="200px" height="200px">
          {chartData.map((item, i) =>
            getPath(item.value, total, colors[i % colors.length], i)
          )}
        </svg>
        <div
          style={{
            fontSize: "0.85em",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          {chartData.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: colors[i % colors.length],
                  marginRight: "5px",
                  borderRadius: "2px",
                }}
              ></div>
              <span>
                {item.label} ({Math.round((item.value / total) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return renderBarChart();
      case "line":
        return renderLineChart();
      case "pie":
        return renderPieChart();
      default:
        return (
          <div style={{ color: "red" }}>
            Error: Unsupported standard chart type "{chartType}".
          </div>
        );
    }
  };

  return (
    <div
      style={{
        marginTop: "10px",
        padding: "15px"
      }}
    >
      <h4
        style={{
          margin: "0 0 5px 0",
          fontSize: "1.2em",
          color: isLight ? "#333" : "#fff",
          fontWeight: "600"
        }}
      >
        {title}
      </h4>
      <p style={{ margin: "0 0 10px 0", fontSize: "0.85em", opacity: 0.7, fontWeight: "500" }}>
        {description}
      </p>
      {renderChart()}
    </div>
  );
};

// --- GANTT CHART RENDERER (Visual Mockup) ---
const GanttChartRenderer = ({ data, title, description, theme }) => {
  const isLight = theme === "light";
  const tasks = data.rows.map((row) => ({
    id: row[0],
    name: row[1],
    duration: parseInt(row[4]),
    start: row[3],
  }));
  const maxDuration = Math.max(...tasks.map((t) => t.duration));

  return (
    <div
      style={{
        marginTop: "10px",
        padding: "15px",
        
      }}
    >
      <h4
        style={{
          margin: "0 0 5px 0",
          fontSize: "1.2em",
          color: isLight ? "#333" : "#fff",
          fontWeight: 600
        }}
      >
        {title}
      </h4>
      <p style={{ margin: "0 0 10px 0", fontSize: "0.85em", opacity: 0.7, fontWeight: "500" }}>
        {description}
      </p>
      <div style={{ padding: "10px 0", overflowX: "auto" }}>
        <h5 style={{ fontSize: "0.9em", color: "var(--primmary-color)" }}>
          {formatChartType("gantt")} Visualizer:
        </h5>
        {tasks.map((task, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
              minWidth: "400px",
            }}
          >
            <span style={{ width: "120px", fontSize: "0.8em", flexShrink: 0 }}>
              {task.name}
            </span>
            <div
              style={{
                backgroundColor: "var(--primmary-color)",
                color: "white",
                padding: "4px 8px",
                borderRadius: "3px",
                fontSize: "0.8em",
                width: `${(task.duration / maxDuration) * 60}%`,
                minWidth: "20px",
                marginLeft: "10px",
              }}
            >
              {task.duration} Days
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- WATERFALL CHART RENDERER (Visual Mockup) ---
const WaterfallChartRenderer = ({ data, title, description, theme }) => {
  const isLight = theme === "light";
  const rows = data.rows;
  const maxChange = Math.max(
    ...rows.map((row) => Math.abs(parseInt(row[3]) || 0))
  );
  const scale = 150 / maxChange;

  return (
    <div
      style={{
        marginTop: "10px",
        padding: "15px",
        border: `1px solid ${isLight ? "#ccc" : "#444"}`,
        borderRadius: "8px",
        backgroundColor: isLight ? "#f5f5f5" : "#1f1f1f",
      }}
    >
      <h4
        style={{
          margin: "0 0 5px 0",
          fontSize: "1.1em",
          color: isLight ? "#333" : "#fff",
        }}
      >
        {title}
      </h4>
      <p style={{ margin: "0 0 10px 0", fontSize: "0.85em", opacity: 0.7 }}>
        {description}
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "10px 0",
        }}
      >
        <h5 style={{ fontSize: "0.9em", color: "#28a745" }}>
          {formatChartType("waterfall")} Visualizer:
        </h5>
        {rows.map((row, i) => {
          const isTotal = row[0].includes("Headcount");
          const change = parseInt(row[3]);
          const barWidth = isTotal ? 150 : Math.abs(change) * scale;
          const barColor = isTotal
            ? "#6c757d"
            : change > 0
            ? "#28a745"
            : "#dc3545";

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "0.8em",
              }}
            >
              <span
                style={{
                  width: "150px",
                  flexShrink: 0,
                  fontWeight: isTotal ? "bold" : "normal",
                }}
              >
                {row[0]}
              </span>
              <div
                style={{
                  height: "15px",
                  width: `${barWidth}px`,
                  backgroundColor: barColor,
                  borderRadius: "2px",
                  marginRight: "10px",
                  opacity: 0.8,
                }}
              ></div>
              <span style={{ color: barColor }}>
                {isTotal ? row[4] : row[3]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- HEATMAP CHART RENDERER (Visual Mockup) ---
const HeatmapRenderer = ({ data, title, description, theme }) => {
  const isLight = theme === "light";
  const headers = data.headers.slice(1);
  const rows = data.rows;

  const allValues = rows.flatMap((row) =>
    row.slice(1).map((val) => parseInt(val))
  );
  const maxValue = Math.max(...allValues);

  const getColorIntensity = (value) => {
    const intensity = value / maxValue;
    const color = isLight
      ? `rgba(220, 53, 69, ${intensity})`
      : `rgba(255, 193, 7, ${intensity})`;
    return color;
  };

  return (
    <div
      style={{
        marginTop: "10px",
        padding: "15px",
        
      }}
    >
      <h4
        style={{
          margin: "0 0 5px 0",
          fontSize: "1.2em",
          color: isLight ? "#333" : "#fff",
          fontWeight: 600,
        }}
      >
        {title}
      </h4>
      <p style={{ margin: "0 0 10px 0", fontSize: "0.85em", opacity: 0.7 , fontWeight: 600}}>
        {description}
      </p>

      <div style={{ padding: "10px 0", fontSize: "0.85em" }}>
        <h5 style={{ fontSize: "0.9em", color: "#ffc107" }}>
          {formatChartType("heatmap")} Visualizer:
        </h5>
        <div
          style={{
            display: "flex",
            borderBottom: `1px solid ${isLight ? "#ddd" : "#555"}`,
          }}
        >
          <span style={{ width: "140px", padding: "5px" }}>Department</span>
          {headers.map((day, i) => (
            <span
              key={i}
              style={{
                width: "60px",
                padding: "5px",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {day.split(" ")[0]}
            </span>
          ))}
        </div>

        {rows.map((row, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              borderBottom:
                i < rows.length - 1
                  ? `1px dashed ${isLight ? "#eee" : "#333"}`
                  : "none",
            }}
          >
            <span style={{ width: "140px", padding: "5px", fontWeight: "500" }}>
              {row[0]}
            </span>
            {row.slice(1).map((value, j) => (
              <div
                key={j}
                style={{
                  width: "60px",
                  height: "30px",
                  backgroundColor: getColorIntensity(parseInt(value)),
                  padding: "5px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color:
                    parseInt(value) > maxValue * 0.7
                      ? isLight
                        ? "white"
                        : "black"
                      : "inherit",
                }}
              >
                {value}
              </div>
            ))}
          </div>
        ))}
        <p style={{ fontSize: "0.7em", marginTop: "10px", opacity: 0.6 }}>
          Color intensity based on employee count on leave (Max: {maxValue}).
        </p>
      </div>
    </div>
  );
};

// --- TREEMAP CHART RENDERER (Visual Mockup) ---
const TreemapRenderer = ({ data, title, description, theme }) => {
  const isLight = theme === "light";
  const totalBudget = data.rows.reduce(
    (sum, row) => sum + parseFloat(row[2]),
    0
  );
  // Use smaller scaling factors to prevent overflow/overlap

  return (
    <div
      style={{
        marginTop: "10px",
        padding: "15px",
        border: `1px solid ${isLight ? "#ccc" : "#444"}`,
        borderRadius: "8px",
        backgroundColor: isLight ? "#f5f5f5" : "#1f1f1f",
      }}
    >
      <h4
        style={{
          margin: "0 0 5px 0",
          fontSize: "1.1em",
          color: isLight ? "#333" : "#fff",
        }}
      >
        {title}
      </h4>
      <p style={{ margin: "0 0 10px 0", fontSize: "0.85em", opacity: 0.7 }}>
        {description}
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
          height: "250px",
          border: `1px solid ${isLight ? "#ddd" : "#555"}`,
          overflow: "hidden",
        }}
      >
        <h5
          style={{
            fontSize: "0.9em",
            color: "#6f42c1",
            width: "100%",
            padding: "5px 5px 0 5px",
          }}
        >
          {formatChartType("treemap")} Visualizer (Total: ${totalBudget}M):
        </h5>
        {data.rows.map((row, i) => {
          const value = parseFloat(row[2]);
          const percentage = (value / totalBudget) * 100;
          const groupColor = [
            "#1f78b4",
            "#33a02c",
            "#e31a1c",
            "#ff7f00",
            "#6a3d9a",
            "#b15928",
          ][i % 6];

          return (
            <div
              key={i}
              style={{
                height: `${Math.max(percentage * 1.5, 25)}px`, // Reduced scaling factor
                width: `${Math.max(percentage * 1.1, 25)}px`, // Reduced scaling factor
                backgroundColor: groupColor,
                border: `1px solid ${isLight ? "white" : "black"}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: "0.7em",
                opacity: 0.9,
                cursor: "pointer",
                overflow: "hidden",
              }}
              title={`${row[0]} - ${row[1]}: $${value}M`}
            >
              <span
                style={{ padding: "2px", lineHeight: 1.1, textAlign: "center" }}
              >
                {row[1]}
              </span>
              <span style={{ fontSize: "0.6em", opacity: 0.8 }}>{row[3]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- FUNNEL CHART RENDERER (Visual Mockup) ---
const FunnelChartRenderer = ({ data, title, description, theme }) => {
  const isLight = theme === "light";
  const total = parseInt(data.rows[0][1].replace(/,/, ""));

  return (
    <div
      style={{
        marginTop: "10px",
        padding: "15px",
        border: `1px solid ${isLight ? "#ccc" : "#444"}`,
        borderRadius: "8px",
        backgroundColor: isLight ? "#f5f5f5" : "#1f1f1f",
      }}
    >
      <h4
        style={{
          margin: "0 0 5px 0",
          fontSize: "1.1em",
          color: isLight ? "#333" : "#fff",
        }}
      >
        {title}
      </h4>
      <p style={{ margin: "0 0 10px 0", fontSize: "0.85em", opacity: 0.7 }}>
        {description}
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "10px 0",
        }}
      >
        <h5 style={{ fontSize: "0.9em", color: "#17a2b8" }}>
          {formatChartType("funnel")} Visualizer:
        </h5>
        {data.rows.map((row, i) => {
          const candidates = parseInt(row[1].replace(/,/, ""));
          const widthPercentage = (candidates / total) * 100;

          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              <div
                style={{
                  width: `${widthPercentage}%`,
                  maxWidth: "300px",
                  backgroundColor: "#17a2b8",
                  color: "white",
                  padding: "8px",
                  textAlign: "center",
                  fontSize: "0.85em",
                  marginBottom: "2px",
                  clipPath: "polygon(0 0, 100% 0, 80% 100%, 20% 100%)",
                  opacity: 0.9,
                }}
                title={`${row[0]}: ${row[1]} candidates`}
              >
                {row[0]} ({row[2]})
              </div>
              {i < data.rows.length - 1 && (
                <div
                  style={{
                    height: "15px",
                    borderLeft: "1px dashed #999",
                    marginBottom: "2px",
                  }}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- BOXPLOT RENDERER (Visual Mockup) ---
const BoxPlotRenderer = ({ data, title, description, theme }) => {
  const isLight = theme === "light";

  return (
    <div
      style={{
        marginTop: "10px",
        padding: "15px",
        border: `1px solid ${isLight ? "#ccc" : "#444"}`,
        borderRadius: "8px",
        backgroundColor: isLight ? "#f5f5f5" : "#1f1f1f",
      }}
    >
      <h4
        style={{
          margin: "0 0 5px 0",
          fontSize: "1.1em",
          color: isLight ? "#333" : "#fff",
        }}
      >
        {title}
      </h4>
      <p style={{ margin: "0 0 10px 0", fontSize: "0.85em", opacity: 0.7 }}>
        {description}
      </p>

      <div style={{ padding: "10px 0" }}>
        <h5 style={{ fontSize: "0.9em", color: "#ff7f00" }}>
          {formatChartType("boxplot")} Visualizer:
        </h5>
        {data.rows.map((row, i) => {
          const [family, min, q1, median, q3, max] = row
            .slice(0, 6)
            .map((val) => parseFloat(val));
          const range = max - min;
          const boxWidth = ((q3 - q1) / range) * 100;
          const boxStart = ((q1 - min) / range) * 100;

          return (
            <div
              key={i}
              style={{
                marginBottom: "15px",
                borderLeft: "1px solid #999",
                paddingLeft: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "0.9em",
                  fontWeight: "bold",
                  display: "block",
                }}
              >
                {family}
              </span>
              <div
                style={{
                  position: "relative",
                  height: "10px",
                  width: "90%",
                  margin: "8px 0",
                  backgroundColor: isLight ? "#eee" : "#333",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    height: "2px",
                    backgroundColor: "#666",
                    top: "4px",
                  }}
                ></div>

                <div
                  style={{
                    position: "absolute",
                    left: `${boxStart}%`,
                    width: `${boxWidth}%`,
                    height: "100%",
                    backgroundColor: "#007bff",
                    border: `1px solid ${isLight ? "#0056b3" : "#555"}`,
                    top: "-1px",
                  }}
                ></div>

                <div
                  style={{
                    position: "absolute",
                    left: `${((median - min) / range) * 100}%`,
                    width: "2px",
                    height: "140%",
                    backgroundColor: "black",
                    top: "-20%",
                    zIndex: 1,
                  }}
                ></div>
              </div>
              <span style={{ fontSize: "0.7em", color: "#999" }}>
                Min: ${min}K | Median: ${median}K | Max: ${max}K
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- STACKED BAR CHART RENDERER (Visual Mockup) ---
const StackedBarRenderer = ({ data, title, description, theme }) => {
  const isLight = theme === "light";
  const segments = data.headers.slice(1, -1);
  const colors = ["#007bff", "#ffc107", "#28a745"];

  return (
    <div
      style={{
        marginTop: "10px",
        padding: "15px",
        
      }}
    >
      <h4
        style={{
          margin: "0 0 5px 0",
          fontSize: "1.2em",
          color: isLight ? "#333" : "#fff",
          fontWeight: 600
        }}
      >
        {title}
      </h4>
      <p style={{ margin: "0 0 10px 0", fontSize: "0.85em", opacity: 0.7, fontWeight: 500 }}>
        {description}
      </p>

      <div style={{ padding: "10px 0" }}>
        <h5 style={{ fontSize: "0.9em", color: "#ff7f00" }}>
          {formatChartType("stackedbar")} Visualizer:
        </h5>
        {data.rows.slice(0, -1).map((row, i) => {
          const department = row[0];
          const total = parseFloat(row[row.length - 1]);
          const segmentValues = row.slice(1, -1).map((v) => parseFloat(v));

          return (
            <div key={i} style={{ marginBottom: "15px" }}>
              <span
                style={{
                  fontSize: "0.9em",
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                {department} ({total} FTEs)
              </span>

              <div
                style={{
                  display: "flex",
                  height: "25px",
                  width: "100%",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                {segmentValues.map((value, j) => {
                  const width = (value / total) * 100;
                  return (
                    <div
                      key={j}
                      style={{
                        width: `${width}%`,
                        backgroundColor: colors[j],
                        textAlign: "center",
                        color: "white",
                        fontWeight: "500",
                        fontSize: "0.7em",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title={`${segments[j]}: ${value}`}
                    >
                      {value > 0 && `${Math.round(width)}%`}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function KernnAIChat() {
  const [theme, setTheme] = useState("light");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const chatBodyRef = useRef(null);

  const loadSuggestions = () => {
    setSuggestions(getRandomPrompts());
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend(input);
    }
  };

  const handleSend = (queryToSend) => {
    const userQuery = (queryToSend || input).trim();

    if (!userQuery) return;

    // 1. Add user message immediately
    const userMsg = {
      sender: "user",
      text: userQuery,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMsg]);

    // 2. Clear states
    setInput("");
    loadSuggestions();

    // 3. Simulate AI response
    setTimeout(() => {
      const mappedResponse = getMappedResponse(userQuery);
      let aiResponse;

      if (mappedResponse) {
        aiResponse = {
          sender: "ai",
          ...mappedResponse,
          timestamp: new Date(),
          text:
            mappedResponse.text ||
            `Query resolved. Displaying ${mappedResponse.type} result.`,
        };
      } else {
        aiResponse = {
          sender: "ai",
          type: "text",
          text: `I received your message: "${userQuery}". As the HRM assistant, I am processing your unstructured request. Please try one of the suggested prompts for structured data.`,
          timestamp: new Date(),
        };
      }

      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    }, 1500);
  };

  const handleGoBack = () => {
    // For demo purposes, just clear messages
    window.history.back();
  };

  // Load initial suggestions on component mount
  useEffect(() => {
    loadSuggestions();
  }, []);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSuggestionClick = (prompt) => {
    handleSend(prompt);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme === "light" ? "#ffffff" : "#0d0d0d",
        color: theme === "light" ? "#000000" : "#ffffff",
        transition: "all 0.3s ease",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: theme === "light" ? "1px solid #ddd" : "1px solid #333",
          backgroundColor : theme === "light" ? "#ffff" : "#252525ff",
        }}
      >
        {/* LEFT SIDE: BACK BUTTON, LOGO, AND TITLE */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* BACK BUTTON */}
          <div
            onClick={handleGoBack}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "50%",
              // Style for hover/click feel
              backgroundColor: theme === "light" ? "#f0f0f0" : "#2a2a2a",
            }}
            title="Go Back"
          >
            <ArrowLeft size={20} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "6px" }}>
            <img
              src={smallLogo}
              alt="Logo"
              style={{ width: "100%", height: "100%", borderRadius: "6px" }}
            />
          </div>
          <div style={{ fontSize: "18px", fontWeight: "600" }}>
            Kernn AI – HRM Assistant
          </div>
        </div>

        {/* THEME TOGGLE */}
        <div
          onClick={toggleTheme}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            padding: "6px 10px",
            borderRadius: "20px",
            backgroundColor: theme === "light" ? "#eaeaea" : "#1f1f1f",
          }}
        >
          <Sun size={18} style={{ opacity: theme === "light" ? 1 : 0.4 }} />
          <div
            style={{
              width: "40px",
              height: "20px",
              borderRadius: "20px",
              backgroundColor: theme === "light" ? "#999" : "#555",
              position: "relative",
              transition: "all 0.3s ease",
            }}
          >
            <div
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                backgroundColor: "white",
                position: "absolute",
                top: "1px",
                left: theme === "light" ? "1px" : "21px",
                transition: "all 0.3s ease",
              }}
            ></div>
          </div>
          <Moon size={18} style={{ opacity: theme === "dark" ? 1 : 0.4 }} />
        </div>
      </div>

      {/* BODY */}
      <div
        ref={chatBodyRef}
        style={{
          flex: 1,
          padding: "24px",
          overflowY: "auto",
          paddingBottom: "150px"
        }}
      >
        {messages.length === 0 && (
          <div style={{ fontSize: "22px", fontWeight: "500", opacity: 0.7 }}>
            Hello Karthik Makkena, what can I do for you?
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className="messageAnimation"
            style={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                maxWidth: "70%",
                backgroundColor:
                  msg.sender === "user"
                    ? theme === "light"
                      ? "var(--primmary-color)"
                      : "var(--primmary-light)"
                    : theme === "light"
                    ? "var(--primmary-light)"
                    : "#291818ff",

                  
              }}
            >
              {/* FIXED: Display user message text directly */}
              {msg.sender === "user" && <p style={{ margin: 0, color : "white", fontWeight: 500 }}>{msg.text}</p>}

              {/* AI CONTENT RENDERING LOGIC */}
              {msg.sender === "ai" && (
                <>
                  {msg.type === "text" && (
                    <TextRenderer text={msg.text} theme={theme} />
                  )}
                  {msg.type === "chart" && (
                    <DataChartRenderer
                      data={msg.data}
                      title={msg.title}
                      description={msg.description}
                      theme={theme}
                    />
                  )}
                  {msg.type === "table" && (
                    <DataTableRenderer
                      data={msg.data}
                      title={msg.title}
                      description={msg.description}
                      theme={theme}
                      type={msg.type}
                    />
                  )}

                  {msg.type === "gantt" && (
                    <GanttChartRenderer
                      data={msg.data}
                      title={msg.title}
                      description={msg.description}
                      theme={theme}
                    />
                  )}
                  {msg.type === "waterfall" && (
                    <WaterfallChartRenderer
                      data={msg.data}
                      title={msg.title}
                      description={msg.description}
                      theme={theme}
                    />
                  )}
                  {msg.type === "heatmap" && (
                    <HeatmapRenderer
                      data={msg.data}
                      title={msg.title}
                      description={msg.description}
                      theme={theme}
                    />
                  )}
                  {msg.type === "treemap" && (
                    <TreemapRenderer
                      data={msg.data}
                      title={msg.title}
                      description={msg.description}
                      theme={theme}
                    />
                  )}
                  {msg.type === "funnel" && (
                    <FunnelChartRenderer
                      data={msg.data}
                      title={msg.title}
                      description={msg.description}
                      theme={theme}
                    />
                  )}
                  {msg.type === "boxplot" && (
                    <BoxPlotRenderer
                      data={msg.data}
                      title={msg.title}
                      description={msg.description}
                      theme={theme}
                    />
                  )}
                  {msg.type === "stackedbar" && (
                    <StackedBarRenderer
                      data={msg.data}
                      title={msg.title}
                      description={msg.description}
                      theme={theme}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* SUGGESTED PROMPTS UI (Always visible) */}
      {suggestions.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "0 16px",
            marginBottom: "12px",
            backgroundColor : "transparent",
            position : "absolute",
            bottom : "80px"
            
          }}
        >
          <div
            style={{
              width: "70%",
              maxWidth: "90%",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",

            }}
          >
            {suggestions.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(prompt)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "20px",
                  border:
                    theme === "light" ? "1px solid #ccc" : "1px solid #555",
                  backgroundColor: theme === "light" ? "#f0f0f06f" : "#2a2a2a5d",
                  color: theme === "light" ? "#333" : "#ddd",
                  backdropFilter: "blur(8px)",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "background-color 0.2s",
                  whiteSpace: "nowrap",
                  boxShadow:
                    theme === "light" ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* INPUT BAR */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: theme === "light" ? "1px solid #ddd" : "1px solid #333",
          display: "flex",
          justifyContent: "center",
          backgroundColor : theme === "light" ? "#ffff" : "#252525ff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "70%",
            maxWidth: "900px",
          }}
        >
          {/* File upload removed */}
          {/* Input field */}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Kernn AI..."
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "20px",
              border: "1px solid #888",
              backgroundColor: theme === "light" ? "#fff" : "#1a1a1a",
              color: theme === "light" ? "#000" : "#fff",
            }}
          />

          <Mic size={22} style={{ cursor: "pointer" }} />

          <Send
            size={22}
            style={{
              cursor: input.trim() ? "pointer" : "not-allowed",
              opacity: input.trim() ? 1 : 0.4,
            }}
            onClick={() => handleSend(input)}
          />
        </div>
      </div>
    </div>
  );
}
