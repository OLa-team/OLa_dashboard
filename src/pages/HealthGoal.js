import React, { useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { BsDot, BsExclamationLg } from "react-icons/bs";
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
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { firestore } from "../firebase";

function HealthGoal() {
  const navigate = useNavigate();
  const params = useParams();

  const pageDispatch = usePageDispatch();
  const currentUserState = useAuthState();
  const patientState = usePatientState();
  const patientDispatch = usePatientDispatch();
  const patientId = params.patientId;

  let defaultGoals = patientState.defaultHealthGoal.defaultGoal
    ? patientState.defaultHealthGoal.defaultGoal
    : [];
  let optionalGoalList = patientState.defaultHealthGoal.optionalGoal
    ? patientState.defaultHealthGoal.optionalGoal.map((goal) => ({
        id: goal,
        value: goal,
      }))
    : [];

  const [newHealthGoal, setNewHealthGoal] = useState("");
  const [healthGoalList, setHealthGoalList] = useState(
    patientState.healthGoal.healthGoalList
      ? patientState.healthGoal.healthGoalList
      : []
  );
  // const [agreeToGoal, setAgreeToGoal] = useState(
  //   patientState.healthGoal.agreeToGoal
  //     ? patientState.healthGoal.agreeToGoal
  //     : false
  // );
  let agreeToGoal = patientState.healthGoal.agreeToGoal
    ? patientState.healthGoal.agreeToGoal
    : false;

  const dateTimeUpdated = patientState.healthGoal.dateTimeUpdated
    ? patientState.healthGoal.dateTimeUpdated
    : "";

  function handleAddNewHealthGoal() {
    if (
      healthGoalList.includes(`I will ${newHealthGoal}`) ||
      healthGoalList.includes(newHealthGoal)
    ) {
      alert(
        "The health goal entered is already existed, please enter a new health goal."
      );
      return;
    }

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

  async function handleSubmitHealthGoal(e) {
    e.preventDefault();

    let healthGoalData = {
      nameUpdated: currentUserState.userDetails.username,
      dateTimeUpdated: new Date().getTime(),
      healthGoalList: healthGoalList,
      agreeToGoal: false,
    };

    if (window.confirm("Are you sure you want to continue?")) {
      await updateHealthGoal(healthGoalData, patientId);
      await setCurrentPatient(patientDispatch, patientId);
      alert("Update patient's health goal successfully.");
    }
  }

  const q = query(collection(firestore, "health_goal"));

  const agreeToGoalInstant = onSnapshot(q, (querySnapshot) => {
    const obj = querySnapshot.docs
      .filter((snapshot) => snapshot.id === patientId)[0]
      .data();
    if (obj !== null) {
      if (obj.agreeToGoal) {
        agreeToGoal = true;
      }
      console.log("agreeToGoal", agreeToGoal);
    }
  });

  return (
    <div className="wrapper">
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
              }}
              filters={[(optionalGoalList) => optionalGoalList]}
            />

            <button type="button" onClick={() => handleAddNewHealthGoal()}>
              Add
            </button>
          </div>

          <div className="healthGoalList">
            {defaultGoals.map((goal) => {
              return (
                <div key={goal}>
                  <BsDot
                    key={goal}
                    style={{
                      marginRight: "10px",
                      fontSize: "35px",
                    }}
                  />
                  {goal}
                </div>
              );
            })}

            {healthGoalList.map((goal) => {
              return (
                <div key={goal} className="eachGoal">
                  <BsDot
                    style={{
                      marginRight: "10px",
                      fontSize: "35px",
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

          {agreeToGoal === true ? (
            <div className="agreeToHealthGoal">
              <TiTick
                style={{
                  color: "lightgreen",
                  marginRight: "10px",
                  fontSize: "30px",
                }}
              />
              <p>The patient has agreed to follow the health goals</p>
            </div>
          ) : (
            <div className="agreeToHealthGoal">
              <BsExclamationLg
                style={{
                  color: "red",
                  marginRight: "10px",
                  fontSize: "20px",
                }}
              />
              <p>Please remind the patient to agree to the health goal</p>
            </div>
          )}

          <div className="saveAndCancelButton ">
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

export default HealthGoal;
