import React, { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { Line } from "react-chartjs-2";
import { useNavigate, useParams } from "react-router-dom";
import Table from "../../components/Table";
import { usePageDispatch, usePatientState } from "../../context";
import { getCurrentDate } from "../../utils";

function HealthDiaryRecord() {
  const patientState = usePatientState();
  const pageDispatch = usePageDispatch();

  const navigate = useNavigate();
  const params = useParams();
  const patientId = params.patientId;

  const [displayMode, setDisplayMode] = useState("table");

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
    {
      field: "ward",
      headerName: "Ward",
      flex: 1.5,
    },
    // {
    //   field: "note",
    //   headerName: "Notes",
    //   flex: 2,
    // },
    {
      field: "button",
      headerName: "Action",
      flex: 0.7,
      sortable: false,
      renderCell: (params) => {
        return (
          <div style={{ width: "100%", textAlign: "center" }}>
            <button className="action" onClick={() => {}}>
              View Details
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="wrapper eachMonitoringPage">
      <div style={{ padding: "30px 50px", height: "100%" }}>
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
      </div>
    </div>
  );
}

export default HealthDiaryRecord;
