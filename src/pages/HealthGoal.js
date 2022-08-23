import React, { useState } from "react";
import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAuthState,
  usePageDispatch,
  usePatientDispatch,
  usePatientState,
} from "../context";
import { getCurrentDate, getCurrentTime } from "../utils";
import { setCurrentPatient, updateHealthGoal } from "../service";
import DatalistInput from "react-datalist-input";

function HealthGoal() {
  const navigate = useNavigate();
  const params = useParams();

  const pageDispatch = usePageDispatch();
  const userState = useAuthState();
  const patientState = usePatientState();
  const patientDispatch = usePatientDispatch();
  const patientId = params.patientId;

  let defaultGoals = Object.values(patientState.defaultHealthGoal)[1];
  let optionalGoalList = Object.values(patientState.defaultHealthGoal)[0].map(
    (goal) => ({ id: goal, value: goal })
  );

  console.log("default", Object.values(patientState.defaultHealthGoal));

  const [newHealthGoal, setNewHealthGoal] = useState("");
  const [healthGoalList, setHealthGoalList] = useState(
    patientState.healthGoal.healthGoalList
      ? patientState.healthGoal.healthGoalList
      : []
  );
  const [agreeToGoal, setAgreeToGoal] = useState(
    patientState.healthGoal.agreeToGoal
      ? patientState.healthGoal.agreeToGoal
      : false
  );

  function handleAddNewHealthGoal() {
    if (newHealthGoal !== "") {
      if (newHealthGoal.startsWith("I will")) {
        setHealthGoalList((arr) => [...arr, newHealthGoal]);
      } else {
        setHealthGoalList((arr) => [...arr, `I will ${newHealthGoal}`]);
      }

      setNewHealthGoal("");
    } else {
      alert("Please enter the goal before adding.");
    }
  }

  function handledDeleteGoal(e) {
    console.log(e.target.getAttribute("name"));
    let deleteGoal = e.target.getAttribute("name");

    setHealthGoalList((healthGoalList) =>
      healthGoalList.filter((goal) => goal !== deleteGoal)
    );
  }

  const dateTimeUpdated = patientState.healthGoal.dateTimeUpdated
    ? patientState.healthGoal.dateTimeUpdated
    : "";

  let healthGoalData = {
    nameUpdated: userState.userDetails.username,
    dateTimeUpdated: new Date().getTime(),
    healthGoalList: healthGoalList,
    agreeToGoal: agreeToGoal,
  };

  async function handleSubmitHealthGoal(e) {
    e.preventDefault();

    if (agreeToGoal === false) {
      alert("Please agree to follow the health goals");
      return;
    }

    if (window.confirm("Are you sure you want to continue?")) {
      await updateHealthGoal(healthGoalData, patientId);
      await setCurrentPatient(patientDispatch, patientId);
      alert("Update patient's health goal successfully.");
    } else {
      return;
    }
  }

  return (
    <div className="healthGoal">
      <div style={{ padding: "50px 70px", height: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1>My Health Goals</h1>
          <div className="lastUpdatedBox">
            <div>
              <h4>
                <span>Last updated by</span>
                <span>:</span>
              </h4>
              <p>{patientState.healthGoal.nameUpdated}</p>
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
          className="healthGoalForm"
          onSubmit={(e) => {
            handleSubmitHealthGoal(e);
          }}
        >
          <div className="addHealthGoal">
            <DatalistInput
              value={newHealthGoal}
              items={optionalGoalList}
              placeholder="Enter or select the goal"
              onChange={(e) => setNewHealthGoal(e.target.value)}
              onSelect={(item) => {
                setNewHealthGoal(item.value);
                console.log(item.value);
              }}
            />

            <button type="button" onClick={() => handleAddNewHealthGoal()}>
              Add
            </button>
          </div>

          <div className="healthGoalList">
            {defaultGoals.map((goal) => {
              return (
                <div key={goal}>
                  <TiTick
                    key={goal}
                    style={{
                      color: "lightgreen",
                      marginRight: "10px",
                      fontSize: "30px",
                    }}
                  />
                  {goal}
                </div>
              );
            })}

            {healthGoalList.map((goal) => {
              return (
                <div key={goal} className="eachGoal">
                  <TiTick
                    style={{
                      color: "lightgreen",
                      marginRight: "10px",
                      fontSize: "30px",
                    }}
                  />
                  {goal}
                  <IoClose
                    className="deleteGoalIcon"
                    name={goal}
                    onClick={(e) => handledDeleteGoal(e)}
                  />
                </div>
              );
            })}
          </div>

          <div className="agreeToHealthGoal">
            <input
              type="checkbox"
              checked={agreeToGoal}
              onChange={(prev) => setAgreeToGoal((prev) => !prev)}
            />
            <p>I agree to follow my health goals</p>
          </div>

          <div className="saveAndCancelButton ">
            <button className="saveProfile" type="submit">
              Save
            </button>
            <button
              type="button"
              className="cancelProfile"
              onClick={() => {
                navigate(`/dashboard/patient/${params.patientId}/`);
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

export default HealthGoal;
