import React, { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { Line } from "react-chartjs-2";
import { useNavigate, useParams } from "react-router-dom";
import Table from "../../components/Table";
import { usePageDispatch, usePatientState } from "../../context";
import { getCurrentDate } from "../../utils";

function BleedingSymptom() {
  const patientState = usePatientState();
  const pageDispatch = usePageDispatch();

  const navigate = useNavigate();
  const params = useParams();
  const patientId = params.patientId;

  const [openView, setOpenView] = useState(false);

  const [date, setDate] = useState("");
  const [bleeding, setBleeding] = useState(0);
  const [note, setNote] = useState("");

  // Table
  let i = 0;
  const tableData = patientState.patientMonitoring.bleedingSymptomRecord
    ? patientState.patientMonitoring.bleedingSymptomRecord.map((record) => ({
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
      field: "bleeding",
      headerName: "Bleeding Site",
      flex: 3,
    },
    // {
    //   field: "note",
    //   headerName: "Notes",
    //   flex: 3,
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
    setBleeding(row.bleeding);
    setNote(row.note);
  }

  return (
    <div className="wrapper eachMonitoringPage">
      <div style={{ padding: "30px 50px", height: "100%" }}>
        {!openView ? (
          <>
            <h2>
              <BsArrowLeft
                className="backToMonitoringMainPage"
                onClick={() =>
                  navigate(
                    `/dashboard/patient/${params.patientId}/patientMonitoring`
                  )
                }
              />
              Bleeding Symptom
            </h2>
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

            <div className="patientMonitoringDetails bleedingSymptomPage">
              <div>
                <h3>
                  Date <span>:</span>
                </h3>
                <p>{date}</p>
              </div>

              <div>
                <h3>
                  Bleeding Symptom <span>:</span>
                </h3>
                <p>{bleeding}</p>
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

export default BleedingSymptom;
