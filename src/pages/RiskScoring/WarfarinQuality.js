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
  updateStrokeRisk,
  updateWarfarinQuality,
} from "../../service";
import { getCurrentDate, getCurrentTime } from "../../utils";
import { HiInformationCircle } from "react-icons/hi";

function WarfarinQuality() {
  const navigate = useNavigate();
  const params = useParams();

  const pageDispatch = usePageDispatch();
  const userState = useAuthState();
  const patientState = usePatientState();
  const patientDispatch = usePatientDispatch();
  const patientId = params.patientId;

  const [sex, setSex] = useState(
    patientState.warfarinQuality.sex ? patientState.warfarinQuality.sex : false
  );
  const [age, setAge] = useState(
    patientState.warfarinQuality.age ? patientState.warfarinQuality.age : false
  );
  const [medHistory, setMedHistory] = useState(
    patientState.warfarinQuality.medHistory
      ? patientState.warfarinQuality.medHistory
      : false
  );
  const [treatment, setTreatment] = useState(
    patientState.warfarinQuality.treatment
      ? patientState.warfarinQuality.treatment
      : false
  );
  const [tobacco, setTobacco] = useState(
    patientState.warfarinQuality.tobacco
      ? patientState.warfarinQuality.tobacco
      : false
  );
  const [race, setRace] = useState(
    patientState.warfarinQuality.race
      ? patientState.warfarinQuality.race
      : false
  );
  const [score, setScore] = useState(
    patientState.warfarinQuality.score ? patientState.warfarinQuality.score : 0
  );
  const [result, setResult] = useState(
    patientState.warfarinQuality.result
      ? patientState.warfarinQuality.result
      : ""
  );
  const [colorMsg, setColorMsg] = useState(
    patientState.warfarinQuality.colorMsg
      ? patientState.warfarinQuality.colorMsg
      : ""
  );

  let resultMessages = patientState.warfarinQualityResultMessage
    ? patientState.warfarinQualityResultMessage
    : [];

  let testResult = [
    sex,
    age,
    medHistory,
    treatment,
    tobacco, // +2
    race, // +2
  ];

  useEffect(() => {
    let currentScore = 0;
    for (let i = 0; i < testResult.length; i++) {
      if (i === 4 || i === 5) {
        if (testResult[i] === true) currentScore += 2;
      } else {
        if (testResult[i] === true) currentScore += 1;
      }
    }
    setScore(currentScore);

    if (currentScore <= 2) {
      setResult(resultMessages.msg1);
      setColorMsg("#45f248");
    } else {
      setResult(resultMessages.msg2);
      setColorMsg("#ec2029");
    }
  }, [testResult]);

  const dateTimeUpdated = patientState.warfarinQuality.dateTimeUpdated
    ? patientState.warfarinQuality.dateTimeUpdated
    : "";

  let warfarinQualityData = {
    nameUpdated: userState.userDetails.username,
    dateTimeUpdated: new Date().getTime(),
    sex: sex,
    age: age,
    medHistory: medHistory,
    treatment: treatment,
    tobacco: tobacco,
    race: race,
    score: score,
    result: result,
    colorMsg: colorMsg,
  };

  async function handleSubmitWarfarinQuality(e) {
    e.preventDefault();

    if (window.confirm("Are you sure you want to continue?")) {
      await updateWarfarinQuality(warfarinQualityData, patientId);
      await setCurrentPatient(patientDispatch, patientId);
      pageDispatch({
        type: "SET_CURRENT_PAGE",
        payload: "Risk Scoring",
      });
      alert("Update patient's warfarin quality successfully.");
      navigate(`/dashboard/patient/${params.patientId}/riskScoring`);
    } else {
      return;
    }
  }

  return (
    <div className="wrapper">
      <div style={{ padding: "40px 70px", height: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1>SAMe-TT₂R₂ test</h1>
          <div className="lastUpdatedBox">
            <div>
              <h4>
                <span>Last updated by</span>
                <span>:</span>
              </h4>
              <p>{patientState.warfarinQuality.nameUpdated}</p>
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
          className="warfarinQualityForm"
          onSubmit={(e) => handleSubmitWarfarinQuality(e)}
        >
          <Checkbox
            name="Sex (female)"
            checkedYes={sex ? true : false}
            onChangeYes={(e) => setSex((prev) => (prev = true))}
            checkedNo={!sex ? true : false}
            onChangeNo={(e) => setSex((prev) => (prev = false))}
          />
          <Checkbox
            name="Age (less than 60 years old)"
            checkedYes={age ? true : false}
            onChangeYes={(e) => setAge((prev) => (prev = true))}
            checkedNo={!age ? true : false}
            onChangeNo={(e) => setAge((prev) => (prev = false))}
          />
          <div className="medicalHistory">
            <Checkbox
              name="Medical history (more than 2)"
              checkedYes={medHistory ? true : false}
              onChangeYes={(e) => setMedHistory((prev) => (prev = true))}
              checkedNo={!medHistory ? true : false}
              onChangeNo={(e) => setMedHistory((prev) => (prev = false))}
            />

            <HiInformationCircle
              className="infoCircle"
              title="
                -  hypertension
                - diabetes
                - coronary artery disease/ myocardial infarction
                - peripheral artery disease
                - congestive heart failure
                - previous stroke
                - pulmonary disease
                - hepatic or renal disease"
            />
          </div>
          <Checkbox
            name="Treatment - rhythm control strategy"
            checkedYes={treatment ? true : false}
            onChangeYes={(e) => setTreatment((prev) => (prev = true))}
            checkedNo={!treatment ? true : false}
            onChangeNo={(e) => setTreatment((prev) => (prev = false))}
          />
          <Checkbox
            name="Tobacco use (within 2 years)"
            checkedYes={tobacco ? true : false}
            onChangeYes={(e) => setTobacco((prev) => (prev = true))}
            checkedNo={!tobacco ? true : false}
            onChangeNo={(e) => setTobacco((prev) => (prev = false))}
          />
          <Checkbox
            name="Race (non-Causcasian)"
            checkedYes={race ? true : false}
            onChangeYes={(e) => setRace((prev) => (prev = true))}
            checkedNo={!race ? true : false}
            onChangeNo={(e) => setRace((prev) => (prev = false))}
          />

          <div className="risk-result">
            <h4>Score: {score} points</h4>
            <p style={{ color: `${colorMsg}` }}>{result}</p>
          </div>

          <div className="saveAndCancelButton ">
            <button className="saveProfile" type="submit">
              Save
            </button>
            <button
              type="button"
              className="cancelProfile"
              onClick={() => {
                navigate(`/dashboard/patient/${params.patientId}/riskScoring`);
                pageDispatch({
                  type: "SET_CURRENT_PAGE",
                  payload: "Patient Details",
                });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WarfarinQuality;
