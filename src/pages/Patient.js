import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  FaClinicMedical,
  FaNotesMedical,
  FaTrash,
  FaStethoscope,
} from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { GiMedicines, GiStairsGoal } from "react-icons/gi";
import { MdBloodtype, MdNoFood } from "react-icons/md";
import { CgDanger } from "react-icons/cg";
// import { RiArrowGoBackFill } from "react-icons/ri";
import { TiArrowBack } from "react-icons/ti";
import { HiInformationCircle } from "react-icons/hi";
import {
  usePageDispatch,
  usePatientDispatch,
  usePatientState,
  useUserDispatch,
} from "../context";
import { useParams, useNavigate, Link } from "react-router-dom";
import { deletePatientById } from "../service";
import { collection, doc, getDoc, query } from "firebase/firestore";
import { firestore } from "../firebase";
import allergyLogo from "../../src/assets/allergy.png";
import { GoPrimitiveDot } from "react-icons/go";
import { fetchAllData } from "../service/PatientService";

function Patient() {
  const patientState = usePatientState();
  const patientDispatch = usePatientDispatch();
  const pageDispatch = usePageDispatch();
  const userDispatch = useUserDispatch();

  const navigate = useNavigate();
  const params = useParams();
  const patientId = params.patientId;
  const notification = patientState.notification;

  const [firstLoad, setFirstLoad] = useState(false);
  const [monitoringNotif, setMonitoringNotif] = useState(false);

  async function handleDeletePatient() {
    if (window.confirm("Are you sure you want to delete the patient?")) {
      patientDispatch({
        type: "SET_LOADING_TRUE",
      });

      await deletePatientById(patientId);
      await checkDeletedPatientIsExisted();

      pageDispatch({
        type: "SET_CURRENT_PAGE",
        payload: "Patient List",
      });

      navigate("/dashboard/patients");
      alert("Delete patient successfully");
    }

    patientDispatch({
      type: "SET_LOADING_FALSE",
    });
  }

  async function checkDeletedPatientIsExisted() {
    let check = false;

    do {
      let response = await (
        await getDoc(doc(firestore, "patient", patientId))
      ).data();

      if (response === undefined) {
        check = true;
      }
    } while (!check);
  }

  useEffect(() => {
    if (notification.SM_bleedingSymptom) {
      setMonitoringNotif(true);
    } else if (notification.SM_sugarLevel) {
      setMonitoringNotif(true);
    } else if (notification.SM_healthDiary) {
      setMonitoringNotif(true);
    } else if (notification.SM_bodyWeight) {
      setMonitoringNotif(true);
    } else if (notification.SM_bpAndHeartRate) {
      setMonitoringNotif(true);
    }
  }, []);

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
            <p>{patientState.currentPatient.phoneNo}</p>
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
              navigate("/dashboard/patients");
              pageDispatch({
                type: "SET_CURRENT_PAGE",
                payload: "Patient List",
              });
            }}
          >
            {/* <RiArrowGoBackFill /> */}
            <TiArrowBack style={{ fontSize: "22px" }} />
            <h4>Back</h4>
          </div>

          {/* <div
            className="deletePatientButton"
            onClick={() => handleDeletePatient()}
          >
            <FaTrash />
            <h4>Delete Patient</h4>
          </div> */}
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
            <div
              className="patientModule"
              onClick={() => {
                navigate(`medication`);
                pageDispatch({
                  type: "SET_CURRENT_PAGE",
                  payload: "Current Medication",
                });
              }}
            >
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
              {/* <MdNoFood className="iconModule" /> */}
              <img src={allergyLogo} className="iconModule" />
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
            <div
              className="patientModule"
              onClick={() => {
                navigate(`bloodThinner`);
                pageDispatch({
                  type: "SET_CURRENT_PAGE",
                  payload: "Blood Thinner / Clot Preventer",
                });
              }}
            >
              <MdBloodtype className="iconModule" />
              <h2>Blood Thinner </h2>
            </div>
          </Grid>

          <Grid item xs={3}>
            <div
              className="patientModule"
              onClick={() => {
                navigate(`patientMonitoring`);
                pageDispatch({
                  type: "SET_CURRENT_PAGE",
                  payload: "Review Patient Monitoring",
                });
              }}
            >
              {monitoringNotif && (
                <div style={{ position: "relative" }}>
                  <GoPrimitiveDot className="alertDot patientHome" />
                </div>
              )}
              <FaStethoscope className="iconModule" />
              <h2>Patient Monitoring</h2>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Patient;
