import React, { useState } from "react";
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
import { setCurrentPatient } from "../service/PatientService";
import { getCurrentDate, getCurrentTime } from "../utils";

function Medication() {
  const navigate = useNavigate();
  const params = useParams();

  const pageDispatch = usePageDispatch();
  const userState = useAuthState();
  const patientState = usePatientState();
  const patientDispatch = usePatientDispatch();
  const hasAllergy = patientState.allergy.hasAllergy;
  const patientId = params.patientId;

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

  const medicationNameList = [
    "Perindopril",
    "Bisoprolol",
    "Simvastatin",
    "Atorvastatin",
    "Gemfibrozil",
    "Isordil",
    "S/L GTN",
    "Metformin",
  ];

  const frequencyList = ["OD", "BD", "TDS", "QID", "PRN"];

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
      field: "medicineId",
      headerName: "Medicine ID",
      width: 215,
      hide: true,
    },
    {
      field: "name",
      headerName: "Name",
      width: 350,
      // flex: 1,
    },
    {
      field: "dose",
      headerName: "Dose (in mg)",
      width: 200,
      // flex: 1,
    },
    {
      field: "frequency",
      headerName: "Frequency",
      width: 200,
      // flex: 1,
    },
    {
      field: "note",
      headerName: "Notes",
      width: 200,
      flex: 1,
    },
  ];

  const dateTimeUpdated = patientState.medication.dateTimeUpdated
    ? patientState.medication.dateTimeUpdated
    : "";

  let medicationData = {
    nameUpdated: userState.userDetails.username,
    dateTimeUpdated: new Date().getTime(),
    medicineList: medicineList,
  };

  async function handleSubmitMedication(e) {
    e.preventDefault();

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

    if (openForm.action === "add") {
      const medicineId = uuid().slice(0, 5);
      let medicineData = {
        id: medicineId,
        name: name,
        dose: parseInt(dose),
        frequency: frequency,
        note: note,
      };

      setMedicineList((medicine) => [...medicine, medicineData]);
    } else {
      let medicineData = {
        id: medicineId,
        name: name,
        dose: parseInt(dose),
        frequency: frequency,
        note: note,
      };

      setMedicineList((medicineList) =>
        medicineList.filter((medicine) => medicine.id !== medicineId)
      );

      setMedicineList((medicineList) => [medicineData, ...medicineList]);
    }

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
        medicineList.filter(
          (med) => med.medicineId !== selectedMedicine[i].medicineId
        )
      );
    }
  }

  async function selectMedicine(row) {
    setName(row.row.name);
    setDose(row.row.dose);
    setFrequency(row.row.frequency);
    setNote(row.row.note);
    setMedicineId(row.row.id);

    setOpenForm({
      open: true,
      action: "edit",
    });
  }

  function setSelectedMedicineList(ids, data) {
    const selectedIDs = new Set(ids);
    const selectedRowData = data.filter((row) => selectedIDs.has(row.id));
    setSelectedMedicine(selectedRowData);

    // dispatch({
    //   type: "SELECT_AND_SET_SELECTED_PATIENT_LIST_TO_DELETE",
    //   payload: selectedRowData,
    // });
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
              Allergy {hasAllergy ? <GoPrimitiveDot /> : ""}
            </div>
            <div
              onClick={() => {
                navigate(`/dashboard/patient/${params.patientId}/bloodThinner`);
              }}
            >
              Blood Thinner / Clot preventer
            </div>
          </div>
        </div>

        <Table
          style={style}
          className="medicationTable"
          columns={columns}
          data={medicineList}
          clickRowFunction={selectMedicine}
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
            className="saveMedication"
            onClick={(e) => handleSubmitMedication(e)}
          >
            Save
          </button>
          <button
            className="medBackBtn"
            onClick={() => {
              navigate(`/dashboard/patient/${params.patientId}`);
              pageDispatch({
                type: "SET_CURRENT_PAGE",
                payload: "Patient Details",
              });
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
              <label>Name: </label>
              <select
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
              </select>
            </div>
            <div>
              <label>Dose (in mg): </label>
              <input
                type="text"
                name="dose"
                placeholder="Enter dose in mg"
                value={dose}
                onChange={(e) => {
                  setDose(e.target.value);
                }}
                required
              />
            </div>
            <div>
              <label>Frequency: </label>
              <select
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
              </select>
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
