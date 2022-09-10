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

  // INR data state
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
  const inrRange = patientState.bloodThinner.inrRange
    ? patientState.bloodThinner.inrRange
    : "";
  const [openWeeklyDose, setOpenWeeklyDose] = useState(false);
  const [openInrForm, setOpenInrForm] = useState({
    open: false,
    action: "add",
  });

  // const [ttrData, setTtrData] = useState({
  //   daysSinceLastTest: 0,
  //   inrDiff: 0,
  //   previousInrWithinRange: "",
  //   currentInrWithinRange: "",
  //   scenario: "",
  //   inrDiffAboveRange: 0,
  //   inrDiffBelowRange: 0,
  //   inrDiffWithinRange: 0,
  //   daysWithinRangeSinceLastTest: 0,
  //   percentageDaysWithinRangeSinceLastTest: 0,
  // });

  const [ttrData, setTtrData] = useState({});

  const [ttrResult, setTtrResult] = useState({
    percentageDaysWithinRange: 0,
    percentageOfTestsInRange: 0,
  });

  // const [daysSinceLastTest, setDaysSinceLastTest] = useState(0);
  // const [inrDiff, setInrDiff] = useState(0);
  // const [previousInrWithinRange, setPreviousInrWithinRange] = useState("");
  // const [currentInrWithinRange, setCurrentInrWithinRange] = useState("");
  // const [scenario, setScenario] = useState("");
  // const [inrDiffAboveRange, setInrDiffAboveRange] = useState(0);
  // const [inrDiffWithinRange, setInrDiffWithinRange] = useState(0);
  // const [inrDiffBelowRange, setInrDiffBelowRange] = useState(0);
  // const [daysWithinRangeSinceLastTest, setDaysWithinRangeSinceLastTest] =
  //   useState(0);
  // const [
  //   percentageDaysWithinRangeSinceLastTest,
  //   setPercentageDaysWithinRangeSinceLastTest,
  // ] = useState(0);

  // const [daysWithinRange, setDaysWithinRange] = useState(0);
  // const [totalDays, setTotalDays] = useState(0);
  const [percentageDaysWithinRange, setPercentageDaysWithinRange] = useState(0);

  // const [totalNumberOfTests, setTotalNumberOfTests] = useState(0);
  // const [numberOfTestsInRange, setNumberOfTestsInRange] = useState(0);
  const [percentageOfTestsInRange, setPercentageOfTestsInRange] = useState(0);

  // Creatinine Clearance data state
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

  // Table styling
  const styleInrTable = {
    height: "85%",
    width: "100%",
    margin: "auto",
  };

  const styleCCTable = {
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
      flex: 0.7,
    },
    {
      field: "inr",
      headerName: "INR",
      flex: 0.5,
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
      flex: 1.5,
    },
    {
      field: "button",
      headerName: "Action",
      flex: 0.5,
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
    arr.push(sun);
    arr.push(mon);
    arr.push(tues);
    arr.push(wed);
    arr.push(thur);
    arr.push(fri);
    arr.push(sat);

    let totalDoseAmount = 0;
    arr.forEach((a) => (totalDoseAmount += a));

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
        ttrData: ttrData,
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
        ttrData: ttrData,
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

  function calcultateTtrResult() {
    let _daysWithinRange = 0;
    let _totalDays = 0;
    let _percentageDaysWithinRange = 0;

    let _totalNumberOfTests = inrRecordList.length;
    let _numberOfTestsInRange = 0;
    let _percentageOfTestsInRange = 0;

    inrRecordList.forEach((record) => {
      console.log("1", record.ttrData);
      _daysWithinRange += record.ttrData.daysWithinRangeSinceLastTest;
      _totalDays += record.ttrData.daysSinceLastTest;

      if (record.ttrData.currentInrWithinRange === "In Range") {
        _numberOfTestsInRange += 1;
      }
    });
    console.log("_daysWithinRange", _daysWithinRange);
    console.log("_totalDays", _totalDays);
    console.log("_numberOfTestsInRange", _numberOfTestsInRange);

    _percentageDaysWithinRange = (_daysWithinRange / _totalDays) * 100;
    _percentageOfTestsInRange =
      (_numberOfTestsInRange / _totalNumberOfTests) * 100;

    setTtrResult({
      percentageDaysWithinRange: _percentageDaysWithinRange,
      percentageOfTestsInRange: _percentageOfTestsInRange,
    });
  }

  console.log("ttrResult", ttrResult);

  function handleDeleteInrData() {
    for (let i = 0; i < selectedInr.length; i++) {
      setInrRecordList((inrRecordList) =>
        inrRecordList.filter((bt) => bt.id !== selectedInr[i].id)
      );
    }
  }

  async function selectInrData(row) {
    console.log("row", row);
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
      ttrResult: ttrResult,
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

  console.log("ttrData", ttrData);

  useEffect(() => {
    if (date !== "" && inr > 0) {
      var inrRangeArr = inrRange.trim().split("-");
      var lowRange = parseInt(inrRangeArr[0].trim());
      var highRange = parseInt(inrRangeArr[1].trim());

      console.log("low", lowRange, "high", highRange);

      // let _daysSinceLastTest = 0;
      // let _inrDiff = 0;
      // let _previousInrWithinRange = "";
      // let _currentInrWithinRange = "";
      // let _scenario = "";
      // let _inrDiffAboveRange = 0;
      // let _inrDiffWithinRange = 0;
      // let _inrDiffBelowRange = 0;
      // let _daysWithinRangeSinceLastTest = 0;
      // let _percentageDaysWithinRangeSinceLastTest = 0;

      let currentRecord = {
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

      const inrRecordDb = patientState.bloodThinner.inrRecord
        ? patientState.bloodThinner.inrRecord
        : [];

      // if (inrRecordDb.length === 0) {
      let index = inrRecordList.findIndex((record) => {
        return record.id === inrRecordId;
      });
      if (inrRecordList.length === 0) {
        if (inr < lowRange) currentRecord.currentInrWithinRange = "Below";
        else if (inr > highRange) currentRecord.currentInrWithinRange = "Above";
        else currentRecord.currentInrWithinRange = "In Range";
      } else {
        let previousRecord = null;
        let nextRecord = null;

        if (openInrForm.action === "edit") {
          currentRecord = {
            daysSinceLastTest: inrRecordList[index].ttrData.daysSinceLastTest,
            inrDiff: inrRecordList[index].ttrData.inrDiff,
            previousInrWithinRange:
              inrRecordList[index].ttrData.previousInrWithinRange,
            currentInrWithinRange:
              inrRecordList[index].ttrData.currentInrWithinRange,
            scenario: inrRecordList[index].ttrData.scenario,
            inrDiffAboveRange: inrRecordList[index].ttrData.inrDiffAboveRange,
            inrDiffBelowRange: inrRecordList[index].ttrData.inrDiffBelowRange,
            inrDiffWithinRange: inrRecordList[index].ttrData.inrDiffWithinRange,
            daysWithinRangeSinceLastTest:
              inrRecordList[index].ttrData.daysWithinRangeSinceLastTest,
            percentageDaysWithinRangeSinceLastTest:
              inrRecordList[index].ttrData
                .percentageDaysWithinRangeSinceLastTest,
          };

          if (index > 0) {
            previousRecord = inrRecordList[index - 1];
          }

          if (inrRecordList.length - index > 1) {
            nextRecord = inrRecordList[index + 1];
          }

          console.log("previousRecord", previousRecord);
          console.log("nextRecord", nextRecord);
        } else {
          previousRecord = inrRecordList[inrRecordList.length - 1];
        }

        if (previousRecord !== null) {
          // Days Since Last Test
          let diff =
            new Date(date).getTime() - new Date(previousRecord.date).getTime();
          currentRecord.daysSinceLastTest = Math.ceil(
            diff / (1000 * 3600 * 24)
          );
          // INR Diff
          currentRecord.inrDiff =
            Math.round((inr - previousRecord.inr) * 10) / 10;
          // Previous INR Within Range
          currentRecord.previousInrWithinRange =
            previousRecord.ttrData.currentInrWithinRange;
          // Current INR Within Range
          if (inr < lowRange) currentRecord.currentInrWithinRange = "Below";
          else if (inr > highRange)
            currentRecord.currentInrWithinRange = "Above";
          else currentRecord.currentInrWithinRange = "In Range";
          // Scenario
          currentRecord.scenario =
            currentRecord.previousInrWithinRange ===
            currentRecord.currentInrWithinRange
              ? currentRecord.previousInrWithinRange
              : "Calculate";
          // INR Diff Above Range
          if (currentRecord.scenario === "Above") {
            currentRecord.inrDiffAboveRange = Math.abs(currentRecord.inrDiff);
          } else if (currentRecord.previousInrWithinRange === "Above") {
            currentRecord.inrDiffAboveRange = Math.abs(
              previousRecord.inr - highRange
            );
          } else if (currentRecord.currentInrWithinRange === "Above") {
            currentRecord.inrDiffAboveRange = Math.abs(inr - highRange);
          } else {
            currentRecord.inrDiffAboveRange = 0;
          }
          // INR Diff Within Range
          currentRecord.inrDiffWithinRange = parseFloat(
            (
              Math.abs(currentRecord.inrDiff) -
              Math.abs(currentRecord.inrDiffAboveRange) -
              Math.abs(currentRecord.inrDiffBelowRange)
            ).toFixed(1)
          );
          // INR Diff Below Range
          if (currentRecord.scenario === "Below") {
            currentRecord.inrDiffBelowRange = Math.abs(currentRecord.inrDiff);
          } else if (currentRecord.previousInrWithinRange === "Below") {
            currentRecord.inrDiffBelowRange = Math.abs(
              previousRecord.inr - lowRange
            );
          } else if (currentRecord.currentInrWithinRange === "Below") {
            currentRecord.inrDiffBelowRange = Math.abs(inr - lowRange);
          } else {
            currentRecord.inrDiffBelowRange = 0;
          }
          // % Days Within Range since last test
          if (currentRecord.inrDiff === 0) {
            if (currentRecord.currentInrWithinRange === "In Range") {
              currentRecord.percentageDaysWithinRangeSinceLastTest = 1;
            } else {
              currentRecord.percentageDaysWithinRangeSinceLastTest = 0;
            }
          } else {
            currentRecord.percentageDaysWithinRangeSinceLastTest = parseFloat(
              currentRecord.inrDiffWithinRange / Math.abs(currentRecord.inrDiff)
            );
          }
          // Days Within Range since last test
          currentRecord.daysWithinRangeSinceLastTest = parseFloat(
            (
              currentRecord.percentageDaysWithinRangeSinceLastTest *
              currentRecord.daysSinceLastTest
            ).toFixed(1)
          );
        }

        if (nextRecord !== null) {
          // Days Since Last Test
          let diff =
            new Date(nextRecord.date).getTime() - new Date(date).getTime();
          nextRecord.ttrData.daysSinceLastTest = Math.ceil(
            diff / (1000 * 3600 * 24)
          );
          // INR Diff
          nextRecord.ttrData.inrDiff =
            Math.round((nextRecord.inr - inr) * 10) / 10;
          // Previous INR Within Range
          nextRecord.ttrData.previousInrWithinRange =
            currentRecord.currentInrWithinRange;
          // Current INR Within Range
          if (nextRecord.inr < lowRange)
            nextRecord.ttrData.currentInrWithinRange = "Below";
          else if (nextRecord.inr > highRange)
            nextRecord.ttrData.currentInrWithinRange = "Above";
          else nextRecord.ttrData.currentInrWithinRange = "In Range";
          // Scenario
          nextRecord.ttrData.scenario =
            nextRecord.ttrData.previousInrWithinRange ===
            nextRecord.ttrData.currentInrWithinRange
              ? nextRecord.ttrData.previousInrWithinRange
              : "Calculate";
          // INR Diff Above Range
          if (nextRecord.ttrData.scenario === "Above") {
            nextRecord.ttrData.inrDiffAboveRange = Math.abs(
              nextRecord.ttrData.inrDiff
            );
          } else if (nextRecord.ttrData.previousInrWithinRange === "Above") {
            nextRecord.ttrData.inrDiffAboveRange = Math.abs(inr - highRange);
          } else if (nextRecord.ttrData.currentInrWithinRange === "Above") {
            nextRecord.ttrData.inrDiffAboveRange = Math.abs(
              nextRecord.inr - highRange
            );
          } else {
            nextRecord.ttrData.inrDiffAboveRange = 0;
          }
          // INR Diff Within Range
          nextRecord.ttrData.inrDiffWithinRange = parseFloat(
            (
              Math.abs(nextRecord.ttrData.inrDiff) -
              Math.abs(nextRecord.ttrData.inrDiffAboveRange) -
              Math.abs(nextRecord.ttrData.inrDiffBelowRange)
            ).toFixed(1)
          );
          // INR Diff Below Range
          if (nextRecord.ttrData.scenario === "Below") {
            nextRecord.ttrData.inrDiffBelowRange = Math.abs(
              nextRecord.ttrData.inrDiff
            );
          } else if (nextRecord.ttrData.previousInrWithinRange === "Below") {
            nextRecord.ttrData.inrDiffBelowRange = Math.abs(inr - lowRange);
          } else if (nextRecord.ttrData.currentInrWithinRange === "Below") {
            nextRecord.ttrData.inrDiffBelowRange = Math.abs(
              nextRecord.inr - lowRange
            );
          } else {
            nextRecord.ttrData.inrDiffBelowRange = 0;
          }
          // % Days Within Range since last test
          if (nextRecord.ttrData.inrDiff === 0) {
            if (nextRecord.ttrData.currentInrWithinRange === "In Range") {
              nextRecord.ttrData.percentageDaysWithinRangeSinceLastTest = 1;
            } else {
              nextRecord.ttrData.percentageDaysWithinRangeSinceLastTest = 0;
            }
          } else {
            nextRecord.ttrData.percentageDaysWithinRangeSinceLastTest =
              parseFloat(
                nextRecord.ttrData.inrDiffWithinRange /
                  Math.abs(nextRecord.ttrData.inrDiff)
              );
          }
          // Days Within Range since last test
          nextRecord.ttrData.daysWithinRangeSinceLastTest = parseFloat(
            (
              nextRecord.ttrData.percentageDaysWithinRangeSinceLastTest *
              nextRecord.ttrData.daysSinceLastTest
            ).toFixed(1)
          );
        }
        console.log("after", nextRecord);
      }
      // } else {
      //   let previousRecord;
      //   if (inrRecordList.length === 0) {
      //     previousRecord = inrRecordDb[inrRecordDb.length - 1];
      //   } else {
      //     if (openInrForm.action === "edit") {
      //       previousRecord = inrRecordList[inrRecordList.length - 2];
      //     } else {
      //       previousRecord = inrRecordList[inrRecordList.length - 1];
      //     }
      //   }

      //   // Days Since Last Test
      //   let diff =
      //     new Date(date).getTime() - new Date(previousRecord.date).getTime();
      //   _daysSinceLastTest = Math.ceil(diff / (1000 * 3600 * 24));
      //   // INR Diff
      //   _inrDiff = Math.round((inr - previousRecord.inr) * 10) / 10;
      //   // Previous INR Within Range
      //   _previousInrWithinRange = previousRecord.ttrData.currentInrWithinRange;
      //   // Current INR Within Range
      //   if (inr < lowRange) _currentInrWithinRange = "Below";
      //   else if (inr > highRange) _currentInrWithinRange = "Above";
      //   else _currentInrWithinRange = "In Range";
      //   // Scenario
      //   _scenario =
      //     _previousInrWithinRange === _currentInrWithinRange
      //       ? _previousInrWithinRange
      //       : "Calculate";
      //   // INR Diff Above Range
      //   if (_scenario === "Above") {
      //     _inrDiffAboveRange = Math.abs(_inrDiff);
      //   } else if (_previousInrWithinRange === "Above") {
      //     _inrDiffAboveRange = Math.abs(previousRecord.inr - highRange);
      //   } else if (_currentInrWithinRange === "Above") {
      //     _inrDiffAboveRange = Math.abs(inr - highRange);
      //   }
      //   // INR Diff Within Range
      //   _inrDiffWithinRange = parseFloat(
      //     Math.abs(_inrDiff) -
      //       Math.abs(_inrDiffAboveRange) -
      //       Math.abs(_inrDiffBelowRange)
      //   );
      //   // INR Diff Below Range
      //   if (_scenario === "Below") {
      //     _inrDiffBelowRange = Math.abs(_inrDiff);
      //   } else if (_previousInrWithinRange === "Below") {
      //     _inrDiffBelowRange = Math.abs(previousRecord.inr - lowRange);
      //   } else if (_currentInrWithinRange === "Below") {
      //     _inrDiffBelowRange = Math.abs(inr - lowRange);
      //   }
      //   // % Days Within Range since last test
      //   if (_inrDiff === 0) {
      //     if (_currentInrWithinRange === "In Range") {
      //       _percentageDaysWithinRangeSinceLastTest = 1;
      //     } else {
      //       _percentageDaysWithinRangeSinceLastTest = 0;
      //     }
      //   } else {
      //     _percentageDaysWithinRangeSinceLastTest =
      //       _inrDiffWithinRange / Math.abs(_inrDiff);
      //   }
      //   // Days Within Range since last test
      //   _daysWithinRangeSinceLastTest =
      //     _percentageDaysWithinRangeSinceLastTest * _daysSinceLastTest;
      // }

      // setTtrData({
      //   daysSinceLastTest: _daysSinceLastTest,
      //   inrDiff: _inrDiff,
      //   previousInrWithinRange: _previousInrWithinRange,
      //   currentInrWithinRange: _currentInrWithinRange,
      //   scenario: _scenario,
      //   inrDiffAboveRange: parseFloat(_inrDiffAboveRange),
      //   inrDiffWithinRange: parseFloat(_inrDiffWithinRange),
      //   inrDiffBelowRange: parseFloat(_inrDiffBelowRange),
      //   daysWithinRangeSinceLastTest: parseFloat(_daysWithinRangeSinceLastTest),
      //   percentageDaysWithinRangeSinceLastTest: parseFloat(
      //     _percentageDaysWithinRangeSinceLastTest
      //   ),
      // });

      setTtrData(currentRecord);
    }
  }, [date, inr]);

  useEffect(() => {
    calcultateTtrResult();
  }, [inrRecordList]);

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
