import React, { useEffect, useState } from "react";
import Select from "react-select";
import Dropdown from "../components/Dropdown";
import { TiTick, TiDeleteOutline } from "react-icons/ti";
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

function HealthGoal() {
  const navigate = useNavigate();
  const params = useParams();

  const pageDispatch = usePageDispatch();
  const userState = useAuthState();
  const patientState = usePatientState();
  const patientDispatch = usePatientDispatch();
  const patientId = params.patientId;

  let defaultGoals = [
    "I will take my medicine as prescribed by the doctor",
    "I will exercise for 30 mins twice a week.",
    "I will reduce taking high calory food/fast food/fried food with high fat content intake.",
  ];

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
      setHealthGoalList((arr) => [...arr, `I will ${newHealthGoal}`]);

      setNewHealthGoal("");
    } else {
      alert("Please enter the goal before adding.");
    }
  }

  function handledDeleteGoal(e) {
    console.log(e.target.getAttribute("name"));
    let deleteGoal = e.target.getAttribute("name");
    console.log(deleteGoal);

    setHealthGoalList((healthGoalList) =>
      healthGoalList.filter((goal) => goal !== deleteGoal)
    );
  }
  console.log(healthGoalList);
  console.log(agreeToGoal);

  const dateTimeUpdated = patientState.healthGoal.dateTimeUpdated
    ? patientState.healthGoal.dateTimeUpdated.split("-")
    : "";

  let healthGoalData = {
    nameUpdated: userState.userDetails.username,
    dateTimeUpdated: getCurrentDate() + "-" + getCurrentTime(),
    healthGoalList: healthGoalList,
    agreeToGoal: agreeToGoal,
  };

  async function handleSubmitHealthGoal(e) {
    e.preventDefault();

    if (window.confirm("Are you sure you want to continue?")) {
      await updateHealthGoal(healthGoalData, patientId);
      await setCurrentPatient(patientDispatch, patientId);
      pageDispatch({
        type: "SET_CURRENT_PAGE",
        payload: "Risk Scoring",
      });
      alert("Update patient's health goal successfully.");
      navigate(`/dashboard/patient/${params.patientId}`);
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
                {dateTimeUpdated[0]} {dateTimeUpdated[1]}
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
            <input
              type="text"
              placeholder="Enter a new health goal"
              name="newHealthGoal"
              value={newHealthGoal}
              onChange={(e) => setNewHealthGoal(e.target.value)}
            />
            <button type="button" onClick={() => handleAddNewHealthGoal()}>
              Add
            </button>
          </div>

          <div className="healthGoalList">
            {defaultGoals.map((goal) => {
              return (
                <div>
                  <TiTick
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
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HealthGoal;
