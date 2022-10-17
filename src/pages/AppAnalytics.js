import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { usePageDispatch } from "../context";
import { firestore } from "../firebase";

function AppAnalytics() {
  const pageDispatch = usePageDispatch();

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

  const q = query(collection(firestore, "patient"));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    pageDispatch({
      type: "SET_LOADING_TRUE",
    });

    if (querySnapshot.docs.length > 0) {
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

      querySnapshot.docs.forEach((doc) => {
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
      });
    }

    pageDispatch({
      type: "SET_LOADING_FALSE",
    });
  });

  return (
    <div className="wrapper">
      <div
        style={{
          padding: "40px",
          height: "100%",
          overflowY: "scroll",
        }}
      >
        <h1>Total Visit Per Page</h1>

        <div className="pageAnalytics">
          <div className="sidePageAnalytics">
            <ul className="pageCountList">
              <h4>Myself</h4>
              <li>
                <div className="pageCount">
                  <p>
                    <span>General Info</span>
                    <span>:</span>
                  </p>
                  <p>10</p>
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
                  <p>10</p>
                </div>
              </li>
              <li>
                <div className="pageCount">
                  <p>
                    <span>Current Medication</span>
                    <span>:</span>
                  </p>
                  <p>10</p>
                </div>
              </li>
            </ul>

            <div className="pageCount">
              <h4>
                <span>Blood Thinner</span>
                <span>:</span>
              </h4>
              <p>10</p>
            </div>

            <div className="pageCount">
              <h4>
                <span>Health Goals</span>
                <span>:</span>
              </h4>
              <p>10</p>
            </div>

            <ul className="pageCountList">
              <h4>Self-Monitor</h4>
              <li>
                <div className="pageCount">
                  <p>
                    <span>BP & HR</span>
                    <span>:</span>
                  </p>
                  <p>10</p>
                </div>
              </li>
              <li>
                <div className="pageCount">
                  <p>
                    <span>Blood Sugar Level</span>
                    <span>:</span>
                  </p>
                  <p>10</p>
                </div>
              </li>
              <li>
                <div className="pageCount">
                  <p>
                    <span>Body Weight</span>
                    <span>:</span>
                  </p>
                  <p>10</p>
                </div>
              </li>
              <li>
                <div className="pageCount">
                  <p>
                    <span>Bleeding Symptoms</span>
                    <span>:</span>
                  </p>
                  <p>7</p>
                </div>
              </li>
              <li>
                <div className="pageCount">
                  <p>
                    <span>Health Diary</span>
                    <span>:</span>
                  </p>
                  <p>10</p>
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
              <p>10</p>
            </div>

            <ul className="pageCountList">
              <h4>Learning Module</h4>
              <li>
                <div className="pageCount">
                  <p>
                    <span>Atrial Fibrillation</span>
                    <span>:</span>
                  </p>
                  <p>10</p>
                </div>
              </li>
              <li>
                <div className="pageCount">
                  <p>
                    <span>Heart Failure</span>
                    <span>:</span>
                  </p>
                  <p>10</p>
                </div>
              </li>
              <li>
                <div className="pageCount">
                  <p>
                    <span>OAC</span>
                    <span>:</span>
                  </p>
                  <p>10</p>
                </div>
              </li>
              <li>
                <div className="pageCount">
                  <p>
                    <span>OAC and Interactions</span>
                    <span>:</span>
                  </p>
                  <p>10</p>
                </div>
              </li>
            </ul>

            <div className="pageCount">
              <h4>
                <span>Medical Help</span>
                <span>:</span>
              </h4>
              <p>10</p>
            </div>

            <div className="pageCount">
              <h4>
                <span>Login</span>
                <span>:</span>
              </h4>
              <p>10</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppAnalytics;
