import React, { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { Line } from "react-chartjs-2";
import { useNavigate, useParams } from "react-router-dom";
import Table from "../../components/Table";
import {
  usePageDispatch,
  usePatientDispatch,
  usePatientState,
} from "../../context";
import { getCurrentDate } from "../../utils";
import ExcelExport from "../../components/ExcelExport";
import { updateSMNotification } from "../../service";

function BPAndHeartRate() {
  const patientState = usePatientState();
  const patientDispatch = usePatientDispatch();
  const pageDispatch = usePageDispatch();

  const navigate = useNavigate();
  const params = useParams();
  const patientId = params.patientId;
  const notification = patientState.notification;

  const [displayMode, setDisplayMode] = useState("table");
  const [openView, setOpenView] = useState(false);

  const [date, setDate] = useState("");
  const [bpSystolic, setBpSystolic] = useState(0);
  const [bpDiastolic, setBpDiastolic] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [device, setDevice] = useState("");
  const [note, setNote] = useState("");

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
    // {
    //   field: "note",
    //   headerName: "Notes",
    //   flex: 1,
    // },
    {
      field: "button",
      headerName: "Action",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <div style={{ width: "100%", textAlign: "center" }}>
            <button
              className="action"
              onClick={() => openViewDetails(params.row)}
            >
              View Details
            </button>
          </div>
        );
      },
    },
  ];

  function openViewDetails(row) {
    setOpenView(true);
    console.log("row", row);

    setDate(row.date);
    setBpSystolic(row.bpSystolic);
    setBpDiastolic(row.bpDiastolic);
    setHeartRate(row.heartRate);
    setDevice(row.device);
    setNote(row.note);
  }

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

  let excelData = [
    [
      "Date",
      "BP (systolic) (mmHg)",
      "BP (diastolic) (mmHg)",
      "HR (bpm)",
      "Device",
      "Note",
    ],
  ];

  const data = patientState.patientMonitoring.bloodPressureHeartRateRecord;
  for (let i = 0; i < data.length; i++) {
    excelData.push([
      getCurrentDate(data[i].date),
      data[i].bpSystolic,
      data[i].bpDiastolic,
      data[i].heartRate,
      data[i].device,
      data[i].note,
    ]);
  }

  useEffect(() => {
    if (notification.SM_bpAndHeartRate) {
      updateSMNotification(patientId, "bpAndHeartRate", patientDispatch);
    }
  }, []);

  return (
    <div className="wrapper eachMonitoringPage">
      <div style={{ padding: "30px 50px", height: "100%" }}>
        {!openView ? (
          <>
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

                <ExcelExport
                  excelData={excelData}
                  fileName={`Blood Pressure & Heart Rate_${patientState.currentPatient.name}`}
                />
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
          </>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h1>
                <BsArrowLeft
                  className="backToMonitoringMainPage"
                  onClick={() => setOpenView(false)}
                />
                Details
              </h1>
            </div>

            <div className="patientMonitoringDetails">
              <div>
                <h3>
                  Date <span>:</span>
                </h3>
                <p>{date}</p>
              </div>

              <div>
                <h3>
                  Bp (systolic) (mmHg) <span>:</span>
                </h3>
                <p>{bpSystolic}</p>
              </div>

              <div>
                <h3>
                  Bp (diastolic) (mmHg) <span>:</span>
                </h3>
                <p>{bpDiastolic}</p>
              </div>

              <div>
                <h3>
                  Heart Rate (bpm) <span>:</span>
                </h3>
                <p>{heartRate}</p>
              </div>

              <div>
                <h3>
                  Device <span>:</span>
                </h3>
                <p>{device}</p>
              </div>

              <div>
                <h3>
                  Notes <span>:</span>
                </h3>
                <p>{note}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BPAndHeartRate;
