import React, { useState } from "react";
import { MdAdd, MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import Table from "../components/Table";
import { usePageDispatch, usePatientState } from "../context";

function BTTable() {
  const navigate = useNavigate();
  const params = useParams();
  const pageDispatch = usePageDispatch();
  const patientState = usePatientState();

  const [date, setDate] = useState("");
  const [bt, setBt] = useState("");
  const [dose, setDose] = useState("");
  const [duration, setDuration] = useState("");
  const [note, setNote] = useState("");
  const [openForm, setOpenForm] = useState({
    open: false,
    action: "add",
  });

  const [selectedMedicine, setSelectedMedicine] = useState(
    patientState.bloodThinner.selectedMedicine
      ? patientState.bloodThinner.selectedMedicine
      : ""
  );

  const style = {
    height: "80%",
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
      field: "bloodThinnerId",
      headerName: "Blood Thinner Id",
      width: 215,
      hide: true,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "bloodThinner",
      headerName: "INR",
      flex: 1,
    },
    {
      field: "dose",
      headerName: "Dose",
      flex: 1,
    },
    {
      field: "duration",
      headerName: "Duration",
      flex: 1,
    },
    {
      field: "note",
      headerName: "Notes",
      flex: 1,
    },
  ];

  const data = [
    {
      id: 1,
      bloodThinnerId: 123,
      bloodThinner: "1.2",
      date: "2022.7.22",
      dose: "2.5",
      duration: "1 month",
      note: "test",
    },
  ];

  async function selectBloodThinner(row) {
    setDate(row.row.date);
    setBt(row.row.bt);
    setDose(row.row.dose);
    setDuration(row.row.duration);
    setNote(row.row.note);
    // setMedicineId(row.row.medicineId);

    setOpenForm({
      open: true,
      action: "edit",
    });
  }

  return (
    <div className="bttable">
      <div style={{ padding: "20px 50px", height: "80%" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1>INR record table</h1>
          <div className="lastUpdatedBox">
            <div>
              <h4>
                <span>Last updated by</span>
                <span>:</span>
              </h4>
              <p>ys</p>
            </div>
            <div>
              <h4>
                <span>Last updated on</span>
                <span>:</span>
              </h4>
              <p>2022/7/22</p>
            </div>
          </div>
        </div>

        <Table
          style={style}
          className="bloodThinnerTable"
          columns={columns}
          data={data}
          clickRowFunction={selectBloodThinner}
          selectFunction={() => {}}
          toolbar={false}
          gridStyle={gridStyle}
        />
      </div>

      <div className="addAndDeleteMedicationButton">
        <button
          className="deleteMedication"
          //   onClick={() => handleDeleteMedication()}
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

      <div
        className="saveOrCancelMedBtn"
        style={{
          position: "absolute",
          bottom: "25px",
          // left: "50px",
          right: "35px",
          display: "flex",
        }}
      >
        <button
          className="saveMedication"
          //   onClick={(e) => handleSubmitMedication(e)}
        >
          Save
        </button>
        <button
          className="medBackBtn"
          onClick={() => {
            navigate(`/dashboard/patient/${params.patientId}/bloodThinner`);
            pageDispatch({
              type: "SET_CURRENT_PAGE",
              payload: "Blood Thinner / Clot Preventer",
            });
          }}
          style={{ padding: "7px 20px" }}
        >
          Back
        </button>

        <div className={openForm.open ? "btBg" : ""}></div>

        <div
          className={`bloodThinnerTableForm ${openForm.open ? "popup" : ""}`}
        >
          <form
            className="addOrEditBloodThinnerForm"
            // onSubmit={(e) => handleAddOrEditMedication(e)}
          >
            <IoClose
              className="closeForm"
              onClick={() => {
                setOpenForm({
                  open: false,
                  action: "",
                });
                setDate("");
                setBt("");
                setDose("");
                setDuration("");
                setNote("");
              }}
            />
            <h1>{openForm.action === "add" ? "Add" : "Edit"} INR</h1>
            <div>
              <label>Date: </label>
              <input
                type="date"
                placeholder="Enter date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
                required
              />
            </div>
            <div>
              <label>INR: </label>
              <input
                type="text"
                name="bt"
                placeholder="Enter blood thinner"
                value={bt}
                onChange={(e) => {
                  setBt(e.target.value);
                }}
                required
              />
            </div>
            <div>
              <label>Dose: </label>
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
              <label>Duration: </label>
              <input
                type="text"
                name="duration"
                placeholder="Enter duration"
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                }}
                required
              />
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
              <p>
                {openForm.action === "add" ? "Add" : "Update"} blood thinner
              </p>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BTTable;
