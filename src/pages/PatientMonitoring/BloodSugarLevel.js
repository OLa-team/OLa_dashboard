import React, { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { Line } from "react-chartjs-2";
import { useNavigate, useParams } from "react-router-dom";
import Table from "../../components/Table";
import { usePageDispatch, usePatientState } from "../../context";
import { getCurrentDate } from "../../utils";

function BloodSugarLevel() {
  const patientState = usePatientState();
  const pageDispatch = usePageDispatch();

  const navigate = useNavigate();
  const params = useParams();
  const patientId = params.patientId;

  const [displayMode, setDisplayMode] = useState("table");

  // Table
  let i = 0;
  const tableData = patientState.patientMonitoring.sugarLevelRecord
    ? patientState.patientMonitoring.sugarLevelRecord.map((record) => ({
        ...record,
        date: getCurrentDate(record.date),
        id: i++,
      }))
    : [];

  const style = {
    height: "75%",
    width: "100%",
    margin: "auto",
  };

  const gridStyle = {
    minHeight: "600",
    fontSize: "18px",
    fontWeight: "normal",
    marginTop: "30px",
    width: "100%",
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "No.", width: 50, hide: true },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "timeTaken",
      headerName: "Time Taken",
      flex: 1.5,
    },
    {
      field: "bloodSugarLevel",
      headerName: "Reading (mmol/L)",
      flex: 1.5,
    },
    {
      field: "device",
      headerName: "Device",
      flex: 1,
    },
    {
      field: "note",
      headerName: "Notes",
      flex: 1,
    },
  ];

  // Graph
  const labels = patientState.patientMonitoring.sugarLevelRecord
    ? patientState.patientMonitoring.sugarLevelRecord.map((record) =>
        getCurrentDate(record.date)
      )
    : [];

  const graphDataset = patientState.patientMonitoring.sugarLevelRecord
    ? patientState.patientMonitoring.sugarLevelRecord.map(
        (record) => record.bloodSugarLevel
      )
    : [];

  const graphData = {
    labels: labels,
    datasets: [
      {
        label: "Sugar level (mmol/L)",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: graphDataset,
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
    <div className="wrapper eachMonitoringPage">
      <div style={{ padding: "30px 50px", height: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>
            <BsArrowLeft
              className="backToMonitoringMainPage"
              onClick={() =>
                navigate(
                  `/dashboard/patient/${params.patientId}/patientMonitoring`
                )
              }
            />
            Blood Sugar Level
          </h2>
          <div className="displayMode">
            <div>
              <input
                type="radio"
                checked={displayMode === "table"}
                onChange={() => {
                  setDisplayMode("table");
                }}
              />
              <label>Table</label>
            </div>

            <div>
              <input
                type="radio"
                checked={displayMode === "graph"}
                onChange={() => {
                  setDisplayMode("graph");
                }}
              />
              <label>Graph</label>
            </div>
          </div>
        </div>

        {displayMode === "table" ? (
          <>
            <Table
              style={style}
              className="monitoringTable"
              columns={columns}
              data={tableData}
              clickRowFunction={() => {}}
              selectFunction={() => {}}
              toolbar={false}
              gridStyle={gridStyle}
              density="standard"
              checkboxSelection={false}
            />
          </>
        ) : (
          <>
            <div className="monitoringGraph">
              <Line data={graphData} options={options} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BloodSugarLevel;
