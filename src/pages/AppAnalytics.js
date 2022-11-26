import {
  collection,
  doc,
  documentId,
  FieldPath,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import ExcelExport from "../components/ExcelExport";
import { usePageDispatch } from "../context";
import { firestore } from "../firebase";
import {
  convertDateObjToDateInput,
  getCurrentDate,
  getMaxDate,
} from "../utils";

function AppAnalytics() {
  const pageDispatch = usePageDispatch();

  var date = new Date();
  const [period, setPeriod] = useState("daily");
  const [startDate, setStartDate] = useState(convertDateObjToDateInput(date));
  const [minDate, setMinDate] = useState("");

  const [myselfModuleTotalCount, setMyselfModuleTotalCount] = useState(0);
  const [selfMonitorModuleTotalCount, setSelfMonitorModuleTotalCount] =
    useState(0);
  const [learningModuleTotalCount, setLearningModuleTotalCount] = useState(0);

  const [generalInfoPageTotalCount, setGeneralInfoPageTotalCount] = useState(0);
  const [allergyPageTotalCount, setAllergyPageTotalCount] = useState(0);
  const [medicalConditionPageTotalCount, setMedicalConditionPageTotalCount] =
    useState(0);
  const [medicationPageTotalCount, setMedicationPageTotalCount] = useState(0);
  const [bloodThinnerPageTotalCount, setBloodThinnerPageTotalCount] =
    useState(0);
  const [healthGoalsPageTotalCount, setHealthGoalsPageTotalCount] = useState(0);
  const [bpHrPageTotalCount, setBpHrPageTotalCount] = useState(0);
  const [bloodSugarLevelPageTotalCount, setBloodSugarLevelPageTotalCount] =
    useState(0);
  const [bodyWeightPageTotalCount, setBodyWeightPageTotalCount] = useState(0);
  const [bleedingSymptomsPageTotalCount, setBleedingSymptomsPageTotalCount] =
    useState(0);
  const [healthDiaryPageTotalCount, setHealthDiaryPageTotalCount] = useState(0);
  const [remindMePageTotalCount, setRemindMePageTotalCount] = useState(0);
  const [
    atrialFibrillationPageTotalCount,
    setAtrialFibrillationPageTotalCount,
  ] = useState(0);
  const [heartFailurePageTotalCount, setHeartFailurePageTotalCount] =
    useState(0);
  const [oacPageTotalCount, setOacPageTotalCount] = useState(0);
  const [
    oacAndInteractionsPageTotalCount,
    setOacAndInteractionsPageTotalCount,
  ] = useState(0);
  const [medicalHelpPageTotalCount, setMedicalHelpPageTotalCount] = useState(0);
  const [loginPageTotalCount, setLoginPageTotalCount] = useState(0);

  function getPageCount(analyticsData) {
    const q = query(collection(firestore, "analytics"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      pageDispatch({
        type: "SET_LOADING_TRUE",
      });

      setMinDate(querySnapshot.docs[0].id);

      if (period === "daily") {
        analyticsData.push(
          querySnapshot.docs.find((doc) => doc.id === startDate)
        );

        console.log("daily", analyticsData);
      } else if (period === "weekly") {
        var startIndex = querySnapshot.docs.findIndex(
          (doc) => doc.id === startDate
        );

        if (startIndex > -1) {
          for (let i = startIndex; i < startIndex + 6; i++) {
            if (querySnapshot.docs[i] !== undefined) {
              analyticsData.push(querySnapshot.docs[i]);
            }
          }
        }

        console.log("weekly", analyticsData);
      } else {
        var startIndex = querySnapshot.docs.findIndex(
          (doc) => doc.id === startDate
        );

        if (startIndex > -1) {
          for (let i = startIndex; i < startIndex + 30; i++) {
            if (querySnapshot.docs[i] !== undefined) {
              analyticsData.push(querySnapshot.docs[i]);
            }
          }
        }

        console.log("monthly", analyticsData);
      }

      let generalInfoPageCount = 0;
      let allergyPageCount = 0;
      let medicalConditionPageCount = 0;
      let medicationPageCount = 0;
      let bloodThinnerPageCount = 0;
      let healthGoalsPageCount = 0;
      let bpHrPageCount = 0;
      let bloodSugarLevelPageCount = 0;
      let bodyWeightPageCount = 0;
      let bleedingSymptomsPageCount = 0;
      let healthDiaryPageCount = 0;
      let remindMePageCount = 0;
      let atrialFibrillationPageCount = 0;
      let heartFailurePageCount = 0;
      let oacPageCount = 0;
      let oacAndInteractionsPageCount = 0;
      let medicalHelpPageCount = 0;
      let loginPageCount = 0;

      let myselfModuleCount = 0;
      let selfMonitorCount = 0;
      let learningModuleCount = 0;

      if (analyticsData[0] !== undefined) {
        analyticsData.forEach((doc) => {
          generalInfoPageCount += doc.data().generalInfoPage;
          allergyPageCount += doc.data().allergyPage;
          medicalConditionPageCount += doc.data().medicalConditionPage;
          medicationPageCount += doc.data().medicationPage;
          bloodThinnerPageCount += doc.data().bloodThinnerPage;
          healthGoalsPageCount += doc.data().healthGoalsPage;
          bpHrPageCount += doc.data().bpHrPage;
          bloodSugarLevelPageCount += doc.data().bloodSugarLevelPage;
          bodyWeightPageCount += doc.data().bodyWeightPage;
          bleedingSymptomsPageCount += doc.data().bleedingSymptomsPage;
          healthDiaryPageCount += doc.data().healthDiaryPage;
          remindMePageCount += doc.data().remindMePage;
          atrialFibrillationPageCount += doc.data().atrialFibrillationPage;
          heartFailurePageCount += doc.data().heartFailurePage;
          oacPageCount += doc.data().oacPage;
          oacAndInteractionsPageCount += doc.data().oacAndInteractionsPage;
          medicalHelpPageCount += doc.data().medicalHelpPage;
          loginPageCount += doc.data().loginPage;

          myselfModuleCount =
            generalInfoPageCount +
            allergyPageCount +
            medicalConditionPageCount +
            medicationPageCount;
          selfMonitorCount =
            bpHrPageCount +
            bloodSugarLevelPageCount +
            bodyWeightPageCount +
            bleedingSymptomsPageCount +
            healthDiaryPageCount;
          learningModuleCount =
            atrialFibrillationPageCount +
            heartFailurePageCount +
            oacPageCount +
            oacAndInteractionsPageCount;
        });
      }

      setGeneralInfoPageTotalCount(generalInfoPageCount);
      setAllergyPageTotalCount(allergyPageCount);
      setMedicalConditionPageTotalCount(medicalConditionPageCount);
      setMedicationPageTotalCount(medicationPageCount);
      setBloodThinnerPageTotalCount(bloodThinnerPageCount);
      setHealthGoalsPageTotalCount(healthGoalsPageCount);
      setBpHrPageTotalCount(bpHrPageCount);
      setBloodSugarLevelPageTotalCount(bloodSugarLevelPageCount);
      setBodyWeightPageTotalCount(bodyWeightPageCount);
      setBleedingSymptomsPageTotalCount(bleedingSymptomsPageCount);
      setHealthDiaryPageTotalCount(healthDiaryPageCount);
      setRemindMePageTotalCount(remindMePageCount);
      setAtrialFibrillationPageTotalCount(atrialFibrillationPageCount);
      setHeartFailurePageTotalCount(heartFailurePageCount);
      setOacPageTotalCount(oacPageCount);
      setOacAndInteractionsPageTotalCount(oacAndInteractionsPageCount);
      setMedicalHelpPageTotalCount(medicalHelpPageCount);
      setLoginPageTotalCount(loginPageCount);

      setMyselfModuleTotalCount(myselfModuleCount);
      setSelfMonitorModuleTotalCount(selfMonitorCount);
      setLearningModuleTotalCount(learningModuleCount);

      pageDispatch({
        type: "SET_LOADING_FALSE",
      });
    });
  }

  useEffect(() => {
    console.log(period);
    console.log(startDate);
    if (period !== "" && startDate !== "") {
      let analyticsData = [];
      getPageCount(analyticsData);
    }
  }, [period, startDate]);

  const sampleData = [
    ["Date:", startDate],
    ["Period:", period],
    [],
    [
      "Myself",
      myselfModuleTotalCount,
      "Blood Thinner",
      bloodThinnerPageTotalCount,
      "Health Goals",
      healthGoalsPageTotalCount,
      "Self-Monitor",
      selfMonitorModuleTotalCount,
      "Remind Me",
      remindMePageTotalCount,
      "Learning Module",
      learningModuleTotalCount,
      "Medical Help",
      medicalHelpPageTotalCount,
      "Login",
      loginPageTotalCount,
    ],
    [
      "General Info",
      generalInfoPageTotalCount,
      "",
      "",
      "",
      "",
      "BP & HR",
      bpHrPageTotalCount,
      "",
      "",
      "Atrial Fibrilation",
      atrialFibrillationPageTotalCount,
    ],
    [
      "Allergy",
      allergyPageTotalCount,
      "",
      "",
      "",
      "",
      "Blood Sugar Level",
      bloodSugarLevelPageTotalCount,
      "",
      "",
      "Heart Failure",
      heartFailurePageTotalCount,
    ],
    [
      "Medical Condition",
      medicalConditionPageTotalCount,
      "",
      "",
      "",
      "",
      "Body Weight",
      bodyWeightPageTotalCount,
      "",
      "",
      "OAC",
      oacPageTotalCount,
    ],
    [
      "Current Medication",
      medicationPageTotalCount,
      "",
      "",
      "",
      "",
      "Bleeding Symptoms",
      bleedingSymptomsPageTotalCount,
      "",
      "",
      "OAC and Interations",
      oacAndInteractionsPageTotalCount,
    ],
    ["", "", "", "", "", "", "Health Diary", healthDiaryPageTotalCount],
  ];

  return (
    <div className="wrapper">
      <div className="appAnalyticsWrap">
        <div className="filterDate">
          <h1>Total Visit Per Page</h1>

          <div style={{ alignItems: "center" }}>
            <div>
              <p>Period:</p>
              <select onChange={(e) => setPeriod(e.target.value)}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <p>Start from:</p>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={getMaxDate()}
                min={minDate}
              />
            </div>

            <ExcelExport
              excelData={sampleData}
              fileName={`App Analytics_${startDate.split("-")[2]}/${
                startDate.split("-")[1]
              }/${startDate.split("-")[0]}`}
            />
          </div>
        </div>

        <div className="pageAnalytics">
          <div className="sidePageAnalytics">
            <ul className="pageCountList">
              <div className="pageCount">
                <h4>
                  <span>Myself</span>
                  <span>:</span>
                </h4>
                <p>{myselfModuleTotalCount}</p>
              </div>
              <li>
                <div className="pageCount">
                  <p>
                    <span>General Info</span>
                    <span>:</span>
                  </p>
                  <p>{generalInfoPageTotalCount}</p>
                </div>
              </li>
              <li>
                <div className="pageCount">
                  <p>
                    <span>Allergy</span>
                    <span>:</span>
                  </p>
                  <p>{allergyPageTotalCount}</p>
                </div>
              </li>
              <li>
                <div className="pageCount">
                  <p>
                    <span>Medical Condition</span>
                    <span>:</span>
                  </p>
                  <p>{medicalConditionPageTotalCount}</p>
                </div>
              </li>
              <li>
                <div className="pageCount">
                  <p>
                    <span>Current Medication</span>
                    <span>:</span>
                  </p>
                  <p>{medicationPageTotalCount}</p>
                </div>
              </li>
            </ul>

            <div className="pageCount">
              <h4>
                <span>Blood Thinner</span>
                <span>:</span>
              </h4>
              <p>{bloodThinnerPageTotalCount}</p>
            </div>

            <div className="pageCount">
              <h4>
                <span>Health Goals</span>
                <span>:</span>
              </h4>
              <p>{healthGoalsPageTotalCount}</p>
            </div>

            <ul className="pageCountList">
              <div className="pageCount">
                <h4>
                  <span>Self-Monitor</span>
                  <span>:</span>
                </h4>
                <p>{selfMonitorModuleTotalCount}</p>
              </div>
              <li>
                <div className="pageCount">
                  <p>
                    <span>BP & HR</span>
                    <span>:</span>
                  </p>
                  <p>{bpHrPageTotalCount}</p>
                </div>
              </li>
              <li>
                <div className="pageCount">
                  <p>
                    <span>Blood Sugar Level</span>
                    <span>:</span>
                  </p>
                  <p>{bloodSugarLevelPageTotalCount}</p>
                </div>
              </li>
              <li>
                <div className="pageCount">
                  <p>
                    <span>Body Weight</span>
                    <span>:</span>
                  </p>
                  <p>{bodyWeightPageTotalCount}</p>
                </div>
              </li>
              <li>
                <div className="pageCount">
                  <p>
                    <span>Bleeding Symptoms</span>
                    <span>:</span>
                  </p>
                  <p>{bleedingSymptomsPageTotalCount}</p>
                </div>
              </li>
              <li>
                <div className="pageCount">
                  <p>
                    <span>Health Diary</span>
                    <span>:</span>
                  </p>
                  <p>{healthDiaryPageTotalCount}</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="sidePageAnalytics">
            <div className="pageCount">
              <h4>
                <span>Remind Me</span>
                <span>:</span>
              </h4>
              <p>{remindMePageTotalCount}</p>
            </div>

            <ul className="pageCountList">
              <div className="pageCount">
                <h4>
                  <span>Learning Module</span>
                  <span>:</span>
                </h4>
                <p>{learningModuleTotalCount}</p>
              </div>
              <li>
                <div className="pageCount">
                  <p>
                    <span>Atrial Fibrillation</span>
                    <span>:</span>
                  </p>
                  <p>{atrialFibrillationPageTotalCount}</p>
                </div>
              </li>
              <li>
                <div className="pageCount">
                  <p>
                    <span>Heart Failure</span>
                    <span>:</span>
                  </p>
                  <p>{heartFailurePageTotalCount}</p>
                </div>
              </li>
              <li>
                <div className="pageCount">
                  <p>
                    <span>OAC</span>
                    <span>:</span>
                  </p>
                  <p>{oacPageTotalCount}</p>
                </div>
              </li>
              <li>
                <div className="pageCount">
                  <p>
                    <span>OAC and Interactions</span>
                    <span>:</span>
                  </p>
                  <p>{oacAndInteractionsPageTotalCount}</p>
                </div>
              </li>
            </ul>

            <div className="pageCount">
              <h4>
                <span>Medical Help</span>
                <span>:</span>
              </h4>
              <p>{medicalHelpPageTotalCount}</p>
            </div>

            <div className="pageCount">
              <h4>
                <span>Login</span>
                <span>:</span>
              </h4>
              <p>{loginPageTotalCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppAnalytics;
