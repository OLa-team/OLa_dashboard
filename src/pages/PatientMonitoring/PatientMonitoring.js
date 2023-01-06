import { Grid } from "@mui/material";
import React from "react";
import { FaHeartbeat, FaWeight, FaEnvelope } from "react-icons/fa";
import { MdOutlineBloodtype } from "react-icons/md";
import { BiDonateBlood } from "react-icons/bi";
import { RiHealthBookFill } from "react-icons/ri";
import { BsArrowLeft } from "react-icons/bs";
import { usePageDispatch, usePatientState } from "../../context";
import { useNavigate, useParams } from "react-router-dom";
import { GoPrimitiveDot } from "react-icons/go";

function PatientMonitoring() {
  const patientState = usePatientState();
  const pageDispatch = usePageDispatch();

  const navigate = useNavigate();
  const params = useParams();
  const patientId = params.patientId;
  const healthDiaryNotif = patientState.healthDiaryNotif;

  return (
    <div className="patientMonitoring">
      <div className="monitoringWrapper">
        <BsArrowLeft
          className="backArrow"
          onClick={() => {
            navigate(`/dashboard/patient/${params.patientId}`);
            pageDispatch({
              type: "SET_CURRENT_PAGE",
              payload: "Patient Details",
            });
          }}
        />

        <h1 style={{ textAlign: "center" }}>Patient monitoring</h1>

        <Grid container spacing={3} className="gridContainer">
          <Grid item xs={4} className="gridItem">
            <div
              className="monitoringModule"
              onClick={() => {
                navigate(`bloodPressure&HeartRate`);
              }}
            >
              <FaHeartbeat className="iconModule" />
              <h3>Blood Pressure & Heart Rate</h3>
            </div>
          </Grid>

          <Grid item xs={4} className="gridItem">
            <div
              className="monitoringModule"
              onClick={() => {
                navigate(`bloodSugarLevel`);
              }}
            >
              <MdOutlineBloodtype className="iconModule" />
              <h2>Sugar Level</h2>
            </div>
          </Grid>

          <Grid item xs={4} className="gridItem">
            <div
              className="monitoringModule"
              onClick={() => {
                navigate(`bodyWeight`);
              }}
            >
              <FaWeight className="iconModule" />
              <h2>Body Weight</h2>
            </div>
          </Grid>

          <Grid item xs={4} className="gridItem">
            <div
              className="monitoringModule"
              onClick={() => {
                navigate(`bleedingSymptom`);
              }}
            >
              <BiDonateBlood className="iconModule" />
              <h2>Bleeding Symptom</h2>
            </div>
          </Grid>

          <Grid item xs={4} className="gridItem">
            <div
              className="monitoringModule"
              onClick={() => {
                navigate(`healthDiary`);
              }}
            >
              {healthDiaryNotif && (
                <div style={{ position: "relative" }}>
                  <GoPrimitiveDot className="alertDot monitoring" />
                </div>
              )}
              <RiHealthBookFill className="iconModule" />
              <h2>Health Diary Record</h2>
            </div>
          </Grid>

          <Grid item xs={4} className="gridItem">
            <div
              className="monitoringModule"
              onClick={() => {
                navigate(`messageForPatients`);
              }}
            >
              <FaEnvelope className="iconModule" />
              <h2>Message for patients</h2>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default PatientMonitoring;
