import React from "react";
import { Line, Chart } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { useNavigate, useParams } from "react-router-dom";
import { usePageDispatch } from "../context";

function BTGraph() {
  const navigate = useNavigate();
  const params = useParams();
  const pageDispatch = usePageDispatch();

  const labels = [
    "22.7.2022",
    "25.7.2022",
    "28.7.2022",
    "31.7.2022",
    "3.8.2022",
    "6.8.2022",
    "9.8.2022",
  ];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "INR Record",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: [1.5, 1.0, 2.5, 2.0, 1.3, 3.0, 2.0],
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        labels: {
          // This more specific font property overrides the global property
          font: {
            size: 18,
          },
        },
      },
    },
    //   aspectRatio: 1,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          font: {
            size: 18,
          },
        },
        beginAtZero: true,
      },
      x: {
        ticks: {
          font: {
            size: 18,
          },
        },
      },
    },
  };
  return (
    <div className="btGraph">
      <div style={{ padding: "30px 70px", height: "80%" }}>
        <h1>INR Trend Graph</h1>
        <div className="btLineGraph">
          <Line data={data} options={options} />
        </div>
        <div className="saveAndCancelButton" style={{ right: "80px" }}>
          <button
            className="medBackBtn"
            onClick={() => {
              navigate(`/dashboard/patient/${params.patientId}/bloodThinner`);
              pageDispatch({
                type: "SET_CURRENT_PAGE",
                payload: "Blood Thinner / Clot Preventer",
              });
            }}
            style={{ padding: "7px 20px" }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default BTGraph;
