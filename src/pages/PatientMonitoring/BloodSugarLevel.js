import React, { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
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
import {
  updateLastUpdatedTimeInSelfMonitoring,
  updateRecommendedValuesSelfMonitoring,
  updateSMNotification,
} from "../../service";

function BloodSugarLevel() {
  const patientState = usePatientState();
  const patientDispatch = usePatientDispatch();
  const pageDispatch = usePageDispatch();

  const navigate = useNavigate();
  const params = useParams();
  const patientId = params.patientId;
  const notification = patientState.notification;

  const [displayMode, setDisplayMode] = useState("table");
  const [openView, setOpenView] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const [date, setDate] = useState("");
  const [timeTaken, setTimeTaken] = useState("");
  const [bloodSugarLevel, setBloodSugarLevel] = useState(0);
  const [device, setDevice] = useState("");
  const [note, setNote] = useState("");

  const [sugarLevelBeforeMealLow, setSugarLevelBeforeMealLow] = useState(
    patientState.patientMonitoring.recommendedValues.sugarLevelBeforeMeal[0]
  );
  const [sugarLevelBeforeMealHigh, setSugarLevelBeforeMealHigh] = useState(
    patientState.patientMonitoring.recommendedValues.sugarLevelBeforeMeal[1]
  );

  const [sugarLevelAfterMealLow, setSugarLevelAfterMealLow] = useState(
    patientState.patientMonitoring.recommendedValues.sugarLevelAfterMeal[0]
  );
  const [sugarLevelAfterMealHigh, setSugarLevelAfterMealHigh] = useState(
    patientState.patientMonitoring.recommendedValues.sugarLevelAfterMeal[1]
  );

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
      flex: 1.5,
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
    setTimeTaken(row.timeTaken);
    setBloodSugarLevel(row.bloodSugarLevel);
    setDevice(row.device);
    setNote(row.note);
  }

  async function saveStandardValues(e) {
    e.preventDefault();

    const data = {
      diastolicBP: patientState.patientMonitoring.recommendedValues.diastolicBP,
      systolicBP: patientState.patientMonitoring.recommendedValues.systolicBP,
      heartRate: patientState.patientMonitoring.recommendedValues.heartRate,
      sugarLevelBeforeMeal: [
        sugarLevelBeforeMealLow,
        sugarLevelBeforeMealHigh,
      ].map((each) => parseFloat(each)),
      sugarLevelAfterMeal: [
        sugarLevelAfterMealLow,
        sugarLevelAfterMealHigh,
      ].map((each) => parseFloat(each)),
    };

    setOpenForm(false);
    await updateRecommendedValuesSelfMonitoring(
      data,
      patientId,
      patientDispatch
    );
    // alert("Update the standard values of Blood Sugar successfully.");
  }

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

  let excelData = [
    ["Date", "Time Taken", "Reading (mmol/L)", "Device", "Note"],
  ];

  const data = patientState.patientMonitoring.sugarLevelRecord;
  for (let i = 0; i < data.length; i++) {
    excelData.push([
      getCurrentDate(data[i].date),
      data[i].timeTaken,
      data[i].bloodSugarLevel,
      data[i].device,
      data[i].note,
    ]);
  }

  useEffect(() => {
    if (notification.SM_sugarLevel) {
      updateSMNotification(patientId, "sugarLevel", patientDispatch);
      updateLastUpdatedTimeInSelfMonitoring(patientId);
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
                  onClick={() =>
                    navigate(
                      `/dashboard/patient/${params.patientId}/patientMonitoring`
                    )
                  }
                />
                Blood Sugar Level
                <button
                  className="editStandardValuesButton"
                  onClick={() => setOpenForm(true)}
                >
                  Standard Values
                </button>
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
                  fileName={`Blood Sugar Level_${patientState.currentPatient.name}`}
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
                  Time Taken <span>:</span>
                </h3>
                <p>{timeTaken}</p>
              </div>

              <div>
                <h3>
                  Blood Sugar Level (mmol/L) <span>:</span>
                </h3>
                <p>{bloodSugarLevel}</p>
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

        <div className={openForm ? "btBg" : ""}></div>
        <div className={`patientMonitoringForm ${openForm ? "popup" : ""}`}>
          <form
            className="editPatientMonitoringForm"
            onSubmit={(e) => saveStandardValues(e)}
          >
            <IoClose
              className="closeForm"
              onClick={() => {
                setOpenForm(false);
              }}
            />
            <h1 style={{ display: "block" }}>Blood Glucose</h1>
            <div className="standardValuesForm">
              <div>
                <p>
                  Fasting / Pre-meal (Lower Limit):{" "}
                  <input
                    type="number"
                    min={0}
                    max={sugarLevelBeforeMealHigh}
                    value={sugarLevelBeforeMealLow}
                    onChange={(e) => {
                      setSugarLevelBeforeMealLow(e.target.value);
                    }}
                    step="0.1"
                  />
                </p>
                <p>
                  2 hrs after meal (Lower Limit) :{" "}
                  <input
                    type="number"
                    min={0}
                    max={sugarLevelAfterMealHigh}
                    value={sugarLevelAfterMealLow}
                    onChange={(e) => {
                      setSugarLevelAfterMealLow(e.target.value);
                    }}
                    step="0.1"
                  />
                </p>
              </div>

              <div>
                <p>
                  Fasting / Pre-meal (Upper Limit) :{" "}
                  <input
                    type="number"
                    min={sugarLevelBeforeMealLow}
                    max={20}
                    value={sugarLevelBeforeMealHigh}
                    onChange={(e) => {
                      setSugarLevelBeforeMealHigh(e.target.value);
                    }}
                    step="0.1"
                  />
                </p>
                <p>
                  2 hrs after meal (Upper Limit) :{" "}
                  <input
                    type="number"
                    min={sugarLevelAfterMealLow}
                    max={20}
                    value={sugarLevelAfterMealHigh}
                    onChange={(e) => {
                      setSugarLevelAfterMealHigh(e.target.value);
                    }}
                    step="0.1"
                  />
                </p>
              </div>
            </div>

            <button type="submit">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BloodSugarLevel;
