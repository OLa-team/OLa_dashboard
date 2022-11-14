import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  setCurrentPatient,
  updateAllergy,
  updateNameVerified,
} from "../service";
import {
  useAuthState,
  usePageDispatch,
  usePatientDispatch,
  usePatientState,
} from "../context";
import { encryptData, getCurrentDate, getCurrentTime } from "../utils";

function Allergy() {
  const pageDispatch = usePageDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const patientState = usePatientState();
  const currentPatient = patientState.currentPatient;
  const patientDispatch = usePatientDispatch();
  const currentUserState = useAuthState();
  const patientId = params.patientId;
  const [allergyStatus, setAllergyStatus] = useState(
    patientState.allergy.allergyStatus
      ? patientState.allergy.allergyStatus
      : "unknown"
  );
  const [hasAllergy, setHasAllery] = useState(
    patientState.allergy.hasAllergy ? patientState.allergy.hasAllergy : false
  );
  const [food, setFood] = useState(
    patientState.allergy.food
      ? convertArrayToStr(patientState.allergy.food)
      : ""
  );
  const [medicine, setMedicine] = useState(
    patientState.allergy.medicine
      ? convertArrayToStr(patientState.allergy.medicine)
      : ""
  );

  const dateTimeUpdated = patientState.allergy.dateTimeUpdated
    ? patientState.allergy.dateTimeUpdated
    : "";

  function convertArrayToStr(arr) {
    let str = "";
    for (let i = 0; i < arr.length; i++) {
      if (i === arr.length - 1) str += arr[i];
      else str += arr[i] + ", ";
    }

    return str;
  }

  async function handleSubmitAllergy(e) {
    e.preventDefault();

    const allergyData = {
      nameUpdated: currentUserState.userDetails.username,
      dateTimeUpdated: new Date().getTime(),
      nameVerified: "",
      allergyStatus: allergyStatus,
      hasAllergy: food === "" && medicine === "" ? false : true,
      food: allergyStatus === "Y" ? food.split(",") : [],
      medicine: allergyStatus === "Y" ? medicine.split(",") : [],
    };

    if (window.confirm("Are you sure you want to continue?")) {
      await updateAllergy(allergyData, patientId);
      await setCurrentPatient(patientDispatch, patientId);
      alert("Update patient's allergy successfully.");
    } else {
      return;
    }
  }

  async function verifyData() {
    if (window.confirm("Are you sure to verify?")) {
      await updateNameVerified(
        "allergy",
        patientId,
        currentUserState.userDetails.username
      );
      await setCurrentPatient(patientDispatch, patientId);
    }
  }

  return (
    <div className="wrapper">
      <div style={{ padding: "50px 70px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1>Allergy</h1>
          <div className="lastUpdatedBox">
            <div>
              <h4>
                <span>Last updated by</span>
                <span>:</span>
              </h4>
              <p>{patientState.allergy.nameUpdated}</p>
            </div>
            <div>
              <h4>
                <span>Last verified by</span>
                <span>:</span>
              </h4>
              <p>{patientState.allergy.nameVerified}</p>
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

        <form className="allergyForm" onSubmit={(e) => handleSubmitAllergy(e)}>
          <div className="allergy-choice">
            <input
              type="checkbox"
              checked={allergyStatus === "unknown" ? true : false}
              onChange={(e) => setAllergyStatus("unknown")}
            />
            <label>Unknown</label>
          </div>

          <div className="allergy-choice">
            <input
              type="checkbox"
              checked={allergyStatus === "N" ? true : false}
              onChange={(e) => setAllergyStatus("N")}
            />
            <label>None</label>
          </div>

          <div className="allergy-choice">
            <input
              type="checkbox"
              checked={allergyStatus === "Y" ? true : false}
              onChange={(e) => setAllergyStatus("Y")}
            />
            <label>Allergic to</label>
          </div>

          {allergyStatus === "Y" ? (
            <div className="allergyExample">
              <div>
                <label>
                  <span>Food</span>
                  <span>:</span>
                </label>
                <input
                  type="text"
                  value={food}
                  onChange={(e) => setFood(e.target.value)}
                  placeholder="e.g. peanuts, eggs, milk"
                />
              </div>

              <div>
                <label>
                  <span>Medicine</span>
                  <span>:</span>
                </label>
                <input
                  type="text"
                  value={medicine}
                  onChange={(e) => setMedicine(e.target.value)}
                  placeholder="e.g. aspirin, anitibiotics, ibuprofen"
                />
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="saveAndCancelButton">
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
                  navigate(`/dashboard/patient/${params.patientId}`);
                  pageDispatch({
                    type: "SET_CURRENT_PAGE",
                    payload: "Patient Details",
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

export default Allergy;
