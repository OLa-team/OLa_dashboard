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

  const [displayMode, setDisplayMode] = useState("table");

  // Table
  let i = 0;
  const tableData = patientState.patientMonitoring.bleedingSymptomsRecord
    ? patientState.patientMonitoring.bleedingSymptomsRecord.map((record) => ({
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
    {
      field: "note",
      headerName: "Notes",
      flex: 3,
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
      </div>
    </div>
  );
}

export default BleedingSymptom;
