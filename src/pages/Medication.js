import React, { useEffect, useState } from "react";
import { GoPrimitiveDot } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { MdAdd, MdDelete } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import Table from "../components/Table";
import {
  useAuthState,
  usePageDispatch,
  usePatientDispatch,
  usePatientState,
} from "../context";
import { updateMedication } from "../service";
import {
  setCurrentPatient,
  updateNameVerified,
} from "../service/PatientService";
import { getCurrentDate, getCurrentTime } from "../utils";
import DatalistInput from "react-datalist-input";
import allergyLogo from "../../src/assets/allergy.png";

function Medication() {
  const navigate = useNavigate();
  const params = useParams();

  const pageDispatch = usePageDispatch();
  const currentUserState = useAuthState();
  const patientState = usePatientState();
  const patientDispatch = usePatientDispatch();
  const patientId = params.patientId;
  const hasAllergy = patientState.allergy
    ? patientState.allergy.hasAllergy
    : false;
  const anticoagulant = patientState.bloodThinner
    ? patientState.bloodThinner.anticoagulant
    : "";

  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [frequency, setFrequency] = useState("");
  const [note, setNote] = useState("");
  const [medicineId, setMedicineId] = useState("");
  const [medicineList, setMedicineList] = useState(
    patientState.medication.medicine ? patientState.medication.medicine : []
  );
  const [selectedMedicine, setSelectedMedicine] = useState();
  const [openForm, setOpenForm] = useState({
    open: false,
    action: "",
  });

  const medicationNameList =
    patientState.medicationConstantList.medicationNameList.map((medicine) => ({
      id: medicine,
      value: medicine,
    }));

  const ODPRN = "OD/PRN";
  const BDPRN = "BD/PRN";
  const TDSPRN = "TDS/PRN";

  const frequencyList = patientState.medicationConstantList.frequencyList.map(
    (frequency) => ({
      id: frequency,
      value: convertFrequencyWithDescription(frequency),
    })
  );

  function convertFrequencyWithDescription(frequency) {
    if (frequency === "ODPRN") return ODPRN;
    else if (frequency === "BDPRN") return BDPRN;
    else if (frequency === "TDSPRN") return TDSPRN;
    else return frequency;
  }

  function convertFrequencyWithoutDescription(frequency) {
    if (frequency === ODPRN) return "ODPRN";
    else if (frequency === BDPRN) return "BDPRN";
    else if (frequency === TDSPRN) return "TDSPRN";
    else return frequency;
  }

  const style = {
    height: "80%",
    width: "100%",
    margin: "auto",
  };

  const gridStyle = {
    minHeight: "600",
    fontSize: "18px",
    fontWeight: "normal",
    marginTop: "15px",
    width: "100%",
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "No.", width: 50, hide: true },
    {
      field: "medicineId",
      headerName: "Medicine ID",
      width: 215,
      hide: true,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.8,
    },
    {
      field: "dose",
      headerName: "Dose",
      flex: 0.8,
    },
    {
      field: "frequency",
      headerName: "Frequency",
      flex: 1,
      renderCell: (params) => {
        return (
          <div>{convertFrequencyWithDescription(params.row.frequency)}</div>
        );
      },
    },
    {
      field: "note",
      headerName: "Notes",
      flex: 2,
    },
    {
      field: "button",
      headerName: "Action",
      flex: 0.7,
      sortable: false,
      renderCell: (params) => {
        return (
          <div style={{ width: "100%", textAlign: "center" }}>
            <button
              className="action"
              onClick={() => selectMedicine(params.row)}
            >
              Edit
            </button>
          </div>
        );
      },
    },
  ];

  const dateTimeUpdated = patientState.medication.dateTimeUpdated
    ? patientState.medication.dateTimeUpdated
    : "";

  function convertFrequencyInMedicineList(medicineList) {
    return medicineList.map((medicine) => ({
      ...medicine,
      frequency: convertFrequencyWithoutDescription(medicine.frequency),
    }));
  }

  async function handleSubmitMedication(e) {
    e.preventDefault();

    const medicationData = {
      nameUpdated: currentUserState.userDetails.username,
      dateTimeUpdated: new Date().getTime(),
      nameVerified: "",
      medicineList: convertFrequencyInMedicineList(medicineList),
    };

    if (window.confirm("Are you sure you want to continue?")) {
      await updateMedication(medicationData, patientId);
      await setCurrentPatient(patientDispatch, patientId);
      alert("Update patient's current medication successfully.");
    } else {
      return;
    }
  }

  async function handleAddOrEditMedication(e) {
    e.preventDefault();

    let medicineData = null;
    if (openForm.action === "add") {
      const medicineId = uuid().slice(0, 5);
      medicineData = {
        id: medicineId,
        name: name,
        dose: dose,
        frequency: frequency,
        note: note,
      };
    } else {
      medicineData = {
        id: medicineId,
        name: name,
        dose: dose,
        frequency: frequency,
        note: note,
      };

      setMedicineList((medicineList) =>
        medicineList.filter((medicine) => medicine.id !== medicineId)
      );
    }
    setMedicineList((medicineList) => [medicineData, ...medicineList]);

    setOpenForm({
      open: false,
      action: "",
    });
    setName("");
    setDose("");
    setFrequency("");
    setNote("");
    setMedicineId("");
  }

  function handleDeleteMedication() {
    for (let i = 0; i < selectedMedicine.length; i++) {
      setMedicineList((medicineList) =>
        medicineList.filter((med) => med.id !== selectedMedicine[i].id)
      );
    }
  }

  function selectMedicine(row) {
    setName(row.name);
    setDose(row.dose);
    setFrequency(convertFrequencyWithDescription(row.frequency));
    setNote(row.note);
    setMedicineId(row.id);

    setOpenForm({
      open: true,
      action: "edit",
    });
  }

  function setSelectedMedicineList(ids, data) {
    const selectedIDs = new Set(ids);
    const selectedRowData = data.filter((row) => selectedIDs.has(row.id));
    setSelectedMedicine(selectedRowData);
  }

  async function verifyData() {
    if (window.confirm("Are you sure to verify?")) {
      await updateNameVerified(
        "medication",
        patientId,
        currentUserState.userDetails.username
      );
      await setCurrentPatient(patientDispatch, patientId);
    }
  }

  return (
    <div className="wrapper">
      <div style={{ padding: "20px 50px", height: "80%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div className="lastUpdatedBox">
            <div>
              <h4>
                <span>Last updated by</span>
                <span>:</span>
              </h4>
              <p>{patientState.medication.nameUpdated}</p>
            </div>
            <div>
              <h4>
                <span>Last verified by</span>
                <span>:</span>
              </h4>
              <p>{patientState.medication.nameVerified}</p>
            </div>
            <div>
              <h4>
                <span>Last updated on</span>
                <span>:</span>
              </h4>
              <p>
                {getCurrentDate(dateTimeUpdated)}{" "}
                {getCurrentTime(dateTimeUpdated)}
              </p>
            </div>
          </div>

          <div className="medicationLeftHeader">
            <div
              onClick={() => {
                navigate(`/dashboard/patient/${params.patientId}/allergy`);
              }}
            >
              <img src={allergyLogo} className="iconModule" />
              Allergy {hasAllergy && <GoPrimitiveDot className="alertDot" />}
            </div>
            <div
              onClick={() => {
                navigate(`/dashboard/patient/${params.patientId}/bloodThinner`);
              }}
            >
              Blood Thinner / Clot preventer{" "}
              {anticoagulant !== "" && <GoPrimitiveDot className="alertDot" />}
            </div>
          </div>
        </div>

        <Table
          className="medicationTable"
          style={style}
          columns={columns}
          data={medicineList}
          clickRowFunction={() => {}}
          selectFunction={setSelectedMedicineList}
          toolbar={false}
          gridStyle={gridStyle}
          density="standard"
          checkboxSelection={true}
        />

        <div className={openForm.open ? "medBg" : ""}></div>

        <div className="addAndDeleteMedicationButton">
          <button
            className="deleteMedication"
            onClick={() => handleDeleteMedication()}
          >
            <MdDelete />
            Delete
          </button>
          <button
            className="addMedication"
            onClick={() => {
              setOpenForm({
                open: true,
                action: "add",
              });
            }}
          >
            <MdAdd />
            Add
          </button>
        </div>

        <div className="saveOrCancelMedBtn">
          <button
            className="verifyBtn"
            type="button"
            onClick={() => verifyData()}
          >
            Verify
          </button>
          <button
            className="saveMedication"
            onClick={(e) => handleSubmitMedication(e)}
          >
            Save
          </button>
          <button
            className="medBackBtn"
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure to exit this page? \nPlease ensure you have saved all the changes before leaving this page. "
                )
              ) {
                navigate(`/dashboard/patient/${params.patientId}`);
                pageDispatch({
                  type: "SET_CURRENT_PAGE",
                  payload: "Patient Details",
                });
              }
            }}
          >
            Back
          </button>
        </div>

        <div className={`medicationForm ${openForm.open ? "popup" : ""}`}>
          <form
            className="addOrEditMedicationForm"
            onSubmit={(e) => handleAddOrEditMedication(e)}
          >
            <IoClose
              className="closeForm"
              onClick={() => {
                setOpenForm({
                  open: false,
                  action: "",
                });
                setName("");
                setDose("");
                setFrequency("");
                setNote("");
                setMedicineId("");
              }}
            />
            <h1>{openForm.action === "add" ? "Add" : "Edit"} Medication</h1>
            <div>
              <DatalistInput
                label="Name:"
                className="medicationDatalistInput"
                value={name}
                items={medicationNameList}
                placeholder="Select a medicine"
                onChange={(e) => setName(e.target.value)}
                onSelect={(item) => {
                  setName(item.value);
                }}
                filters={[(medicationNameList) => medicationNameList]}
              />
              {/* <select
                name="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                required
              >
                <option value="">Select medicine</option>
                {medicationNameList.map((med) => (
                  <option key={med} value={med}>
                    {med}
                  </option>
                ))}
              </select> */}
            </div>
            <div>
              <label>Dose: </label>
              <input
                type="text"
                name="dose"
                placeholder="Enter dose (in mcg, mg, g or iu)"
                value={dose}
                onChange={(e) => {
                  setDose(e.target.value);
                }}
                required
              />
            </div>
            <div>
              {/* <label>Frequency: </label> */}
              <DatalistInput
                label="Frequency:"
                className="medicationDatalistInput"
                value={frequency}
                items={frequencyList}
                placeholder="Select frequency"
                onChange={(e) => setFrequency(e.target.value)}
                onSelect={(item) => {
                  setFrequency(item.value);
                }}
                filters={[(frequencyList) => frequencyList]}
              />
              {/* <select
                name="frequency"
                value={frequency}
                onChange={(e) => {
                  setFrequency(e.target.value);
                }}
                required
              >
                <option value="">Select frequency</option>
                {frequencyList.map((fre) => (
                  <option key={fre} value={fre}>
                    {fre}
                  </option>
                ))}
              </select> */}
            </div>
            <div>
              <label>Notes: </label>
              <textarea
                type="text"
                name="note"
                className="noteInput"
                placeholder="Any remarks"
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                }}
              />
            </div>

            <button type="submit">
              {openForm.action === "add" ? "Add" : "Update"} medication
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Medication;
