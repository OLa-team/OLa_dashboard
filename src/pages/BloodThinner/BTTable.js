import React, { useEffect, useState } from "react";
import { MdAdd, MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import Table from "../../components/Table";
import {
  useAuthState,
  usePageDispatch,
  usePatientDispatch,
  usePatientState,
} from "../../context";
import { v4 as uuid } from "uuid";
import {
  setCurrentPatient,
  updateCreatinineRecord,
  updateInrRecord,
  updateNameVerified,
} from "../../service/PatientService";
import {
  convertDateObjToDateInput,
  getCurrentTime,
  getMaxDate,
  parseDate,
  getCurrentDate,
} from "../../utils";

function BTTable() {
  const navigate = useNavigate();
  const params = useParams();
  const pageDispatch = usePageDispatch();
  const patientState = usePatientState();
  const patientDispatch = usePatientDispatch();
  const patientId = params.patientId;
  const currentUserState = useAuthState();

  // INR data state
  const [date, setDate] = useState("");
  const [inr, setInr] = useState("");
  const [mon, setMon] = useState(0);
  const [tues, setTues] = useState(0);
  const [wed, setWed] = useState(0);
  const [thur, setThur] = useState(0);
  const [fri, setFri] = useState(0);
  const [sat, setSat] = useState(0);
  const [sun, setSun] = useState(0);
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
  const inrRange = patientState.bloodThinner.inrRange
    ? patientState.bloodThinner.inrRange
    : "";
  const [openWeeklyDose, setOpenWeeklyDose] = useState(false);
  const [openInrForm, setOpenInrForm] = useState({
    open: false,
    action: "add",
  });

  const [ttrData, setTtrData] = useState({
    daysSinceLastTest: 0,
    inrDiff: 0,
    previousInrWithinRange: "",
    currentInrWithinRange: "",
    scenario: "",
    inrDiffAboveRange: 0,
    inrDiffBelowRange: 0,
    inrDiffWithinRange: 0,
    daysWithinRangeSinceLastTest: 0,
    percentageDaysWithinRangeSinceLastTest: 0,
  });

  const [ttrResult, setTtrResult] = useState({
    percentageDaysWithinRange: 0,
    percentageOfTestsInRange: 0,
  });

  const [percentageDaysWithinRange, setPercentageDaysWithinRange] = useState(0);

  const [percentageOfTestsInRange, setPercentageOfTestsInRange] = useState(0);

  // Creatinine Clearance data state
  const age = patientState.currentPatient.age
    ? patientState.currentPatient.age
    : 0;
  const gender = patientState.currentPatient.gender
    ? patientState.currentPatient.gender
    : "";
  const [weight, setWeight] = useState(0);
  const [serumCreatinine, setSerumCreatinine] = useState(0);
  const [creatinineClearance, setCreatinineClearance] = useState(0);
  const [creatinineRecordId, setCreatinineRecordId] = useState("");
  const [selectedCreatinine, setSelectedCreatinine] = useState();
  const [creatinineRecordList, setCreatinineRecordList] = useState(
    patientState.bloodThinner.creatinineRecord
      ? patientState.bloodThinner.creatinineRecord
      : []
  );
  console.log("creatinineRecordList", creatinineRecordList);
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

  // Table styling
  const styleInrTable = {
    height: "83%",
    width: "100%",
    margin: "auto",
  };

  const styleCCTable = {
    height: "77%",
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
      flex: 0.9,
      renderCell: (params) => {
        return <div>{getCurrentDate(params.row.date)}</div>;
      },
    },
    {
      field: "inr",
      headerName: "INR reading",
      flex: 0.8,
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
                setMon(params.row.weeklyDoses[0]);
                setTues(params.row.weeklyDoses[1]);
                setWed(params.row.weeklyDoses[2]);
                setThur(params.row.weeklyDoses[3]);
                setFri(params.row.weeklyDoses[4]);
                setSat(params.row.weeklyDoses[5]);
                setSun(params.row.weeklyDoses[6]);
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
      flex: 0.8,
    },
    {
      field: "note",
      headerName: "Notes",
      flex: 2.5,
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
    arr.push(mon);
    arr.push(tues);
    arr.push(wed);
    arr.push(thur);
    arr.push(fri);
    arr.push(sat);
    arr.push(sun);

    let totalDoseAmount = 0;
    arr.forEach((a) => (totalDoseAmount += a));

    let newInrRecordData = null;
    if (openInrForm.action === "add") {
      const inrRecordId = uuid().slice(0, 5);
      newInrRecordData = {
        id: inrRecordId,
        date: date,
        inr: parseFloat(inr),
        weeklyDoses: arr,
        totalDose: totalDoseAmount,
        duration: duration,
        note: note,
        ttrData: ttrData,
      };
    } else {
      newInrRecordData = {
        id: inrRecordId,
        date: date,
        inr: parseFloat(inr),
        weeklyDoses: arr,
        totalDose: totalDoseAmount,
        duration: duration,
        note: note,
        ttrData: ttrData,
      };

      setInrRecordList((inrRecordList) =>
        inrRecordList.filter((inr) => inr.id !== inrRecordId)
      );
    }
    setInrRecordList((inrRecordList) => [...inrRecordList, newInrRecordData]);

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

  function calcultateTtrResult() {
    var inrRangeArr = inrRange.trim().split("-");
    var lowRange = parseInt(inrRangeArr[0].trim());
    var highRange = parseInt(inrRangeArr[1].trim());

    for (let i = 0; i < inrRecordList.length; i++) {
      let previousRecord = i > 0 ? inrRecordList[i - 1] : null;
      let currentRecord = inrRecordList[i];

      currentRecord.ttrData = {
        daysSinceLastTest: 0,
        inrDiff: 0,
        previousInrWithinRange: "",
        currentInrWithinRange: "",
        scenario: "",
        inrDiffAboveRange: 0,
        inrDiffBelowRange: 0,
        inrDiffWithinRange: 0,
        daysWithinRangeSinceLastTest: 0,
        percentageDaysWithinRangeSinceLastTest: 0,
      };

      // first element, no previous record
      if (i === 0 && previousRecord === null) {
        if (currentRecord.inr < lowRange)
          currentRecord.ttrData.currentInrWithinRange = "Below";
        else if (currentRecord.inr > highRange)
          currentRecord.ttrData.currentInrWithinRange = "Above";
        else currentRecord.ttrData.currentInrWithinRange = "In Range";

        // console.log("current", currentRecord);
      } else {
        console.log("previous", previousRecord);
        console.log("current", currentRecord);
        // Days Since Last Test
        let diff =
          new Date(currentRecord.date).getTime() -
          new Date(previousRecord.date).getTime();
        currentRecord.ttrData.daysSinceLastTest = Math.ceil(
          diff / (1000 * 3600 * 24)
        );
        // INR Diff
        currentRecord.ttrData.inrDiff =
          Math.round((currentRecord.inr - previousRecord.inr) * 10) / 10;
        // Previous INR Within Range
        currentRecord.ttrData.previousInrWithinRange =
          previousRecord.ttrData.currentInrWithinRange;
        // Current INR Within Range
        if (currentRecord.inr < lowRange)
          currentRecord.ttrData.currentInrWithinRange = "Below";
        else if (currentRecord.inr > highRange)
          currentRecord.ttrData.currentInrWithinRange = "Above";
        else currentRecord.ttrData.currentInrWithinRange = "In Range";
        // Scenario
        currentRecord.ttrData.scenario =
          currentRecord.ttrData.previousInrWithinRange ===
          currentRecord.ttrData.currentInrWithinRange
            ? currentRecord.ttrData.previousInrWithinRange
            : "Calculate";
        // INR Diff Above Range
        if (currentRecord.ttrData.scenario === "Above") {
          currentRecord.ttrData.inrDiffAboveRange = Math.abs(
            currentRecord.ttrData.inrDiff
          );
        } else if (currentRecord.ttrData.previousInrWithinRange === "Above") {
          currentRecord.ttrData.inrDiffAboveRange = Math.abs(
            previousRecord.inr - highRange
          );
        } else if (currentRecord.ttrData.currentInrWithinRange === "Above") {
          currentRecord.ttrData.inrDiffAboveRange = Math.abs(
            currentRecord.inr - highRange
          );
        } else {
          currentRecord.ttrData.inrDiffAboveRange = 0;
        }
        // INR Diff Within Range
        currentRecord.ttrData.inrDiffWithinRange = parseFloat(
          (
            Math.abs(currentRecord.ttrData.inrDiff) -
            Math.abs(currentRecord.ttrData.inrDiffAboveRange) -
            Math.abs(currentRecord.ttrData.inrDiffBelowRange)
          ).toFixed(1)
        );
        // INR Diff Below Range
        if (currentRecord.ttrData.scenario === "Below") {
          currentRecord.ttrData.inrDiffBelowRange = Math.abs(
            currentRecord.ttrData.inrDiff
          );
        } else if (currentRecord.ttrData.previousInrWithinRange === "Below") {
          currentRecord.ttrData.inrDiffBelowRange = Math.abs(
            previousRecord.inr - lowRange
          );
        } else if (currentRecord.ttrData.currentInrWithinRange === "Below") {
          currentRecord.ttrData.inrDiffBelowRange = Math.abs(
            currentRecord.inr - lowRange
          );
        } else {
          currentRecord.ttrData.inrDiffBelowRange = 0;
        }
        // % Days Within Range since last test
        if (currentRecord.ttrData.inrDiff === 0) {
          if (currentRecord.ttrData.currentInrWithinRange === "In Range") {
            currentRecord.ttrData.percentageDaysWithinRangeSinceLastTest = 1;
          } else {
            currentRecord.ttrData.percentageDaysWithinRangeSinceLastTest = 0;
          }
        } else {
          currentRecord.ttrData.percentageDaysWithinRangeSinceLastTest =
            parseFloat(
              currentRecord.ttrData.inrDiffWithinRange /
                Math.abs(currentRecord.ttrData.inrDiff)
            );
        }
        // Days Within Range since last test
        currentRecord.ttrData.daysWithinRangeSinceLastTest = parseFloat(
          (
            currentRecord.ttrData.percentageDaysWithinRangeSinceLastTest *
            currentRecord.ttrData.daysSinceLastTest
          ).toFixed(1)
        );
      }
    }

    let _daysWithinRange = 0;
    let _totalDays = 0;
    let _percentageDaysWithinRange = 0;

    let _totalNumberOfTests = inrRecordList.length;
    let _numberOfTestsInRange = 0;
    let _percentageOfTestsInRange = 0;

    inrRecordList.forEach((record) => {
      _daysWithinRange += record.ttrData.daysWithinRangeSinceLastTest;
      _totalDays += record.ttrData.daysSinceLastTest;

      if (record.ttrData.currentInrWithinRange === "In Range") {
        _numberOfTestsInRange += 1;
      }
    });

    _percentageDaysWithinRange = (_daysWithinRange / _totalDays) * 100;
    _percentageOfTestsInRange =
      (_numberOfTestsInRange / _totalNumberOfTests) * 100;

    setTtrResult({
      percentageDaysWithinRange: _percentageDaysWithinRange,
      percentageOfTestsInRange: _percentageOfTestsInRange,
    });
  }

  function handleDeleteInrData() {
    for (let i = 0; i < selectedInr.length; i++) {
      setInrRecordList((inrRecordList) =>
        inrRecordList.filter((bt) => bt.id !== selectedInr[i].id)
      );
    }
  }

  function selectInrData(row) {
    console.log("row", row);
    setDate(row.date);
    setInr(row.inr);
    setMon(row.weeklyDoses[0]);
    setTues(row.weeklyDoses[1]);
    setWed(row.weeklyDoses[2]);
    setThur(row.weeklyDoses[3]);
    setFri(row.weeklyDoses[4]);
    setSat(row.weeklyDoses[5]);
    setSun(row.weeklyDoses[6]);
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
      nameUpdated: currentUserState.userDetails.username,
      dateTimeUpdated: new Date().getTime(),
      inrRecord: inrRecordList,
      ttrResult: ttrResult,
    };

    if (window.confirm("Are you sure you want to continue?")) {
      await updateInrRecord(inrRecordData, patientId);
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
      flex: 1,
      renderCell: (params) => {
        return <div>{getCurrentDate(params.row.date)}</div>;
      },
    },
    {
      field: "age",
      headerName: "Age",
      flex: 1,
    },
    {
      field: "weight",
      headerName: "Body weight",
      flex: 1,
    },
    {
      field: "serumCreatinine",
      headerName: "Serum Creatinine (mg/dl)",
      flex: 2,
    },
    {
      field: "creatinineClearance",
      headerName: "Creatinine Clearance (mls/min)",
      flex: 2.5,
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
              className="action"
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

    if (gender === "" || age === 0) {
      alert(
        "Please complete the patient's personal information first. (gender/age)"
      );
      return;
    }

    let creatinineRecordData = {};
    if (openCreatinineForm.action === "add") {
      const creatinineRecordId = uuid().slice(0, 5);
      creatinineRecordData = {
        id: creatinineRecordId,
        age: age,
        date: parseDate(date).getTime(),
        weight: parseFloat(weight),
        serumCreatinine: parseFloat(serumCreatinine),
        creatinineClearance: creatinineClearance,
        note: note,
      };
      console.log(creatinineRecordData);
    } else {
      creatinineRecordData = {
        id: creatinineRecordId,
        age: age,
        date: parseDate(date).getTime(),
        weight: parseFloat(weight),
        serumCreatinine: parseFloat(serumCreatinine),
        creatinineClearance: creatinineClearance,
        note: note,
      };
      console.log(creatinineRecordData);

      setCreatinineRecordList((creatinineRecordList) =>
        creatinineRecordList.filter(
          (record) => record.id !== creatinineRecordId
        )
      );
    }
    setCreatinineRecordList((creatinineRecordList) => [
      ...creatinineRecordList,
      creatinineRecordData,
    ]);

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
    setDate(convertDateObjToDateInput(row.date));
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

    let creatinineRecordData = {
      nameUpdated: currentUserState.userDetails.username,
      dateTimeUpdated: new Date().getTime(),
      creatinineRecord: creatinineRecordList,
    };

    if (window.confirm("Are you sure you want to continue?")) {
      await updateCreatinineRecord(creatinineRecordData, patientId);
      await setCurrentPatient(patientDispatch, patientId);
      alert("Update patient's blood thinner record table successfully.");
    } else {
      return;
    }
  }

  function resetCreatinineForm() {
    setDate("");
    setWeight(0);
    setSerumCreatinine(0);
    setCreatinineClearance(0);
    setNote("");
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function calculateCreatinineClearance() {
    if (weight !== 0 && serumCreatinine !== 0) {
      let genderFactor = gender === "male" ? 1.23 : 1.04;
      let result =
        ((140 - age) * parseFloat(weight) * genderFactor) /
        parseFloat(serumCreatinine);
      setCreatinineClearance(Math.round(result));
    }
  }

  async function verifyData() {
    if (window.confirm("Are you sure to verify?")) {
      await updateNameVerified(
        "blood_thinner",
        patientId,
        currentUserState.userDetails.username
      );
      await setCurrentPatient(patientDispatch, patientId);
    }
  }

  useEffect(() => {
    calculateCreatinineClearance();
  }, [weight, serumCreatinine]);

  useEffect(() => {
    if (anticoagulant === "warfarin") {
      calcultateTtrResult();
    }
  }, [inrRecordList]);

  function restrictNegativeValue(value, day) {
    if (parseFloat(value) < 0) {
      alert("The value cannot be negative, please try again.");
      return;
    } else {
      if (day === "Sun") setSun(parseFloat(value));
      else if (day === "Mon") setMon(parseFloat(value));
      else if (day === "Tues") setTues(parseFloat(value));
      else if (day === "Wed") setWed(parseFloat(value));
      else if (day === "Thur") setThur(parseFloat(value));
      else if (day === "Fri") setFri(parseFloat(value));
      else if (day === "Sat") setSat(parseFloat(value));
    }
  }

  return (
    <div className="wrapper">
      <div style={{ padding: "20px 50px", height: "80%" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h1>{capitalizeFirstLetter(anticoagulant)} record table</h1>
            <button
              onClick={() => {
                navigate(
                  `/dashboard/patient/${params.patientId}/bloodThinner/graph`
                );
              }}
              style={{
                marginLeft: "20px",
                padding: "8px 15px",
                borderRadius: "15px",
                outline: "none",
                border: "1px solid black",
                color: "white",
                background: "black",
                cursor: "pointer",
              }}
            >
              Graph
            </button>
          </div>
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
                <span>Last verified by</span>
                <span>:</span>
              </h4>
              <p>{patientState.bloodThinner.nameVerified}</p>
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

        {anticoagulant === "warfarin" ? (
          <Table
            style={styleInrTable}
            className="bloodThinnerTable"
            columns={inrColumns}
            data={inrRecordList}
            clickRowFunction={() => {}}
            selectFunction={setSelectedInrDataList}
            toolbar={false}
            gridStyle={gridStyle}
            density="standard"
            checkboxSelection={true}
          />
        ) : (
          <Table
            style={styleCCTable}
            className="bloodThinnerTable"
            columns={creatinineColumns}
            data={creatinineRecordList}
            clickRowFunction={() => {}}
            selectFunction={setSelectedCreatinineDataList}
            toolbar={false}
            gridStyle={gridStyle}
            density="standard"
            checkboxSelection={true}
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

          <div className="saveOrCancelBtBtn">
            <button
              className="verifyBtn"
              type="button"
              onClick={() => verifyData()}
            >
              Verify
            </button>
            <button className="saveBt" onClick={(e) => handleSubmitInrData(e)}>
              Save
            </button>
            <button
              className="btBackBtn"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure to exit this page? \nPlease ensure you have saved all the changes before leaving this page. "
                  )
                ) {
                  navigate(
                    `/dashboard/patient/${params.patientId}/bloodThinner`
                  );
                  pageDispatch({
                    type: "SET_CURRENT_PAGE",
                    payload: "Blood Thinner / Clot Preventer",
                  });
                }
              }}
              style={{ padding: "7px 20px" }}
            >
              Back
            </button>
          </div>

          {openWeeklyDose && (
            <div className="weeklyDoseData">
              <div>
                <h3>New Weekly Dose: </h3>
                <IoClose
                  onClick={() => {
                    setOpenWeeklyDose(false);
                    resetInrForm();
                  }}
                />
              </div>
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
              <label>
                Sunday: <p>{sun} mg</p>
              </label>
              <div style={{ padding: "5px 3px" }}>
                <h4>Total: </h4>
                <h4>{totalDose} mg</h4>
              </div>
            </div>
          )}

          <div
            className={openWeeklyDose || openInrForm.open ? "btBg" : ""}
          ></div>

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
              <h1>{openInrForm.action === "add" ? "New" : "Edit"} Record</h1>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ width: "100%" }}>
                  <div className="btInputWrapper">
                    <label>Date: </label>
                    <input
                      type="date"
                      placeholder="Enter date"
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                      }}
                      required
                      max={getMaxDate()}
                    />
                  </div>
                  <div className="btInputWrapper">
                    <label>INR reading: </label>
                    <input
                      type="number"
                      name="inr"
                      placeholder="Enter inr reading"
                      value={inr}
                      onChange={(e) => {
                        setInr(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="btInputWrapper">
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
                  <div className="btInputWrapper">
                    <label>Notes: </label>
                    <textarea
                      type="text"
                      name="note"
                      className="noteInput"
                      placeholder="'i.e.: missed dose, bleeding episode, meds stopped/ withheld, drug interaction"
                      value={note}
                      onChange={(e) => {
                        setNote(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div style={{ width: "700px", paddingLeft: "10px" }}>
                  <label>New Weekly Dose: </label>
                  <div className="weeklyDoseRow">
                    <div className="btInputWrapper">
                      <label>Monday:</label>
                      <span>
                        <input
                          type="number"
                          value={mon}
                          onChange={(e) => {
                            restrictNegativeValue(e.target.value, "Mon");
                          }}
                          // min={0}
                        />
                        <p>mg</p>
                      </span>
                    </div>
                    <div className="btInputWrapper">
                      <label>Tuesday:</label>
                      <span>
                        <input
                          type="number"
                          value={tues}
                          onChange={(e) => {
                            restrictNegativeValue(e.target.value, "Tues");
                          }}
                          // min={0}
                        />
                        <p>mg</p>
                      </span>
                    </div>
                  </div>
                  <div className="weeklyDoseRow">
                    <div className="btInputWrapper">
                      <label>Wednesday:</label>
                      <span>
                        <input
                          type="number"
                          value={wed}
                          onChange={(e) => {
                            restrictNegativeValue(e.target.value, "Wed");
                          }}
                          // min={0}
                        />
                        <p>mg</p>
                      </span>
                    </div>

                    <div className="btInputWrapper">
                      <label>Thursday:</label>
                      <span>
                        <input
                          type="number"
                          value={thur}
                          onChange={(e) => {
                            restrictNegativeValue(e.target.value, "Thur");
                          }}
                          // min={0}
                        />
                        <p>mg</p>
                      </span>
                    </div>
                  </div>
                  <div className="weeklyDoseRow">
                    <div className="btInputWrapper">
                      <label>Friday:</label>
                      <span>
                        <input
                          type="number"
                          value={fri}
                          onChange={(e) => {
                            restrictNegativeValue(e.target.value, "Fri");
                          }}
                          // min={0}
                        />
                        <p>mg</p>
                      </span>
                    </div>

                    <div className="btInputWrapper">
                      <label>Saturday:</label>
                      <span>
                        <input
                          type="number"
                          value={sat}
                          onChange={(e) => {
                            restrictNegativeValue(e.target.value, "Sat");
                          }}
                          // min={0}
                        />
                        <p>mg</p>
                      </span>
                    </div>
                  </div>
                  <div className="weeklyDoseRow">
                    <div className="btInputWrapper">
                      <label>Sunday:</label>
                      <span>
                        <input
                          type="number"
                          value={sun}
                          onChange={(e) => {
                            restrictNegativeValue(e.target.value, "Sun");
                          }}
                          // min={0}
                        />
                        <p>mg</p>
                      </span>
                    </div>
                  </div>
                </div>
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

          <div className="saveOrCancelBtBtn">
            <button
              className="verifyBtn"
              type="button"
              onClick={() => verifyData()}
            >
              Verify
            </button>
            <button
              className="saveBt"
              onClick={(e) => handleSubmitCreatinineData(e)}
            >
              Save
            </button>
            <button
              className="btBackBtn"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure to exit this page? \nPlease ensure you have saved all the changes before leaving this page. "
                  )
                ) {
                  navigate(
                    `/dashboard/patient/${params.patientId}/bloodThinner`
                  );
                  pageDispatch({
                    type: "SET_CURRENT_PAGE",
                    payload: "Blood Thinner / Clot Preventer",
                  });
                }
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
                {openCreatinineForm.action === "add" ? "New" : "Edit"} Record
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
                  max={getMaxDate()}
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
