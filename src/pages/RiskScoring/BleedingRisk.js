import React, { useEffect, useState } from "react";
import Checkbox from "../../components/Checkbox";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAuthState,
  usePageDispatch,
  usePatientDispatch,
  usePatientState,
} from "../../context";
import {
  setCurrentPatient,
  updateBleedingRisk,
  updateNameVerified,
} from "../../service";
import { getCurrentDate, getCurrentTime } from "../../utils";

function BleedingRisk() {
  const navigate = useNavigate();
  const params = useParams();

  const pageDispatch = usePageDispatch();
  const currentUserState = useAuthState();
  const patientState = usePatientState();
  const patientDispatch = usePatientDispatch();
  const patientId = params.patientId;

  const [hypertension, setHypertension] = useState(
    patientState.bleedingRisk.hypertension
      ? patientState.bleedingRisk.hypertension
      : false
  );
  const [renal, setRenal] = useState(
    patientState.bleedingRisk.renal ? patientState.bleedingRisk.renal : false
  );
  const [liver, setLiver] = useState(
    patientState.bleedingRisk.liver ? patientState.bleedingRisk.liver : false
  );
  const [stroke, setStroke] = useState(
    patientState.bleedingRisk.stroke ? patientState.bleedingRisk.stroke : false
  );
  const [bleeding, setBleeding] = useState(
    patientState.bleedingRisk.bleeding
      ? patientState.bleedingRisk.bleeding
      : false
  );
  const [inr, setInr] = useState(
    patientState.bleedingRisk.inr ? patientState.bleedingRisk.inr : false
  );
  const [age65, setAge65] = useState(
    patientState.bleedingRisk.age65 ? patientState.bleedingRisk.age65 : false
  );
  const [drugs, setDrugs] = useState(
    patientState.bleedingRisk.drugs ? patientState.bleedingRisk.drugs : false
  );
  const [alcohol, setAlcohol] = useState(
    patientState.bleedingRisk.alcohol
      ? patientState.bleedingRisk.alcohol
      : false
  );
  const [score, setScore] = useState(
    patientState.bleedingRisk.score ? patientState.bleedingRisk.score : 0
  );
  const [result, setResult] = useState(
    patientState.bleedingRisk.result ? patientState.bleedingRisk.result : ""
  );
  const [colorMsg, setColorMsg] = useState(
    patientState.bleedingRisk.colorMsg ? patientState.bleedingRisk.colorMsg : ""
  );

  let resultMessages = patientState.bleedingRiskResultMessage
    ? patientState.bleedingRiskResultMessage
    : [];

  let testResult = [
    hypertension,
    renal,
    liver,
    stroke,
    bleeding,
    inr,
    age65,
    drugs,
    alcohol,
  ];

  useEffect(() => {
    let currentScore = 0;
    for (let i = 0; i < testResult.length; i++) {
      if (testResult[i] === true) currentScore += 1;
    }
    setScore(currentScore);

    if (currentScore <= 1) {
      setResult("msg1");
      setColorMsg("#45f248");
    } else if (currentScore === 2) {
      setResult("msg2");
      setColorMsg("#ff9f00");
    } else {
      setResult("msg3");
      setColorMsg("#ec2029");
    }
  }, [testResult]);

  const dateTimeUpdated = patientState.bleedingRisk.dateTimeUpdated
    ? patientState.bleedingRisk.dateTimeUpdated
    : "";

  async function handleSubmitBleedingRiskTest(e) {
    e.preventDefault();

    if (window.confirm("Are you sure you want to continue?")) {
      let bleedingRiskData = {
        nameUpdated: currentUserState.userDetails.username,
        dateTimeUpdated: new Date().getTime(),
        nameVerified: "",
        hypertension: hypertension,
        renal: renal,
        liver: liver,
        stroke: stroke,
        bleeding: bleeding,
        inr: inr,
        age65: age65,
        drugs: drugs,
        alcohol: alcohol,
        score: score,
        result: result,
        colorMsg: colorMsg,
      };
      await updateBleedingRisk(bleedingRiskData, patientId);
      await setCurrentPatient(patientDispatch, patientId);
      alert("Update patient's bleeding risk successfully.");
    }
  }

  async function verifyData() {
    if (window.confirm("Are you sure to verify?")) {
      await updateNameVerified(
        "bleeding_risk",
        patientId,
        currentUserState.userDetails.username
      );
      await setCurrentPatient(patientDispatch, patientId);
    }
  }

  function getResultMessage(result) {
    if (result === "msg1") {
      return resultMessages.msg1;
    } else if (result === "msg2") {
      return resultMessages.msg2;
    } else {
      return resultMessages.msg3;
    }
  }

  return (
    <div className="wrapper">
      <div style={{ padding: "30px 70px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1>HAS-BLED test</h1>
          <div className="lastUpdatedBox">
            <div>
              <h4>
                <span>Last updated by</span>
                <span>:</span>
              </h4>
              <p>{patientState.bleedingRisk.nameUpdated}</p>
            </div>
            <div>
              <h4>
                <span>Last verified by</span>
                <span>:</span>
              </h4>
              <p>{patientState.bleedingRisk.nameVerified}</p>
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

        <form
          className="bleedingRiskForm"
          onSubmit={(e) => handleSubmitBleedingRiskTest(e)}
        >
          <Checkbox
            name="Hypertension"
            checkedYes={hypertension ? true : false}
            onChangeYes={(e) => setHypertension((prev) => (prev = true))}
            checkedNo={!hypertension ? true : false}
            onChangeNo={(e) => setHypertension((prev) => (prev = false))}
          />
          <Checkbox
            name="Abnormal renal function"
            checkedYes={renal ? true : false}
            onChangeYes={(e) => setRenal((prev) => (prev = true))}
            checkedNo={!renal ? true : false}
            onChangeNo={(e) => setRenal((prev) => (prev = false))}
          />
          <Checkbox
            name="Abnormal liver function"
            checkedYes={liver ? true : false}
            onChangeYes={(e) => setLiver((prev) => (prev = true))}
            checkedNo={!liver ? true : false}
            onChangeNo={(e) => setLiver((prev) => (prev = false))}
          />
          <Checkbox
            name="Stroke"
            checkedYes={stroke ? true : false}
            onChangeYes={(e) => setStroke((prev) => (prev = true))}
            checkedNo={!stroke ? true : false}
            onChangeNo={(e) => setStroke((prev) => (prev = false))}
          />
          <Checkbox
            name="Bleeding tendency"
            checkedYes={bleeding ? true : false}
            onChangeYes={(e) => setBleeding((prev) => (prev = true))}
            checkedNo={!bleeding ? true : false}
            onChangeNo={(e) => setBleeding((prev) => (prev = false))}
          />
          <Checkbox
            name="Labile INR"
            checkedYes={inr ? true : false}
            onChangeYes={(e) => setInr((prev) => (prev = true))}
            checkedNo={!inr ? true : false}
            onChangeNo={(e) => setInr((prev) => (prev = false))}
          />
          <Checkbox
            name="Age > 65 years old"
            checkedYes={age65 ? true : false}
            onChangeYes={(e) => setAge65((prev) => (prev = true))}
            checkedNo={!age65 ? true : false}
            onChangeNo={(e) => setAge65((prev) => (prev = false))}
          />
          <Checkbox
            name="Drugs (eg. aspirin, NSAIDs)"
            checkedYes={drugs ? true : false}
            onChangeYes={(e) => setDrugs((prev) => (prev = true))}
            checkedNo={!drugs ? true : false}
            onChangeNo={(e) => setDrugs((prev) => (prev = false))}
          />
          <Checkbox
            name="Alcohol use"
            checkedYes={alcohol ? true : false}
            onChangeYes={(e) => setAlcohol((prev) => (prev = true))}
            checkedNo={!alcohol ? true : false}
            onChangeNo={(e) => setAlcohol((prev) => (prev = false))}
          />

          <div className="risk-result">
            <h4>Score: {score} points</h4>
            <p style={{ color: `${colorMsg}` }}>{getResultMessage(result)}</p>
          </div>

          <div className="saveAndCancelButton ">
            <button
              className="verifyBtn"
              type="button"
              onClick={() => verifyData()}
            >
              Verify
            </button>
            <button className="saveProfile" type="submit">
              Save
            </button>
            <button
              type="button"
              className="cancelProfile"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure to exit this page? \nPlease ensure you have saved all the changes before leaving this page. "
                  )
                ) {
                  navigate(
                    `/dashboard/patient/${params.patientId}/riskScoring`
                  );
                  pageDispatch({
                    type: "SET_CURRENT_PAGE",
                    payload: "Risk Scoring",
                  });
                }
              }}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BleedingRisk;
