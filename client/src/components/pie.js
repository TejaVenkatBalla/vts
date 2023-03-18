import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const PieChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const cleanCount = Object.values(data).filter((item) => item.result === "clean").length;
    const unratedCount = Object.values(data).filter((item) => item.result === "unrated").length;

    const total = cleanCount + unratedCount;
    const cleanPercentage = ((cleanCount / total) * 100).toFixed(2);
    const unratedPercentage = ((unratedCount / total) * 100).toFixed(2);

    if (chartRef.current && chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    chartInstanceRef.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: [`Clean (${cleanPercentage}%)`, `Unrated (${unratedPercentage}%)`],
        datasets: [
          {
            label: "Results",
            data: [cleanCount, unratedCount],
            backgroundColor: ["green", "gray"],
          },
        ],
      },
    });
  }, [data]);

  return (
    <div>
      <canvas ref={chartRef} />
    </div>
  );
};

export default PieChart;
