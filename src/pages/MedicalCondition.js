import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { setCurrentPatient, updateMedicalCondition } from "../service";
import Checkbox from "../components/Checkbox";
import {
  useAuthState,
  usePageDispatch,
  usePatientDispatch,
  usePatientState,
} from "../context";
import { getCurrentDate, getCurrentTime } from "../utils";

function MedicalCondition() {
  const params = useParams();
  const navigate = useNavigate();

  const patientState = usePatientState();
  const patientDispatch = usePatientDispatch();
  const pageDispatch = usePageDispatch();
  const userState = useAuthState();
  const patientId = params.patientId;

  const map = patientState.medicalCondition
    ? patientState.medicalCondition
    : null;
  console.log(patientState);

  const [hypertension, setHypertension] = useState(
    map.hypertension ? map.hypertension : false
  );
  const [diabetes, setDiabetes] = useState(map.diabetes ? map.diabetes : false);
  const [hyperlipidemia, setHyperlipidemia] = useState(
    map.hyperlipidemia ? map.hyperlipidemia : false
  );
  const [atrial, setAtrial] = useState(map.atrial ? map.atrial : false);
  const [heart, setHeart] = useState(map.heart ? map.heart : false);
  const [stroke, setStroke] = useState(map.stroke ? map.stroke : false);
  const [vascular, setVascular] = useState(map.vascular ? map.vascular : false);
  const [asthma, setAsthma] = useState(map.asthma ? map.asthma : false);
  const [copd, setCOPD] = useState(map.copd ? map.copd : false);
  const [renal, setRenal] = useState(map.renal ? map.renal : false);
  const [liver, setLiver] = useState(map.liver ? map.liver : false);

  const dateTimeUpdated = patientState.medicalCondition.dateTimeUpdated
    ? patientState.medicalCondition.dateTimeUpdated
    : "";

  console.log(
    userState.userDetails.username,
    new Date().getTime(),
    hypertension,
    diabetes,
    hyperlipidemia,
    atrial,
    heart,
    stroke,
    vascular,
    asthma,
    copd,
    renal,
    liver
  );

  const medicalConditionData = {
    nameUpdated: userState.userDetails.username,
    dateTimeUpdated: new Date().getTime(),
    hypertension: hypertension,
    diabetes: diabetes,
    hyperlipidemia: hyperlipidemia,
    atrial: atrial,
    heart: heart,
    stroke: stroke,
    vascular: vascular,
    asthma: asthma,
    copd: copd,
    renal: renal,
    liver: liver,
  };

  async function handleUpdateMedicalCondition(e) {
    e.preventDefault();

    if (window.confirm("Are you sure you want to continue?")) {
      await updateMedicalCondition(medicalConditionData, patientId);
      await setCurrentPatient(patientDispatch, patientId);
      alert("Update patient's medical condition successfully.");
    } else {
      return;
    }
  }

  return (
    <div className="medicalCondition">
      <div style={{ padding: "35px 70px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1>Medical Condition</h1>
          <div className="lastUpdatedBox">
            <div>
              <h4>
                <span>Last updated by</span>
                <span>:</span>
              </h4>
              <p>{patientState.medicalCondition.nameUpdated}</p>
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
          className="medicalConditionForm"
          onSubmit={(e) => handleUpdateMedicalCondition(e)}
        >
          <Checkbox
            name="Hypertension"
            checkedYes={hypertension ? true : false}
            onChangeYes={(e) => setHypertension((prev) => (prev = true))}
            checkedNo={!hypertension ? true : false}
            onChangeNo={(e) => setHypertension((prev) => (prev = false))}
          />

          <Checkbox
            name="Type 2 Diabetes Mellitus"
            checkedYes={diabetes ? true : false}
            onChangeYes={(e) => setDiabetes((prev) => (prev = true))}
            checkedNo={!diabetes ? true : false}
            onChangeNo={(e) => setDiabetes((prev) => (prev = false))}
          />

          <Checkbox
            name="Hyperlipidemia"
            checkedYes={hyperlipidemia ? true : false}
            onChangeYes={(e) => setHyperlipidemia((prev) => (prev = true))}
            checkedNo={!hyperlipidemia ? true : false}
            onChangeNo={(e) => setHyperlipidemia((prev) => (prev = false))}
          />

          <Checkbox
            name="Atrial Fibrillation"
            checkedYes={atrial ? true : false}
            onChangeYes={(e) => setAtrial((prev) => (prev = true))}
            checkedNo={!atrial ? true : false}
            onChangeNo={(e) => setAtrial((prev) => (prev = false))}
          />

          <Checkbox
            name="Heart Failure"
            checkedYes={heart ? true : false}
            onChangeYes={(e) => setHeart((prev) => (prev = true))}
            checkedNo={!heart ? true : false}
            onChangeNo={(e) => setHeart((prev) => (prev = false))}
          />

          <Checkbox
            name="Stroke / TIA"
            checkedYes={stroke ? true : false}
            onChangeYes={(e) => setStroke((prev) => (prev = true))}
            checkedNo={!stroke ? true : false}
            onChangeNo={(e) => setStroke((prev) => (prev = false))}
          />

          <Checkbox
            name="Vascular disease"
            checkedYes={vascular ? true : false}
            onChangeYes={(e) => setVascular((prev) => (prev = true))}
            checkedNo={!vascular ? true : false}
            onChangeNo={(e) => setVascular((prev) => (prev = false))}
          />

          <Checkbox
            name="Asthma"
            checkedYes={asthma ? true : false}
            onChangeYes={(e) => setAsthma((prev) => (prev = true))}
            checkedNo={!asthma ? true : false}
            onChangeNo={(e) => setAsthma((prev) => (prev = false))}
          />

          <Checkbox
            name="COPD"
            checkedYes={copd ? true : false}
            onChangeYes={(e) => setCOPD((prev) => (prev = true))}
            checkedNo={!copd ? true : false}
            onChangeNo={(e) => setCOPD((prev) => (prev = false))}
          />

          <Checkbox
            name="Renal impairment"
            checkedYes={renal ? true : false}
            onChangeYes={(e) => setRenal((prev) => (prev = true))}
            checkedNo={!renal ? true : false}
            onChangeNo={(e) => setRenal((prev) => (prev = false))}
          />

          <Checkbox
            name="Liver impairment"
            checkedYes={liver ? true : false}
            onChangeYes={(e) => setLiver((prev) => (prev = true))}
            checkedNo={!liver ? true : false}
            onChangeNo={(e) => setLiver((prev) => (prev = false))}
          />

          <div className="saveAndCancelButton mc">
            <button className="saveProfile" type="submit">
              Save
            </button>
            <button
              type="button"
              className="cancelProfile"
              onClick={() => {
                navigate(`/dashboard/patient/${params.patientId}`);
                pageDispatch({
                  type: "SET_CURRENT_PAGE",
                  payload: "Patient Details",
                });
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

export default MedicalCondition;
