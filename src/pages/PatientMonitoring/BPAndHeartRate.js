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
  setCurrentPatient,
  updateLastUpdatedTimeInSelfMonitoring,
  updateRecommendedValuesSelfMonitoring,
  updateSMNotification,
} from "../../service";

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
  const [openForm, setOpenForm] = useState(false);

  const [date, setDate] = useState("");
  const [bpSystolic, setBpSystolic] = useState(0);
  const [bpDiastolic, setBpDiastolic] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [device, setDevice] = useState("");
  const [note, setNote] = useState("");

  const [diastolicBPNormal, setDiastolicBPNormal] = useState(
    patientState.patientMonitoring.recommendedValues.diastolicBP[0]
  );
  const [systolicBPNormal, setSystolicBPNormal] = useState(
    patientState.patientMonitoring.recommendedValues.systolicBP[0]
  );

  const [diastolicBPS1, setDiastolicBPS1] = useState(
    patientState.patientMonitoring.recommendedValues.diastolicBP[1]
  );
  const [systolicBPS1, setSystolicBPS1] = useState(
    patientState.patientMonitoring.recommendedValues.systolicBP[1]
  );

  const [diastolicBPS2, setDiastolicBPS2] = useState(
    patientState.patientMonitoring.recommendedValues.diastolicBP[2]
  );
  const [systolicBPS2, setSystolicBPS2] = useState(
    patientState.patientMonitoring.recommendedValues.systolicBP[1]
  );

  const [heartRateLow, setHeartRateLow] = useState(
    patientState.patientMonitoring.recommendedValues.heartRate[0]
  );
  const [heartRateHigh, setHeartRateHigh] = useState(
    patientState.patientMonitoring.recommendedValues.heartRate[1]
  );

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

  async function saveStandardValues(e) {
    e.preventDefault();

    const data = {
      diastolicBP: [diastolicBPNormal, diastolicBPS1, diastolicBPS2].map(
        (each) => parseFloat(each)
      ),
      systolicBP: [systolicBPNormal, systolicBPS1, systolicBPS2].map((each) =>
        parseFloat(each)
      ),
      heartRate: [heartRateLow, heartRateHigh].map((each) => parseFloat(each)),
      sugarLevelAfterMeal:
        patientState.patientMonitoring.recommendedValues.sugarLevelAfterMeal,
      sugarLevelBeforeMeal:
        patientState.patientMonitoring.recommendedValues.sugarLevelBeforeMeal,
    };

    setOpenForm(false);
    await updateRecommendedValuesSelfMonitoring(
      data,
      patientId,
      patientDispatch
    );
    // alert("Update the standard values of BP & Heart Rate successfully.");
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
                  onClick={() => {
                    navigate(
                      `/dashboard/patient/${params.patientId}/patientMonitoring`
                    );
                  }}
                />
                Blood Pressure & Heart Rate
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
            <h1 style={{ display: "block" }}>Blood Pressure Range</h1>
            <div className="standardValuesForm">
              <div>
                <p>
                  Diastolic Normal BP Lower Limit:{" "}
                  <input
                    type="number"
                    min={0}
                    max={diastolicBPS1}
                    value={diastolicBPNormal}
                    onChange={(e) => {
                      setDiastolicBPNormal(e.target.value);
                    }}
                  />
                </p>
                <p>
                  Diastolic Stage 1 Lower Limit :{" "}
                  <input
                    type="number"
                    min={diastolicBPNormal}
                    max={diastolicBPS2}
                    value={diastolicBPS1}
                    onChange={(e) => {
                      setDiastolicBPS1(e.target.value);
                    }}
                  />
                </p>
                <p>
                  Diastolic Stage 2 Lower Limit :{" "}
                  <input
                    type="number"
                    min={diastolicBPS1}
                    max={250}
                    value={diastolicBPS2}
                    onChange={(e) => {
                      setDiastolicBPS2(e.target.value);
                    }}
                  />
                </p>
              </div>

              <div>
                <p>
                  Systolic Normal BP Lower Limit :{" "}
                  <input
                    type="number"
                    min={0}
                    max={systolicBPS1}
                    value={systolicBPNormal}
                    onChange={(e) => {
                      setSystolicBPNormal(e.target.value);
                    }}
                  />
                </p>
                <p>
                  Systolic Stage 1 Lower Limit :{" "}
                  <input
                    type="number"
                    min={systolicBPNormal}
                    max={systolicBPS2}
                    value={systolicBPS1}
                    onChange={(e) => {
                      setSystolicBPS1(e.target.value);
                    }}
                  />
                </p>
                <p>
                  Systolic Stage 2 Lower Limit :{" "}
                  <input
                    type="number"
                    min={systolicBPS1}
                    max={250}
                    value={systolicBPS2}
                    onChange={(e) => {
                      setSystolicBPS2(e.target.value);
                    }}
                  />
                </p>
              </div>
            </div>

            <h1 style={{ display: "block" }}>Heart Rate Range</h1>
            <div className="standardValuesForm">
              <p>
                Lower Limit :{" "}
                <input
                  type="number"
                  min={0}
                  max={heartRateHigh}
                  value={heartRateLow}
                  onChange={(e) => {
                    setHeartRateLow(e.target.value);
                  }}
                />
              </p>
              <p>
                Upper Limit :{" "}
                <input
                  type="number"
                  min={heartRateLow}
                  max={250}
                  value={heartRateHigh}
                  onChange={(e) => {
                    setHeartRateHigh(e.target.value);
                  }}
                />
              </p>
            </div>

            <button type="submit">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BPAndHeartRate;
