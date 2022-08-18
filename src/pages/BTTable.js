import React, { useState } from "react";
import { MdAdd, MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import Table from "../components/Table";
import {
  useAuthState,
  usePageDispatch,
  usePatientDispatch,
  usePatientState,
} from "../context";
import { v4 as uuid } from "uuid";
import {
  setCurrentPatient,
  updateBloodThinnerRecord,
} from "../service/PatientService";
import { getCurrentDate, getCurrentTime } from "../utils";

function BTTable() {
  const navigate = useNavigate();
  const params = useParams();
  const pageDispatch = usePageDispatch();
  const patientState = usePatientState();
  const patientDispatch = usePatientDispatch();
  const patientId = params.patientId;
  const userState = useAuthState();

  // INR
  const [date, setDate] = useState("");
  const [inr, setInr] = useState("");
  const [sun, setSun] = useState(0);
  const [mon, setMon] = useState(0);
  const [tues, setTues] = useState(0);
  const [wed, setWed] = useState(0);
  const [thur, setThur] = useState(0);
  const [fri, setFri] = useState(0);
  const [sat, setSat] = useState(0);
  const [weeklyDoses, setWeeklyDoses] = useState([]);
  const [totalDose, setTotalDose] = useState(0);
  const [duration, setDuration] = useState("");
  const [note, setNote] = useState("");
  const [bloodThinnerId, setBloodThinnerId] = useState("");
  const [selectedBloodThinner, setSelectedBloodThinner] = useState();
  const [bloodThinnerList, setBloodThinnerList] = useState(
    patientState.bloodThinner.record ? patientState.bloodThinner.record : []
  );

  // Creatinine Clearance

  const [openWeeklyDose, setOpenWeeklyDose] = useState(false);
  const [openForm, setOpenForm] = useState({
    open: false,
    action: "add",
  });

  const [selectedMedicine, setSelectedMedicine] = useState(
    patientState.bloodThinner.selectedMedicine
      ? patientState.bloodThinner.selectedMedicine
      : ""
  );

  const dateTimeUpdated = patientState.bloodThinner.dateTimeUpdated
    ? patientState.bloodThinner.dateTimeUpdated
    : "";

  const style = {
    height: "80%",
    width: "100%",
    margin: "auto",
  };

  const gridStyle = {
    minHeight: "600",
    fontSize: "16px",
    fontWeight: "normal",
    marginTop: "15px",
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
      field: "inr",
      headerName: "INR",
      flex: 1,
    },
    {
      field: "weeklyDoses",
      headerName: "Weekly Doses",
      hide: true,
    },
    {
      field: "totalDose",
      headerName: "Total Dose (in mg)",
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="totalDose">
            <p
              onClick={() => {
                setOpenWeeklyDose(true);
                setSun(params.row.weeklyDoses[0]);
                setMon(params.row.weeklyDoses[1]);
                setTues(params.row.weeklyDoses[2]);
                setWed(params.row.weeklyDoses[3]);
                setThur(params.row.weeklyDoses[4]);
                setFri(params.row.weeklyDoses[5]);
                setSat(params.row.weeklyDoses[6]);
                setTotalDose(params.row.totalDose);
              }}
            >
              {params.value}
            </p>
          </div>
        );
      },
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
    {
      field: "button",
      headerName: "Action",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <div style={{ width: "100%", textAlign: "center" }}>
            <button
              className="editINRAction"
              onClick={() => selectBloodThinner(params.row)}
            >
              Edit
            </button>
          </div>
        );
      },
    },
  ];

  function handleAddOrEditBloodThinner(e) {
    e.preventDefault();

    let arr = [];
    arr.push(sun);
    arr.push(mon);
    arr.push(tues);
    arr.push(wed);
    arr.push(thur);
    arr.push(fri);
    arr.push(sat);
    console.log(arr);

    let totalDoseAmount = 0;
    arr.forEach((a) => (totalDoseAmount += a));
    console.log("total", totalDoseAmount);

    if (openForm.action === "add") {
      const bloodThinnerId = uuid().slice(0, 5);
      let bloodThinnerData = {
        id: bloodThinnerId,
        date: date,
        inr: inr,
        weeklyDoses: arr,
        totalDose: totalDoseAmount,
        duration: duration,
        note: note,
      };

      setBloodThinnerList((bloodThinner) => [
        ...bloodThinner,
        bloodThinnerData,
      ]);
    } else {
      let bloodThinnerData = {
        id: bloodThinnerId,
        date: date,
        inr: inr,
        weeklyDoses: arr,
        totalDose: totalDoseAmount,
        duration: duration,
        note: note,
      };

      setBloodThinnerList((bloodThinnerList) =>
        bloodThinnerList.filter(
          (bloodThinner) => bloodThinner.id !== bloodThinnerId
        )
      );

      setBloodThinnerList((bloodThinner) => [
        ...bloodThinner,
        bloodThinnerData,
      ]);
    }

    setBloodThinnerList((bloodThinnerList) =>
      [...bloodThinnerList].sort((a, b) => (a.date > b.date ? 1 : -1))
    );

    setOpenForm({
      open: false,
      action: "",
    });
    resetForm();
  }

  function handleDeleteBloodThinner() {
    for (let i = 0; i < selectedBloodThinner.length; i++) {
      setBloodThinnerList((bloodThinnerList) =>
        bloodThinnerList.filter((bt) => bt.id !== selectedBloodThinner[i].id)
      );
    }
  }

  async function selectBloodThinner(row) {
    setDate(row.date);
    setInr(row.inr);
    setSun(row.weeklyDoses[0]);
    setMon(row.weeklyDoses[1]);
    setTues(row.weeklyDoses[2]);
    setWed(row.weeklyDoses[3]);
    setThur(row.weeklyDoses[4]);
    setFri(row.weeklyDoses[5]);
    setSat(row.weeklyDoses[6]);
    setTotalDose(row.totalDose);
    setDuration(row.duration);
    setNote(row.note);
    setBloodThinnerId(row.id);

    setOpenForm({
      open: true,
      action: "edit",
    });
  }

  function setSelectedBloodThinnerList(ids, data) {
    const selectedIDs = new Set(ids);
    const selectedRowData = data.filter((row) => selectedIDs.has(row.id));
    setSelectedBloodThinner(selectedRowData);
  }

  async function handleSubmitBloodThinner(e) {
    e.preventDefault();

    let bloodThinnerRecordData = {
      nameUpdated: userState.userDetails.username,
      dateTimeUpdated: new Date().getTime(),
      record: bloodThinnerList,
    };

    if (window.confirm("Are you sure you want to continue?")) {
      await updateBloodThinnerRecord(bloodThinnerRecordData, patientId);
      await setCurrentPatient(patientDispatch, patientId);
      alert("Update patient's blood thinner record table successfully.");
    } else {
      return;
    }
  }

  function resetForm() {
    setDate("");
    setInr("");
    setSun(0);
    setMon(0);
    setTues(0);
    setWed(0);
    setThur(0);
    setFri(0);
    setSat(0);
    setTotalDose("");
    setDuration("");
    setNote("");
    setBloodThinnerId("");
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
              <p>{patientState.bloodThinner.nameUpdated}</p>
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
        </div>

        <Table
          style={style}
          className="bloodThinnerTable"
          columns={columns}
          data={bloodThinnerList}
          clickRowFunction={() => {}}
          selectFunction={setSelectedBloodThinnerList}
          toolbar={false}
          gridStyle={gridStyle}
          density="standard"
        />
      </div>

      <div className="addAndDeleteMedicationButton">
        <button
          className="deleteMedication"
          onClick={() => handleDeleteBloodThinner()}
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
          onClick={(e) => handleSubmitBloodThinner(e)}
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

        {/* Show weekly dose */}
        {openWeeklyDose && (
          <div className="weeklyDoseData">
            <div>
              <h3>Weekly Dose: </h3>
              <IoClose
                onClick={() => {
                  setOpenWeeklyDose(false);
                  resetForm();
                }}
              />
            </div>
            <label>
              Sunday: <p>{sun}</p>
            </label>
            <label>
              Monday: <p>{mon}</p>
            </label>
            <label>
              Tuesday: <p>{tues}</p>
            </label>
            <label>
              Wednesday: <p>{wed}</p>
            </label>
            <label>
              Thursday: <p>{thur}</p>
            </label>
            <label>
              Friday: <p>{fri}</p>
            </label>
            <label>
              Saturday: <p>{sat}</p>
            </label>
            <div style={{ padding: "5px 3px" }}>
              <h4>Total: </h4>
              <h4>{totalDose}</h4>
            </div>
          </div>
        )}

        <div className={openForm.open ? "btBg" : ""}></div>
        <div className={openWeeklyDose ? "btBg" : ""}></div>

        <div
          className={`bloodThinnerTableForm ${openForm.open ? "popup" : ""}`}
        >
          <form
            className="addOrEditBloodThinnerForm"
            onSubmit={(e) => handleAddOrEditBloodThinner(e)}
          >
            <IoClose
              className="closeForm"
              onClick={() => {
                setOpenForm({
                  open: false,
                  action: "",
                });
                resetForm();
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
                type="number"
                name="inr"
                placeholder="Enter inr range"
                value={inr}
                onChange={(e) => {
                  setInr(e.target.value);
                }}
                required
              />
            </div>
            <div>
              <div>
                <label>Weekly Dose: </label>
                <div className="weeklyDoseRow">
                  <div>
                    <label>Sunday:</label>
                    <input
                      type="number"
                      value={sun}
                      onChange={(e) => setSun(parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <label>Monday:</label>
                    <input
                      type="number"
                      value={mon}
                      onChange={(e) => setMon(parseFloat(e.target.value))}
                    />
                  </div>
                </div>
                <div className="weeklyDoseRow">
                  <div>
                    <label>Tuesday:</label>
                    <input
                      type="number"
                      value={tues}
                      onChange={(e) => setTues(parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <label>Wednesday:</label>
                    <input
                      type="number"
                      value={wed}
                      onChange={(e) => setWed(parseFloat(e.target.value))}
                    />
                  </div>
                </div>
                <div className="weeklyDoseRow">
                  <div>
                    <label>Thursday:</label>
                    <input
                      type="number"
                      value={thur}
                      onChange={(e) => setThur(parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <label>Friday:</label>
                    <input
                      type="number"
                      value={fri}
                      onChange={(e) => setFri(parseFloat(e.target.value))}
                    />
                  </div>
                </div>
                <div className="weeklyDoseRow">
                  <div>
                    <label>Saturday:</label>
                    <input
                      type="number"
                      value={sat}
                      onChange={(e) => setSat(parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              </div>
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

          <form></form>
        </div>
      </div>
    </div>
  );
}

export default BTTable;
