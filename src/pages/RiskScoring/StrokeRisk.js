import React, { useEffect, useState } from "react";
import Checkbox from "../../components/Checkbox";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAuthState,
  usePageDispatch,
  usePatientDispatch,
  usePatientState,
} from "../../context";
import { getCurrentDate, getCurrentTime } from "../../utils";
import {
  setCurrentPatient,
  updateNameVerified,
  updateStrokeRisk,
} from "../../service";
import { HiInformationCircle } from "react-icons/hi";

function StrokeRisk() {
  const navigate = useNavigate();
  const params = useParams();

  const pageDispatch = usePageDispatch();
  const currentUserState = useAuthState();
  const patientState = usePatientState();
  const patientDispatch = usePatientDispatch();
  const patientId = params.patientId;

  const [heartFailure, setHeartFailure] = useState(
    patientState.strokeRisk.heartFailure
      ? patientState.strokeRisk.heartFailure
      : false
  );
  const [hypertension, setHypertension] = useState(
    patientState.strokeRisk.hypertension
      ? patientState.strokeRisk.hypertension
      : false
  );
  const [age75, setAge75] = useState(
    patientState.strokeRisk.age75 ? patientState.strokeRisk.age75 : false
  );
  const [diabetes, setDiabetes] = useState(
    patientState.strokeRisk.diabetes ? patientState.strokeRisk.diabetes : false
  );
  const [stroke, setStroke] = useState(
    patientState.strokeRisk.stroke ? patientState.strokeRisk.stroke : false
  );
  const [vascular, setVascular] = useState(
    patientState.strokeRisk.vascular ? patientState.strokeRisk.vascular : false
  );
  const [age6574, setAge6574] = useState(
    patientState.strokeRisk.age6574 ? patientState.strokeRisk.age6574 : false
  );
  const [female, setFemale] = useState(
    patientState.strokeRisk.female ? patientState.strokeRisk.female : false
  );
  const [score, setScore] = useState(
    patientState.strokeRisk.score ? patientState.strokeRisk.score : 0
  );
  const [result, setResult] = useState(
    patientState.strokeRisk.result ? patientState.strokeRisk.result : ""
  );
  const [colorMsg, setColorMsg] = useState(
    patientState.strokeRisk.colorMsg ? patientState.strokeRisk.colorMsg : ""
  );

  let resultMessages = patientState.strokeRiskResultMessage
    ? patientState.strokeRiskResultMessage
    : [];

  let testResult = [
    heartFailure,
    hypertension,
    age75, // +2
    diabetes,
    stroke, // +2
    vascular,
    age6574,
    female,
  ];

  useEffect(() => {
    let currentScore = 0;
    for (let i = 0; i < testResult.length; i++) {
      if (i === 2 || i === 4) {
        if (testResult[i] === true) currentScore += 2;
      } else {
        if (testResult[i] === true) currentScore += 1;
      }
    }
    setScore(currentScore);

    if (currentScore === 0) {
      setResult("msg1");
      setColorMsg("#45f248");
    } else if (currentScore === 1) {
      setResult("msg2");
      setColorMsg("#ff9f00");
    } else {
      setResult("msg3");
      setColorMsg("#ec2029");
    }
  }, [testResult]);

  const dateTimeUpdated = patientState.strokeRisk.dateTimeUpdated
    ? patientState.strokeRisk.dateTimeUpdated
    : "";

  async function handleSubmitStrokeRiskTest(e) {
    e.preventDefault();

    if (window.confirm("Are you sure you want to continue?")) {
      let strokeRiskData = {
        nameUpdated: currentUserState.userDetails.username,
        dateTimeUpdated: new Date().getTime(),
        nameVerified: "",
        heartFailure: heartFailure,
        hypertension: hypertension,
        age75: age75,
        diabetes: diabetes,
        stroke: stroke,
        vascular: vascular,
        age6574: age6574,
        female: female,
        score: score,
        result: result,
        colorMsg: colorMsg,
      };

      await updateStrokeRisk(strokeRiskData, patientId, patientDispatch);
      // await setCurrentPatient(patientDispatch, patientId);
      alert("Update patient's stroke risk successfully.");
    }
  }

  async function verifyData() {
    if (window.confirm("Are you sure to verify?")) {
      await updateNameVerified(
        "stroke_risk",
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
          <h1>CHA₂DS₂-VASc test</h1>
          <div className="lastUpdatedBox">
            <div>
              <h4>
                <span>Last updated by</span>
                <span>:</span>
              </h4>
              <p>{patientState.strokeRisk.nameUpdated}</p>
            </div>
            <div>
              <h4>
                <span>Last verified by</span>
                <span>:</span>
              </h4>
              <p>{patientState.strokeRisk.nameVerified}</p>
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
          className="strokeRiskForm"
          onSubmit={(e) => handleSubmitStrokeRiskTest(e)}
        >
          <Checkbox
            name="Congestive Heart Failure"
            checkedYes={heartFailure ? true : false}
            onChangeYes={(e) => setHeartFailure((prev) => (prev = true))}
            checkedNo={!heartFailure ? true : false}
            onChangeNo={(e) => setHeartFailure((prev) => (prev = false))}
          />
          <Checkbox
            name="Hypertension"
            checkedYes={hypertension ? true : false}
            onChangeYes={(e) => setHypertension((prev) => (prev = true))}
            checkedNo={!hypertension ? true : false}
            onChangeNo={(e) => setHypertension((prev) => (prev = false))}
          />
          <Checkbox
            name="Age ≥ 75 years old"
            checkedYes={age75 ? true : false}
            onChangeYes={(e) => setAge75((prev) => (prev = true))}
            checkedNo={!age75 ? true : false}
            onChangeNo={(e) => setAge75((prev) => (prev = false))}
          />
          <Checkbox
            name="Diabetes"
            checkedYes={diabetes ? true : false}
            onChangeYes={(e) => setDiabetes((prev) => (prev = true))}
            checkedNo={!diabetes ? true : false}
            onChangeNo={(e) => setDiabetes((prev) => (prev = false))}
          />
          <Checkbox
            name="Stroke"
            checkedYes={stroke ? true : false}
            onChangeYes={(e) => setStroke((prev) => (prev = true))}
            checkedNo={!stroke ? true : false}
            onChangeNo={(e) => setStroke((prev) => (prev = false))}
          />
          <div className="medicalHistory">
            <Checkbox
              name="Vascular Disease"
              checkedYes={vascular ? true : false}
              onChangeYes={(e) => setVascular((prev) => (prev = true))}
              checkedNo={!vascular ? true : false}
              onChangeNo={(e) => setVascular((prev) => (prev = false))}
            />
            <HiInformationCircle
              className="infoCircle strokeRisk"
              title="- Prior myocardial infarction
                - Peripheral artery disease
                - Aortic plaque"
            />
          </div>
          <Checkbox
            name="Age 65 - 74 years old"
            checkedYes={age6574 ? true : false}
            onChangeYes={(e) => setAge6574((prev) => (prev = true))}
            checkedNo={!age6574 ? true : false}
            onChangeNo={(e) => setAge6574((prev) => (prev = false))}
          />
          <Checkbox
            name="Sex category (female)"
            checkedYes={female ? true : false}
            onChangeYes={(e) => setFemale((prev) => (prev = true))}
            checkedNo={!female ? true : false}
            onChangeNo={(e) => setFemale((prev) => (prev = false))}
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

export default StrokeRisk;
