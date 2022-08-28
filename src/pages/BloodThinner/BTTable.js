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
} from "../../service/PatientService";
import { getCurrentDate, getCurrentTime } from "../../utils";

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
  console.log("inrList", inrRecordList);
  const inrRange = patientState.bloodThinner.inrRange
    ? patientState.bloodThinner.inrRange
    : "";
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
  const [daysSinceLastTest, setDaysSinceLastTest] = useState(0);
  const [inrDiff, setInrDiff] = useState(0);
  const [previousInrWithinRange, setPreviousInrWithinRange] = useState("");
  const [currentInrWithinRange, setCurrentInrWithinRange] = useState("");
  const [scenario, setScenario] = useState("");
  const [inrDiffAboveRange, setInrDiffAboveRange] = useState(0);
  const [inrDiffWithinRange, setInrDiffWithinRange] = useState(0);
  const [inrDiffBelowRange, setInrDiffBelowRange] = useState(0);
  const [daysWithinRangeSinceLastTest, setDaysWithinRangeSinceLastTest] =
    useState(0);
  const [
    percentageDaysWithinRangeSinceLastTest,
    setPercentageDaysWithinRangeSinceLastTest,
  ] = useState(0);

  const [daysWithinRange, setDaysWithinRange] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [percentageDaysWithinRange, setPercentageDaysWithinRange] = useState(0);

  const [totalNumberOfTests, setTotalNumberOfTests] = useState(0);
  const [numberOfTestsInRange, setNumberOfTestsInRange] = useState(0);
  const [percentageOfTestsInRange, setPercentageOfTestsInRange] = useState(0);

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

    let totalDoseAmount = 0;
    arr.forEach((a) => (totalDoseAmount += a));

    ttrCalculation();

    if (openInrForm.action === "add") {
      const inrRecordId = uuid().slice(0, 5);
      let inrRecordData = {
        id: inrRecordId,
        date: date,
        inr: parseFloat(inr),
        weeklyDoses: arr,
        totalDose: totalDoseAmount,
        duration: duration,
        note: note,

        daysSinceLastTest: parseFloat(daysSinceLastTest),
        inrDiff: parseFloat(inrDiff),
        previousInrWithinRange: previousInrWithinRange,
        currentInrWithinRange: currentInrWithinRange,
        scenario: scenario,
        inrDiffAboveRange: parseFloat(inrDiffAboveRange),
        inrDiffWithinRange: parseFloat(inrDiffWithinRange),
        inrDiffBelowRange: parseFloat(inrDiffBelowRange),
        daysWithinRangeSinceLastTest: parseFloat(daysWithinRangeSinceLastTest),
        percentageDaysWithinRangeSinceLastTest: parseFloat(
          percentageDaysWithinRangeSinceLastTest
        ),
      };

      setInrRecordList((inrRecordList) => [...inrRecordList, inrRecordData]);
    } else {
      let inrRecordData = {
        id: inrRecordId,
        date: date,
        inr: parseFloat(inr),
        weeklyDoses: arr,
        totalDose: totalDoseAmount,
        duration: duration,
        note: note,

        daysSinceLastTest: parseFloat(daysSinceLastTest),
        inrDiff: parseFloat(inrDiff),
        previousInrWithinRange: previousInrWithinRange,
        currentInrWithinRange: currentInrWithinRange,
        scenario: scenario,
        inrDiffAboveRange: parseFloat(inrDiffAboveRange),
        inrDiffWithinRange: parseFloat(inrDiffWithinRange),
        inrDiffBelowRange: parseFloat(inrDiffBelowRange),
        daysWithinRangeSinceLastTest: parseFloat(daysWithinRangeSinceLastTest),
        percentageDaysWithinRangeSinceLastTest: parseFloat(
          percentageDaysWithinRangeSinceLastTest
        ),
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

      percentageDaysWithinRange: parseFloat(percentageDaysWithinRange),

      percentageOfTestsInRange: parseFloat(percentageOfTestsInRange),
    };

    console.log("inrRecordData", inrRecordData);

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
      flex: 1,
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

    if (openCreatinineForm.action === "add") {
      const creatinineRecordId = uuid().slice(0, 5);
      let creatinineRecordData = {
        id: creatinineRecordId,
        age: age,
        date: date,
        weight: parseFloat(weight),
        serumCreatinine: parseFloat(serumCreatinine),
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
        weight: parseFloat(weight),
        serumCreatinine: parseFloat(serumCreatinine),
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

  function calculateCreatinineClearance(serumCreatinine) {
    let genderFactor = gender === "male" ? 1.23 : 1.04;
    let result = ((140 - age) * weight * genderFactor) / serumCreatinine;

    setCreatinineClearance(Math.round(result));
  }

  // Calculation of Time in Therapeutic Range(TTR) for the Quality Control Measurement of Warfarin
  function ttrCalculation() {
    var inrRangeArr = inrRange.trim().split("-");
    var lowRange = parseInt(inrRangeArr[0].trim());
    var highRange = parseInt(inrRangeArr[1].trim());

    console.log("low", lowRange, "high", highRange);

    let _daysSinceLastTest = 0;
    let _inrDiff = 0;
    let _previousInrWithinRange = "";
    let _currentInrWithinRange = "";
    let _scenario = "";
    let _inrDiffAboveRange = 0;
    let _inrDiffWithinRange = 0;
    let _inrDiffBelowRange = 0;
    let _daysWithinRangeSinceLastTest = 0;
    let _percentageDaysWithinRangeSinceLastTest = 0;

    if (inrRecordList.length === 0) {
      if (inr < lowRange) _currentInrWithinRange = "Below";
      else if (inr > highRange) _currentInrWithinRange = "Above";
      else _currentInrWithinRange = "In Range";
    } else {
      let previousRecord = patientState.bloodThinner.inrRecord
        ? patientState.bloodThinner.inrRecord[
            patientState.bloodThinner.inrRecord.length - 1
          ]
        : [];
      console.log("previous record", previousRecord);
      console.log("inr", inr);

      // Days Since Last Test
      let diff =
        new Date(date).getTime() - new Date(previousRecord.date).getTime();
      _daysSinceLastTest = Math.ceil(diff / (1000 * 3600 * 24));
      // INR Diff
      _inrDiff = Math.round((inr - previousRecord.inr) * 10) / 10;
      // Previous INR Within Range
      _previousInrWithinRange = previousRecord.currentInrWithinRange;
      // Current INR Within Range
      if (inr < lowRange) _currentInrWithinRange = "Below";
      else if (inr > highRange) _currentInrWithinRange = "Above";
      else _currentInrWithinRange = "In Range";
      // Scenario
      _scenario =
        _previousInrWithinRange.localeCompare(_currentInrWithinRange) === 0
          ? _previousInrWithinRange
          : "Calculate";
      // INR Diff Above Range
      if (_scenario.localeCompare("Above") === 0) {
        _inrDiffAboveRange = Math.abs(inrDiff);
      } else if (_previousInrWithinRange.localeCompare("Above") === 0) {
        _inrDiffAboveRange = Math.abs(previousRecord.inr - highRange);
      } else if (_currentInrWithinRange.localeCompare("Above") === 0) {
        _inrDiffAboveRange = Math.abs(inr - highRange);
      }
      // INR Diff Within Range
      _inrDiffWithinRange = parseFloat(
        Math.abs(_inrDiff) -
          Math.abs(_inrDiffAboveRange) -
          Math.abs(_inrDiffBelowRange)
      ).toFixed(1);
      // INR Diff Below Range
      if (_scenario.localeCompare("Below") === 0) {
        _inrDiffBelowRange = Math.abs(inrDiff);
      } else if (_previousInrWithinRange.localeCompare("Below") === 0) {
        _inrDiffBelowRange = Math.abs(previousRecord.inr - lowRange);
      } else if (_currentInrWithinRange.localeCompare("Below") === 0) {
        _inrDiffBelowRange = Math.abs(inr - lowRange);
      }
      // % Days Within Range since last test
      if (_inrDiff === 0) {
        if (_currentInrWithinRange.localeCompare("In Range") === 0) {
          _percentageDaysWithinRangeSinceLastTest = 1;
        } else {
          _percentageDaysWithinRangeSinceLastTest = 0;
        }
      } else {
        _percentageDaysWithinRangeSinceLastTest = parseFloat(
          _inrDiffWithinRange / Math.abs(_inrDiff)
        );
      }
      // Days Within Range since last test
      _daysWithinRangeSinceLastTest = parseFloat(
        _percentageDaysWithinRangeSinceLastTest * _daysSinceLastTest
      ).toFixed(1);
    }

    // ttr calculation
    let _daysWithinRange = 0;
    let _totalDays = 0;
    let _percentageDaysWithinRange = 0;

    let _totalNumberOfTests = 0;
    let _numberOfTestsInRange = 0;
    let _percentageOfTestsInRange = 0;

    console.log("inrRecordList", inrRecordList);
    for (let i = 0; i < inrRecordList.length; i++) {
      let record = inrRecordList[i];

      console.log("days", _daysWithinRange);
      console.log(
        "record.daysWithinRangeSinceLastTest",
        record.daysWithinRangeSinceLastTest
      );
      _daysWithinRange += record.daysWithinRangeSinceLastTest;
      _totalDays += record.daysSinceLastTest;
      if (record.currentInrWithinRange.localeCompare("In Range") === 0) {
        _numberOfTestsInRange += 1;
      }
    }
    // // Days Within Range
    // _daysWithinRange += _daysWithinRangeSinceLastTest;
    // // Total Days
    // _totalDays += _daysSinceLastTest;

    // % Days Within Range
    _percentageDaysWithinRange = _daysWithinRange / _totalDays;

    // % in Range
    // Total Number of Tests
    _totalNumberOfTests = inrRecordList.length;

    // Number of Tests in Range
    // if (_currentInrWithinRange.localeCompare("In Range") === 0) {
    //   _numberOfTestsInRange += 1;
    // }

    // % of Tests in Range
    _percentageOfTestsInRange = _numberOfTestsInRange / _totalNumberOfTests;

    console.log("Days Within Range: ", _daysWithinRange);
    console.log("Total days: ", _totalDays);
    console.log("% Days Within Range: ", _percentageDaysWithinRange);

    console.log("Total number of tests", _totalNumberOfTests);
    console.log("Number of tests in range", _numberOfTestsInRange);
    console.log("% Tests In Range: ", _percentageOfTestsInRange);

    setPercentageDaysWithinRange(_percentageDaysWithinRange);
    setPercentageOfTestsInRange(_percentageOfTestsInRange);

    // Rosendaal Method

    console.log(_daysSinceLastTest);
    console.log(_inrDiff);
    console.log(_previousInrWithinRange);
    console.log(_currentInrWithinRange);
    console.log(_scenario);
    console.log(_inrDiffAboveRange);
    console.log(_inrDiffWithinRange);
    console.log(_inrDiffBelowRange);
    console.log(_daysWithinRangeSinceLastTest);
    console.log(_percentageDaysWithinRangeSinceLastTest);
    // console.log("% Days Within Range: ", _percentageDaysWithinRange);
    // console.log("% Tests In Range: ", _percentageOfTestsInRange);

    setDaysSinceLastTest(_daysSinceLastTest);
    setInrDiff(_inrDiff);
    setPreviousInrWithinRange(_previousInrWithinRange);
    setCurrentInrWithinRange(_currentInrWithinRange);
    setScenario(_scenario);
    setInrDiffAboveRange(_inrDiffAboveRange);
    setInrDiffWithinRange(_inrDiffWithinRange);
    setInrDiffBelowRange(_inrDiffBelowRange);
    setDaysWithinRangeSinceLastTest(_daysWithinRangeSinceLastTest);
    setPercentageDaysWithinRangeSinceLastTest(
      _percentageDaysWithinRangeSinceLastTest
    );

    // setPercentageDaysWithinRange(_percentageDaysWithinRange);
    // setPercentageOfTestsInRange(_percentageOfTestsInRange);
  }

  useEffect(() => {
    calculateCreatinineClearance(serumCreatinine);
  }, [weight, serumCreatinine]);

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
          <>
            <div className="otherDose">
              <label style={{ fontWeight: "bold" }}>
                Dose <span style={{ paddingLeft: "5px" }}>:</span>{" "}
              </label>
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
          </>
        )}

        {anticoagulant !== "warfarin" && anticoagulant !== "rivaroxaban" && (
          <div className="otherDose">
            <label style={{ fontWeight: "bold" }}>
              Dose <span style={{ paddingLeft: "5px" }}>:</span>{" "}
            </label>
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
              <h1>{openInrForm.action === "add" ? "New" : "Edit"} Record</h1>
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

          <div className="saveOrCancelBtBtn">
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
