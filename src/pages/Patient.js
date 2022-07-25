import { Grid } from "@mui/material";
import React from "react";
import { FaClinicMedical, FaNotesMedical, FaTrash } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { GiMedicines, GiStairsGoal } from "react-icons/gi";
import { MdBloodtype, MdNoFood } from "react-icons/md";
import { CgDanger } from "react-icons/cg";
import { RiArrowGoBackFill } from "react-icons/ri";
import { HiInformationCircle } from "react-icons/hi";
import { usePageDispatch, usePatientState } from "../context";
import { useParams, useNavigate, Link } from "react-router-dom";
import { deletePatientById } from "../service";

function Patient() {
  const patientState = usePatientState();
  const pageDispatch = usePageDispatch();

  const navigate = useNavigate();
  const params = useParams();
  const patientId = params.patientId;

  async function handleDeletePatient() {
    if (window.confirm("Are you sure you want to delete the patient?")) {
      await deletePatientById(patientId);
      navigate("/dashboard");
      pageDispatch({
        type: "SET_CURRENT_PAGE",
        payload: "Patient List",
      });
    } else {
      return;
    }
  }

  return (
    <div className="patient">
      {/* Upper part */}
      <div className="upper-part">
        <div className="patientDetails">
          <div className="detail">
            <h3>
              <span>Name</span>
              <span>:</span>
            </h3>
            <p>{patientState.currentPatient.name}</p>
          </div>
          <div className="detail">
            <h3>
              <span>Mobile Phone No.</span>
              <span>:</span>
            </h3>
            <p>{patientState.currentPatient.phoneNo.substring(2)}</p>
          </div>
          <div className="detail">
            <h3>
              <span>I/C No. / Passport No.</span>
              <span>:</span>
            </h3>
            <p>{patientState.currentPatient.icNo}</p>
          </div>
        </div>

        <div className="deletePatient">
          <div
            className="backToPatientList"
            onClick={() => {
              navigate("/dashboard");
              pageDispatch({
                type: "SET_CURRENT_PAGE",
                payload: "Patient List",
              });
            }}
          >
            <RiArrowGoBackFill />
            <h4>Back</h4>
          </div>

          <div
            className="deletePatientButton"
            onClick={() => handleDeletePatient()}
          >
            <FaTrash />
            <h4>Delete Patient</h4>
          </div>
        </div>
      </div>

      {/* Lower part */}
      <div className="lower-part">
        <Grid container spacing={4} className="gridContainer">
          <Grid item xs={3} className="gridItem">
            <div
              className="patientModule"
              onClick={() => {
                navigate(`patientProfile`);
                pageDispatch({
                  type: "SET_CURRENT_PAGE",
                  payload: "Patient Profile",
                });
              }}
            >
              <IoPersonCircle className="iconModule" />
              <h2>Patient Profile</h2>
            </div>
          </Grid>

          <Grid item xs={3}>
            <div
              className="patientModule"
              onClick={() => {
                navigate(`medicalCondition`);
                pageDispatch({
                  type: "SET_CURRENT_PAGE",
                  payload: "Medical Condition",
                });
              }}
            >
              <FaNotesMedical className="iconModule" />
              <h2>Medical Condition</h2>
            </div>
          </Grid>

          <Grid item xs={3}>
            <div className="patientModule">
              <GiMedicines className="iconModule" />
              <h2>Current Medication</h2>
            </div>
          </Grid>

          <Grid item xs={3}>
            <div
              className="patientModule"
              onClick={() => {
                navigate(`healthGoal`);
                pageDispatch({
                  type: "SET_CURRENT_PAGE",
                  payload: "Patient Health Goals",
                });
              }}
            >
              <GiStairsGoal className="iconModule" />
              <h2>Patient Health Goals</h2>
            </div>
          </Grid>

          <Grid item xs={3}>
            <div
              className="patientModule"
              onClick={() => {
                navigate(`allergy`);
                pageDispatch({
                  type: "SET_CURRENT_PAGE",
                  payload: "Allergy",
                });
              }}
            >
              <MdNoFood className="iconModule" />
              <h2>Allergy</h2>
            </div>
          </Grid>

          <Grid item xs={3}>
            <div
              className="patientModule"
              onClick={() => {
                navigate(`riskScoring`);
                pageDispatch({
                  type: "SET_CURRENT_PAGE",
                  payload: "Risk Scoring",
                });
              }}
            >
              <HiInformationCircle className="iconModule" />
              <h2>Risk Scoring</h2>
            </div>
          </Grid>

          <Grid item xs={3}>
            <div className="patientModule">
              <MdBloodtype className="iconModule" />
              <h2>Blood Thinner </h2>
            </div>
          </Grid>

          <Grid item xs={3}>
            <div className="patientModule">
              <FaClinicMedical className="iconModule" />
              <h2>Clinic Visit</h2>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Patient;
