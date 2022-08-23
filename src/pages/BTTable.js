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
  updateCreatinineRecord,
  updateInrRecord,
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
  const [inrRecordId, setInrRecordId] = useState("");
  const [selectedInr, setSelectedInr] = useState();
  const [inrRecordList, setInrRecordList] = useState(
    patientState.bloodThinner.inrRecord
      ? patientState.bloodThinner.inrRecord
      : []
  );
  const [openWeeklyDose, setOpenWeeklyDose] = useState(false);
  const [openInrForm, setOpenInrForm] = useState({
    open: false,
    action: "add",
  });

  // Creatinine Clearance
  const [dose, setDose] = useState(
    patientState.bloodThinner.dose ? patientState.bloodThinner.dose : ""
  );
  const age = patientState.currentPatient.age
    ? patientState.currentPatient.age
    : 0;
  const gender = patientState.currentPatient.gender
    ? patientState.currentPatient.gender
    : "";
  const [weight, setWeight] = useState(0);
  const [serumCreatinine, setSerumCreatinine] = useState(0);
  const [creatinineClearance, setCreatinineClearance] = useState("");
  const [creatinineRecordId, setCreatinineRecordId] = useState("");
  const [selectedCreatinine, setSelectedCreatinine] = useState();
  const [creatinineRecordList, setCreatinineRecordList] = useState(
    patientState.bloodThinner.creatinineRecord
      ? patientState.bloodThinner.creatinineRecord
      : []
  );
  const [openCreatinineForm, setOpenCreatinineForm] = useState({
    open: false,
    action: "add",
  });

  const anticoagulant = patientState.bloodThinner.anticoagulant
    ? patientState.bloodThinner.anticoagulant
    : "";
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

  // INR (Warfarin)
  const inrColumns: GridColDef[] = [
    { field: "id", headerName: "No.", width: 50, hide: true },
    {
      field: "inrRecordId",
      headerName: "INR Id",
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
              onClick={() => selectInrData(params.row)}
            >
              Edit
            </button>
          </div>
        );
      },
    },
  ];

  function handleAddOrEditInrData(e) {
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

    if (openInrForm.action === "add") {
      const inrRecordId = uuid().slice(0, 5);
      let inrRecordData = {
        id: inrRecordId,
        date: date,
        inr: inr,
        weeklyDoses: arr,
        totalDose: totalDoseAmount,
        duration: duration,
        note: note,
      };

      setInrRecordList((inrRecordList) => [...inrRecordList, inrRecordData]);
    } else {
      let inrRecordData = {
        id: inrRecordId,
        date: date,
        inr: inr,
        weeklyDoses: arr,
        totalDose: totalDoseAmount,
        duration: duration,
        note: note,
      };

      setInrRecordList((inrRecordList) =>
        inrRecordList.filter((inr) => inr.id !== inrRecordId)
      );

      setInrRecordList((inrRecordList) => [...inrRecordList, inrRecordData]);
    }

    // sort
    setInrRecordList((inrRecordList) =>
      [...inrRecordList].sort((a, b) => (a.date > b.date ? 1 : -1))
    );

    setOpenInrForm({
      open: false,
      action: "",
    });
    resetInrForm();
  }

  function handleDeleteInrData() {
    for (let i = 0; i < selectedInr.length; i++) {
      setInrRecordList((inrRecordList) =>
        inrRecordList.filter((bt) => bt.id !== selectedInr[i].id)
      );
    }
  }

  async function selectInrData(row) {
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
    setInrRecordId(row.id);

    setOpenInrForm({
      open: true,
      action: "edit",
    });
  }

  function setSelectedInrDataList(ids, data) {
    const selectedIDs = new Set(ids);
    const selectedRowData = data.filter((row) => selectedIDs.has(row.id));
    setSelectedInr(selectedRowData);
  }

  async function handleSubmitInrData(e) {
    e.preventDefault();

    let inrRecordData = {
      nameUpdated: userState.userDetails.username,
      dateTimeUpdated: new Date().getTime(),
      inrRecord: inrRecordList,
    };

    if (window.confirm("Are you sure you want to continue?")) {
      await updateInrRecord(inrRecordData, patientId);
      await setCurrentPatient(patientDispatch, patientId);
      alert("Update patient's blood thinner record table successfully.");
    } else {
      return;
    }
  }

  // Creatinine Clearance (Dabigatran, Apixaban, Rivaroxaban)
  const creatinineColumns: GridColDef[] = [
    { field: "id", headerName: "No.", width: 50, hide: true },
    {
      field: "creatinineId",
      headerName: "Creatinine Id",
      width: 215,
      hide: true,
    },
    {
      field: "date",
      headerName: "Date",
      // flex: 1,
      width: 130,
    },
    {
      field: "age",
      headerName: "Age",
      // flex: 1,
      width: 80,
    },
    {
      field: "weight",
      headerName: "Body weight",
      // flex: 1,
      width: 130,
    },
    {
      field: "serumCreatinine",
      headerName: "Serum Creatinine (mg/dl)",
      flex: 1,
    },
    {
      field: "creatinineClearance",
      headerName: "Creatinine Clearance (mls/min)",
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
      // flex: 1,
      width: 120,
      sortable: false,
      renderCell: (params) => {
        return (
          <div style={{ width: "100%", textAlign: "center" }}>
            <button
              className="editINRAction"
              onClick={() => selectCreatinineData(params.row)}
            >
              Edit
            </button>
          </div>
        );
      },
    },
  ];

  function handleAddOrEditCreatinineData(e) {
    e.preventDefault();

    console.log("cc", creatinineClearance);
    if (openCreatinineForm.action === "add") {
      const creatinineRecordId = uuid().slice(0, 5);
      let creatinineRecordData = {
        id: creatinineRecordId,
        age: age,
        date: date,
        weight: weight,
        serumCreatinine: serumCreatinine,
        creatinineClearance: creatinineClearance,
        note: note,
      };

      setCreatinineRecordList((creatinineRecordList) => [
        ...creatinineRecordList,
        creatinineRecordData,
      ]);
    } else {
      let creatinineRecordData = {
        id: creatinineRecordId,
        age: age,
        date: date,
        weight: weight,
        serumCreatinine: serumCreatinine,
        creatinineClearance: creatinineClearance,
        note: note,
      };

      setCreatinineRecordList((creatinineRecordList) =>
        creatinineRecordList.filter(
          (record) => record.id !== creatinineRecordId
        )
      );

      setCreatinineRecordList((creatinineRecordList) => [
        ...creatinineRecordList,
        creatinineRecordData,
      ]);
    }

    // sort
    setCreatinineRecordList((creatinineRecordList) =>
      [...creatinineRecordList].sort((a, b) => (a.date > b.date ? 1 : -1))
    );

    setOpenCreatinineForm({
      open: false,
      action: "",
    });
    resetCreatinineForm();
  }

  function selectCreatinineData(row) {
    setDate(row.date);
    setWeight(row.weight);
    setSerumCreatinine(row.serumCreatinine);
    setCreatinineClearance(row.creatinineClearance);
    setNote(row.note);
    setCreatinineRecordId(row.id);

    setOpenCreatinineForm({
      open: true,
      action: "edit",
    });
  }

  function setSelectedCreatinineDataList(ids, data) {
    const selectedIDs = new Set(ids);
    const selectedRowData = data.filter((row) => selectedIDs.has(row.id));
    setSelectedCreatinine(selectedRowData);
  }

  function handleDeleteCreatinineData() {
    for (let i = 0; i < selectedCreatinine.length; i++) {
      setCreatinineRecordList((creatinineRecordList) =>
        creatinineRecordList.filter(
          (record) => record.id !== selectedCreatinine[i].id
        )
      );
    }
  }

  async function handleSubmitCreatinineData(e) {
    e.preventDefault();

    console.log(creatinineRecordList.length);
    if (creatinineRecordList.length === 0) {
      setDose();
    }

    let creatinineRecordData = {
      nameUpdated: userState.userDetails.username,
      dateTimeUpdated: new Date().getTime(),
      creatinineRecord: creatinineRecordList,
      dose: dose,
    };

    if (window.confirm("Are you sure you want to continue?")) {
      await updateCreatinineRecord(creatinineRecordData, patientId);
      await setCurrentPatient(patientDispatch, patientId);
      alert("Update patient's blood thinner record table successfully.");
    } else {
      return;
    }
  }

  function resetInrForm() {
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
    setInrRecordId("");
  }

  function resetCreatinineForm() {
    setDate("");
    setWeight("");
    setSerumCreatinine("");
    setCreatinineClearance("");
    setNote("");
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="bttable">
      <div style={{ padding: "20px 50px", height: "80%" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1>{capitalizeFirstLetter(anticoagulant)} record table</h1>
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

        {anticoagulant !== "warfarin" && anticoagulant === "rivaroxaban" && (
          <div className="otherDose">
            <label>Dose: </label>
            <div>
              <input
                type="checkbox"
                checked={dose === "15mg once daily" ? true : false}
                onChange={() => {
                  setDose("15mg once daily");
                }}
              />
              <p>15mg once daily</p>
            </div>
            <div>
              <input
                type="checkbox"
                checked={dose === "15mg twice a day" ? true : false}
                onChange={() => {
                  setDose("15mg twice a day");
                }}
              />
              <p>15mg twice a day</p>
            </div>
            <div>
              <input
                type="checkbox"
                checked={dose === "20mg twice a day" ? true : false}
                onChange={() => {
                  setDose("20mg twice a day");
                }}
              />
              <p>20mg twice a day</p>
            </div>
          </div>
        )}

        {anticoagulant !== "warfarin" && anticoagulant !== "rivaroxaban" && (
          <div className="otherDose">
            <label>Dose: </label>
            <div>
              <input
                type="checkbox"
                checked={dose === "110mg twice a day" ? true : false}
                onChange={() => {
                  setDose("110mg twice a day");
                }}
              />
              <p>110mg twice a day</p>
            </div>
            <div>
              <input
                type="checkbox"
                checked={dose === "150mg twice a day" ? true : false}
                onChange={() => {
                  setDose("150mg twice a day");
                }}
              />
              <p>150mg twice a day</p>
            </div>
          </div>
        )}

        {anticoagulant === "warfarin" ? (
          <Table
            style={style}
            className="bloodThinnerTable"
            columns={inrColumns}
            data={inrRecordList}
            clickRowFunction={() => {}}
            selectFunction={setSelectedInrDataList}
            toolbar={false}
            gridStyle={gridStyle}
            density="standard"
          />
        ) : (
          <Table
            style={style}
            className="bloodThinnerTable"
            columns={creatinineColumns}
            data={creatinineRecordList}
            clickRowFunction={() => {}}
            selectFunction={setSelectedCreatinineDataList}
            toolbar={false}
            gridStyle={gridStyle}
            density="standard"
          />
        )}
      </div>

      {/* INR form or Creatine form */}
      {anticoagulant === "warfarin" ? (
        <>
          <div className="addAndDeleteBtButton">
            <button className="deleteBt" onClick={() => handleDeleteInrData()}>
              <MdDelete />
              Delete
            </button>
            <button
              className="addBt"
              onClick={() => {
                setOpenInrForm({
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
            className="saveOrCancelBtBtn"
            style={{
              position: "absolute",
              bottom: "25px",
              // left: "50px",
              right: "35px",
              display: "flex",
            }}
          >
            <button className="saveBt" onClick={(e) => handleSubmitInrData(e)}>
              Save
            </button>
            <button
              className="btBackBtn"
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
          </div>

          {openWeeklyDose && (
            <div className="weeklyDoseData">
              <div>
                <h3>Weekly Dose: </h3>
                <IoClose
                  onClick={() => {
                    setOpenWeeklyDose(false);
                    resetInrForm();
                  }}
                />
              </div>
              <label>
                Sunday: <p>{sun} mg</p>
              </label>
              <label>
                Monday: <p>{mon} mg</p>
              </label>
              <label>
                Tuesday: <p>{tues} mg</p>
              </label>
              <label>
                Wednesday: <p>{wed} mg</p>
              </label>
              <label>
                Thursday: <p>{thur} mg</p>
              </label>
              <label>
                Friday: <p>{fri} mg</p>
              </label>
              <label>
                Saturday: <p>{sat} mg</p>
              </label>
              <div style={{ padding: "5px 3px" }}>
                <h4>Total: </h4>
                <h4>{totalDose} mg</h4>
              </div>
            </div>
          )}

          <div className={openInrForm.open ? "btBg" : ""}></div>
          <div className={openWeeklyDose ? "btBg" : ""}></div>

          <div
            className={`bloodThinnerTableForm ${
              openInrForm.open ? "popup" : ""
            }`}
          >
            <form
              className="addOrEditBloodThinnerForm"
              onSubmit={(e) => handleAddOrEditInrData(e)}
            >
              <IoClose
                className="closeForm"
                onClick={() => {
                  setOpenInrForm({
                    open: false,
                    action: "",
                  });
                  resetInrForm();
                }}
              />
              <h1>{openInrForm.action === "add" ? "Add" : "Edit"} INR</h1>
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
                      <span>
                        <input
                          type="number"
                          value={sun}
                          onChange={(e) => setSun(parseFloat(e.target.value))}
                        />
                        <p>mg</p>
                      </span>
                    </div>
                    <div>
                      <label>Monday:</label>
                      <span>
                        <input
                          type="number"
                          value={mon}
                          onChange={(e) => setMon(parseFloat(e.target.value))}
                        />
                        <p>mg</p>
                      </span>
                    </div>
                  </div>
                  <div className="weeklyDoseRow">
                    <div>
                      <label>Tuesday:</label>
                      <span>
                        <input
                          type="number"
                          value={tues}
                          onChange={(e) => setTues(parseFloat(e.target.value))}
                        />
                        <p>mg</p>
                      </span>
                    </div>
                    <div>
                      <label>Wednesday:</label>
                      <span>
                        <input
                          type="number"
                          value={wed}
                          onChange={(e) => setWed(parseFloat(e.target.value))}
                        />
                        <p>mg</p>
                      </span>
                    </div>
                  </div>
                  <div className="weeklyDoseRow">
                    <div>
                      <label>Thursday:</label>
                      <span>
                        <input
                          type="number"
                          value={thur}
                          onChange={(e) => setThur(parseFloat(e.target.value))}
                        />
                        <p>mg</p>
                      </span>
                    </div>
                    <div>
                      <label>Friday:</label>
                      <span>
                        <input
                          type="number"
                          value={fri}
                          onChange={(e) => setFri(parseFloat(e.target.value))}
                        />
                        <p>mg</p>
                      </span>
                    </div>
                  </div>
                  <div className="weeklyDoseRow">
                    <div>
                      <label>Saturday:</label>
                      <span>
                        <input
                          type="number"
                          value={sat}
                          onChange={(e) => setSat(parseFloat(e.target.value))}
                        />
                        <p>mg</p>
                      </span>
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
                <p>{openInrForm.action === "add" ? "Add" : "Update"}</p>
              </button>
            </form>
          </div>
        </>
      ) : (
        <>
          <div className="addAndDeleteBtButton">
            <button
              className="deleteBt"
              onClick={() => handleDeleteCreatinineData()}
            >
              <MdDelete />
              Delete
            </button>
            <button
              className="addBt"
              onClick={() => {
                setOpenCreatinineForm({
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
            className="saveOrCancelBtBtn"
            style={{
              position: "absolute",
              bottom: "25px",
              // left: "50px",
              right: "35px",
              display: "flex",
            }}
          >
            <button
              className="saveBt"
              onClick={(e) => handleSubmitCreatinineData(e)}
            >
              Save
            </button>
            <button
              className="btBackBtn"
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
          </div>

          <div className={openCreatinineForm.open ? "btBg" : ""}></div>

          <div
            className={`creatinineTableForm ${
              openCreatinineForm.open ? "popup" : ""
            }`}
          >
            <form
              className="addOrEditCreatinineForm"
              onSubmit={(e) => handleAddOrEditCreatinineData(e)}
            >
              <IoClose
                className="closeForm"
                onClick={() => {
                  setOpenCreatinineForm({
                    open: false,
                    action: "",
                  });
                  resetCreatinineForm();
                }}
              />
              <h1>
                {openCreatinineForm.action === "add" ? "Add" : "Edit"}{" "}
                Creatinine Clearance
              </h1>
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
                <div>
                  <label>Body weight: </label>
                  <input
                    type="number"
                    name="weight"
                    placeholder="Enter body weight"
                    value={weight}
                    onChange={(e) => {
                      setWeight(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div>
                <label>Serum Creatinine: </label>
                <input
                  type="number"
                  name="serumCreatinine"
                  placeholder="Enter serum creatinine"
                  value={serumCreatinine}
                  onChange={(e) => {
                    setSerumCreatinine(e.target.value);
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
                <p>{openCreatinineForm.action === "add" ? "Add" : "Update"}</p>
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default BTTable;
