import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FaHeartbeat, FaWeight, FaEnvelope } from "react-icons/fa";
import { MdOutlineBloodtype } from "react-icons/md";
import { BiDonateBlood } from "react-icons/bi";
import { RiHealthBookFill } from "react-icons/ri";
import { BsArrowLeft } from "react-icons/bs";
import {
  usePageDispatch,
  usePatientDispatch,
  usePatientState,
} from "../../context";
import { useNavigate, useParams } from "react-router-dom";
import { GoPrimitiveDot } from "react-icons/go";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../../firebase";
import { updateSMNotification } from "../../service";

function PatientMonitoring() {
  const patientState = usePatientState();
  const patientDispatch = usePatientDispatch();
  const pageDispatch = usePageDispatch();

  const navigate = useNavigate();
  const params = useParams();
  const patientId = params.patientId;
  const notification = patientState.notification;

  const [healthDiaryNotif, setHealthDiaryNotif] = useState(false);
  const [bleedingSymptomNotif, setBleedingSymptomNotif] = useState(false);
  const [sugarLevelNotif, setSugarLevelNotif] = useState(false);
  const [bodyWeightNotif, setBodyWeightNotif] = useState(false);
  const [bpAndHeartRateNotif, setBpAndHeartRateNotif] = useState(false);

  useEffect(() => {
    if (notification.SM_bleedingSymptom) {
      setBleedingSymptomNotif(true);
    }
    if (notification.SM_sugarLevel) {
      setSugarLevelNotif(true);
    }
    if (notification.SM_healthDiary) {
      setHealthDiaryNotif(true);
    }
    if (notification.SM_bodyWeight) {
      setBodyWeightNotif(true);
    }
    if (notification.SM_bpAndHeartRate) {
      setBpAndHeartRateNotif(true);
    }
  }, []);

  const qBpAndHeartRate = query(
    collection(firestore, "notification"),
    where("SM_bpAndHeartRate", "==", true)
  );
  const qSugarLevel = query(
    collection(firestore, "notification"),
    where("SM_sugarLevel", "==", true)
  );
  const qBodyWeight = query(
    collection(firestore, "notification"),
    where("SM_bodyWeight", "==", true)
  );
  const qBleedingSymptom = query(
    collection(firestore, "notification"),
    where("SM_bleedingSymptom", "==", true)
  );
  const qHealthDiary = query(
    collection(firestore, "notification"),
    where("SM_healthDiary", "==", true)
  );

  const unsubscribe1 = onSnapshot(qBpAndHeartRate, (querySnapshot) => {
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.forEach((doc) => {
        if (patientId === doc.id) {
          setBpAndHeartRateNotif(true);
          updateNotifLocalStorage();
        }
      });
    }
  });

  const unsubscribe2 = onSnapshot(qSugarLevel, (querySnapshot) => {
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.forEach((doc) => {
        if (patientId === doc.id) {
          setSugarLevelNotif(true);
          updateNotifLocalStorage();
        }
      });
    }
  });

  const unsubscribe3 = onSnapshot(qBodyWeight, (querySnapshot) => {
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.forEach((doc) => {
        if (patientId === doc.id) {
          setBodyWeightNotif(true);
          updateNotifLocalStorage();
        }
      });
    }
  });

  const unsubscribe4 = onSnapshot(qBleedingSymptom, (querySnapshot) => {
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.forEach((doc) => {
        if (patientId === doc.id) {
          setBleedingSymptomNotif(true);
          updateNotifLocalStorage();
        }
      });
    }
  });
  const unsubscribe5 = onSnapshot(qHealthDiary, (querySnapshot) => {
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.forEach((doc) => {
        if (patientId === doc.id) {
          setHealthDiaryNotif(true);
          updateNotifLocalStorage();
        }
      });
    }
  });

  async function updateNotifLocalStorage() {
    let responseNotification = await (
      await getDoc(doc(firestore, "notification", patientId))
    ).data();
    if (responseNotification) {
      patientDispatch({
        type: "SET_NOTIFICATION",
        payload: responseNotification,
      });

      localStorage.setItem(
        "notification",
        JSON.stringify(responseNotification)
      );
    } else {
      patientDispatch({
        type: "SET_NOTIFICATION",
        payload: {},
      });

      localStorage.setItem("notification", JSON.stringify({}));
      alert("Error in fetching notification data in module");
    }
  }

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
              {bpAndHeartRateNotif && (
                <div style={{ position: "relative" }}>
                  <GoPrimitiveDot className="alertDot monitoring" />
                </div>
              )}
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
              {sugarLevelNotif && (
                <div style={{ position: "relative" }}>
                  <GoPrimitiveDot className="alertDot monitoring" />
                </div>
              )}
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
              {bodyWeightNotif && (
                <div style={{ position: "relative" }}>
                  <GoPrimitiveDot className="alertDot monitoring" />
                </div>
              )}
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
              {bleedingSymptomNotif && (
                <div style={{ position: "relative" }}>
                  <GoPrimitiveDot className="alertDot monitoring" />
                </div>
              )}
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
