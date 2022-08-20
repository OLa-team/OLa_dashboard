import React, { useEffect, useState } from "react";
import { Line, Chart } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { useNavigate, useParams } from "react-router-dom";
import { usePageDispatch, usePatientState } from "../context";

function BTGraph() {
  const navigate = useNavigate();
  const params = useParams();
  const pageDispatch = usePageDispatch();
  const patientState = usePatientState();

  const anticoagulant = patientState.bloodThinner.anticoagulant
    ? patientState.bloodThinner.anticoagulant
    : "";

  const labels =
    anticoagulant === "warfarin"
      ? patientState.bloodThinner.inrRecord
        ? patientState.bloodThinner.inrRecord.map((record) => record.date)
        : []
      : patientState.bloodThinner.creatinineRecord
      ? patientState.bloodThinner.creatinineRecord.map((record) => record.date)
      : [];
  const dataValue =
    anticoagulant === "warfarin"
      ? patientState.bloodThinner.inrRecord
        ? patientState.bloodThinner.inrRecord.map((record) =>
            parseFloat(record.inr)
          )
        : []
      : patientState.bloodThinner.creatinineRecord
      ? patientState.bloodThinner.creatinineRecord.map((record) =>
          parseFloat(record.creatinineClearance)
        )
      : [];
  const data = {
    labels: labels,
    datasets: [
      {
        label: anticoagulant === "warfarin" ? "INR" : "Creatinine Clearance",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: dataValue,
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
        <h1>
          {anticoagulant === "warfarin" ? "INR" : "Creatinine Clearance"} Trend
          Graph
        </h1>
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
