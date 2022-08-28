import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { usePatientDispatch, usePatientState } from "../context";
import {
  deleteAllSelectedPatients,
  fetchPatientList,
  filterPatientList,
  setCurrentPatient,
} from "../service";

function SearchPatient() {
  // Global state
  const patientState = usePatientState();

  // Dispatch
  const dispatch = usePatientDispatch();
  const navigate = useNavigate();

  // State
  const [searchResult, setSearchResult] = useState("");
  const [selectedPatients, setSelectedPatients] = useState([]);

  const style = { height: "90%", width: "95%", margin: "auto" };

  const gridStyle = {
    minHeight: "600",
    fontSize: "20px",
    fontWeight: "bold",
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "No.", width: 80 },
    {
      field: "patientId",
      headerName: "Patient ID",
      width: 215,
      hide: true,
    },
    {
      field: "name",
      headerName: "Patient's name",
      flex: 2,
    },
    {
      field: "icNo",
      headerName: "I/C No. / Passport No.",
      flex: 1,
    },
    {
      field: "phoneNo",
      headerName: "Mobile Phone No.",
      flex: 1,
    },
  ];

  function setSelectedPatientList(ids, data) {
    const selectedIDs = new Set(ids);
    const selectedRowData = data.filter((row) => selectedIDs.has(row.id));

    dispatch({
      type: "SELECT_AND_SET_SELECTED_PATIENT_LIST_TO_DELETE",
      payload: selectedRowData,
    });
  }

  async function getPatientList() {
    await fetchPatientList(dispatch);
  }

  async function selectPatient(row) {
    await setCurrentPatient(dispatch, row.row.patientId);
    navigate(`/dashboard/patient/${row.row.patientId}`);
  }

  function deletePatient() {
    if (patientState.selectedPatientList.length === 0) {
      alert("Please select patient before deleting.");
      return;
    }
    if (window.confirm("Are you sure you want to delete the patient(s)?")) {
      deleteAllSelectedPatients(dispatch, patientState.selectedPatientList);
    } else {
      return;
    }
    alert("Deleted the patient(s) successfully");
  }

  useEffect(() => {
    getPatientList();
  }, []);

  useEffect(() => {
    filterPatientList(dispatch, patientState.patientList, searchResult);
  }, [searchResult]);

  return (
    <div className="searchPatient">
      <div className="bar">
        <div className="searchBar">
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setSearchResult(e.target.value)}
          />
          <BiSearch className="searchIcon" />
        </div>
        <button onClick={deletePatient}>Delete</button>
      </div>

      <Table
        style={style}
        data={
          searchResult === ""
            ? patientState.patientList
            : patientState.tempPatientList
        }
        columns={columns}
        clickRowFunction={selectPatient}
        selectFunction={setSelectedPatientList}
        toolbar={false}
        gridStyle={gridStyle}
        density="comfortable"
        checkboxSelection={true}
        // deletePatient={(data) => setSelectedPatients(data)}
      />
    </div>
  );
}

export default SearchPatient;
