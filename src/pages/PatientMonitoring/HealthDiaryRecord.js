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
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase";
import {
  updateLastUpdatedTimeInSelfMonitoring,
  updateSMNotification,
} from "../../service";

function HealthDiaryRecord() {
  const patientState = usePatientState();
  const patientDispatch = usePatientDispatch();
  const pageDispatch = usePageDispatch();

  const navigate = useNavigate();
  const params = useParams();
  const patientId = params.patientId;
  const notification = patientState.notification;

  const [openView, setOpenView] = useState(false);

  const [date, setDate] = useState("");
  const [hospital, setHospital] = useState(0);
  const [note, setNote] = useState("");

  // Table
  let i = 0;
  const tableData = patientState.patientMonitoring.healthDiaryRecord
    ? patientState.patientMonitoring.healthDiaryRecord.map((record) => ({
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
      field: "hospital",
      headerName: "Hospital Admission",
      flex: 2.5,
    },
    // {
    //   field: "ward",
    //   headerName: "Ward",
    //   flex: 1.5,
    // },
    // {
    //   field: "note",
    //   headerName: "Notes",
    //   flex: 2,
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
    setHospital(row.hospital);
    setNote(row.note);
  }

  let excelData = [["Date", "Hospital Admission", "Note"]];

  const data = patientState.patientMonitoring.healthDiaryRecord;
  for (let i = 0; i < data.length; i++) {
    excelData.push([
      getCurrentDate(data[i].date),
      data[i].hospital,
      data[i].note,
    ]);
  }

  useEffect(() => {
    if (notification.SM_healthDiary) {
      updateSMNotification(patientId, "healthDiary", patientDispatch);
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
                alignItems: "center",
                justifyContent: "space-between",
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
                Health Diary
              </h2>
              <span style={{ float: "right" }}>
                <ExcelExport
                  excelData={excelData}
                  fileName={`Health Diary_${patientState.currentPatient.name}`}
                />
              </span>
            </div>
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

            <div className="patientMonitoringDetails healthDiaryPage">
              <div>
                <h3>
                  Date <span>:</span>
                </h3>
                <p>{date}</p>
              </div>

              <div>
                <h3>
                  Hospital Admission <span>:</span>
                </h3>
                <p>{hospital}</p>
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

export default HealthDiaryRecord;
