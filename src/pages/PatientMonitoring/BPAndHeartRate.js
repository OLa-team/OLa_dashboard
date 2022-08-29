import React, { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { Line } from "react-chartjs-2";
import { useNavigate, useParams } from "react-router-dom";
import Table from "../../components/Table";
import { usePageDispatch, usePatientState } from "../../context";
import { getCurrentDate } from "../../utils";

function BPAndHeartRate() {
  const patientState = usePatientState();
  const pageDispatch = usePageDispatch();

  const navigate = useNavigate();
  const params = useParams();
  const patientId = params.patientId;

  const [displayMode, setDisplayMode] = useState("table");

  // Table
  let i = 0;
  const tableData = patientState.patientMonitoring.bloodPressureHeartRateRecord
    ? patientState.patientMonitoring.bloodPressureHeartRateRecord.map(
        (record) => ({ ...record, date: getCurrentDate(record.date), id: i++ })
      )
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
      field: "bpSystolic",
      headerName: "BP (systolic) (mmHg)",
      flex: 1.5,
    },
    {
      field: "bpDiastolic",
      headerName: "BP (diastolic) (mmHg)",
      flex: 1.5,
    },
    {
      field: "heartRate",
      headerName: "HR (bpm)",
      flex: 1,
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
  const labels = patientState.patientMonitoring.bloodPressureHeartRateRecord
    ? patientState.patientMonitoring.bloodPressureHeartRateRecord.map(
        (record) => getCurrentDate(record.date)
      )
    : [];

  const graphDataset_1 = patientState.patientMonitoring
    .bloodPressureHeartRateRecord
    ? patientState.patientMonitoring.bloodPressureHeartRateRecord.map(
        (record) => record.heartRate
      )
    : [];

  const graphDataset_2 = patientState.patientMonitoring
    .bloodPressureHeartRateRecord
    ? patientState.patientMonitoring.bloodPressureHeartRateRecord.map(
        (record) => record.bpSystolic
      )
    : [];

  const graphDataset_3 = patientState.patientMonitoring
    .bloodPressureHeartRateRecord
    ? patientState.patientMonitoring.bloodPressureHeartRateRecord.map(
        (record) => record.bpDiastolic
      )
    : [];

  const graphData = {
    labels: labels,
    datasets: [
      {
        label: "HR (bpm)",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: graphDataset_1,
      },
      {
        label: "BP (systolic) (mmHg)",
        backgroundColor: "rgb(99, 149, 255)",
        borderColor: "rgb(99, 149, 255)",
        data: graphDataset_3,
      },
      {
        label: "BP (diastolic) (mmHg)",
        backgroundColor: "#919191",
        borderColor: "#919191",
        data: graphDataset_2,
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
              onClick={() => {
                navigate(
                  `/dashboard/patient/${params.patientId}/patientMonitoring`
                );
              }}
            />
            Blood Pressure & Heart Rate
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

export default BPAndHeartRate;
