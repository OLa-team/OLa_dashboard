import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import Table from "../components/Table";
import { usePatientDispatch, usePatientState } from "../context";
import {
  deleteAllSelectedPatients,
  fetchPatientList,
  filterPatientList,
} from "../service";

function SearchPatient() {
  // State
  const [searchResult, setSearchResult] = useState("");
  const [selectedPatients, setSelectedPatients] = useState([]);

  // Global state
  const patientState = usePatientState();

  // Dispatch
  const dispatch = usePatientDispatch();

  const columns: GridColDef[] = [
    { field: "id", headerName: "No.", width: 50 },
    {
      field: "patientId",
      headerName: "Patient ID",
      width: 215,
      hide: true,
    },
    {
      field: "name",
      headerName: "Patient's name",
      minWidth: 250,
      flex: 1,
    },
    {
      field: "icNo",
      headerName: "I/C No. / Passport No.",
      minWidth: 250,
      flex: 1,
    },
    {
      field: "phoneNo",
      headerName: "Mobile Phone No.",
      minWidth: 250,
      flex: 1,
    },
  ];

  async function getPatientList() {
    try {
      let response = await fetchPatientList(dispatch);
      if (response.length < 0) return;
    } catch (error) {
      console.log("Patient list error: ", error);
    }
  }

  useEffect(() => {
    getPatientList();
  }, []);

  useEffect(() => {
    filterPatientList(dispatch, patientState.patientList, searchResult);
  }, [searchResult]);

  console.log("selected list", patientState.selectedPatientList[0]);

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
        <button
          onClick={() => {
            if (patientState.selectedPatientList.length === 0) {
              alert("Please select patient before deleting.");
              return;
            }
            if (
              window.confirm("Are you sure you want to delete the patient(s)?")
            ) {
              deleteAllSelectedPatients(
                dispatch,
                patientState.selectedPatientList
              );
            } else {
              return;
            }
          }}
        >
          Delete
        </button>
      </div>

      <Table
        data={
          searchResult === ""
            ? patientState.patientList
            : patientState.tempPatientList
        }
        columns={columns}
        // deletePatient={(data) => setSelectedPatients(data)}
      />
    </div>
  );
}

export default SearchPatient;
