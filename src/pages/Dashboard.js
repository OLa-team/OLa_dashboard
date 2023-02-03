import { Grid } from "@mui/material";
import {
  collection,
  documentId,
  FieldPath,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { FaUsers, FaUserPlus } from "react-icons/fa";
import { MdNotifications } from "react-icons/md";
import { GoAlert } from "react-icons/go";

function Dashboard() {
  const [totalPatient, setTotalPatient] = useState(0);
  const [newPatientRegistration, setNewPatientRegistration] = useState(0);
  const [patientHasNotifList, setPatientHasNotifList] = useState([]);
  const [overdueMonitoring, setOverdueMonitoring] = useState(0);

  // total patient
  const queryPatient = query(collection(firestore, "patient"));

  const unsubscribeQueryPatient = onSnapshot(queryPatient, (querySnapshot) => {
    setTotalPatient(querySnapshot.docs.length);
  });

  // new patient registration
  const queryNewPtRegistration = query(
    collection(firestore, "notification"),
    where("registrationWeb", "==", false)
  );

  const unsubscribeQueryNewPtRegistration = onSnapshot(
    queryNewPtRegistration,
    (querySnapshot) => {
      setNewPatientRegistration(querySnapshot.docs.length);
    }
  );

  // self monitoring update
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
        if (!patientHasNotifList.includes(doc.id)) {
          setPatientHasNotifList((id) => [...id, doc.id]);
        }
      });
    }
  });

  const unsubscribe2 = onSnapshot(qSugarLevel, (querySnapshot) => {
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.forEach((doc) => {
        if (!patientHasNotifList.includes(doc.id)) {
          setPatientHasNotifList((id) => [...id, doc.id]);
        }
      });
    }
  });

  const unsubscribe3 = onSnapshot(qBodyWeight, (querySnapshot) => {
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.forEach((doc) => {
        if (!patientHasNotifList.includes(doc.id)) {
          setPatientHasNotifList((id) => [...id, doc.id]);
        }
      });
    }
  });

  const unsubscribe4 = onSnapshot(qBleedingSymptom, (querySnapshot) => {
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.forEach((doc) => {
        if (!patientHasNotifList.includes(doc.id)) {
          setPatientHasNotifList((id) => [...id, doc.id]);
        }
      });
    }
  });

  const unsubscribe5 = onSnapshot(qHealthDiary, (querySnapshot) => {
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.forEach((doc) => {
        if (!patientHasNotifList.includes(doc.id)) {
          setPatientHasNotifList((id) => [...id, doc.id]);
        }
      });
    }
  });

  // overdue monitoring (i.e > 72 hrs)
  function getOverdueMonitoring() {
    let count = 0;
    patientHasNotifList
      .filter((value, index, self) => self.indexOf(value) === index)
      .forEach((patientId) => {
        const querySelfMonitor = query(
          collection(firestore, "self_monitor"),
          where(documentId(), "==", patientId)
        );

        const unsubscribe = onSnapshot(querySelfMonitor, (querySnapshot) => {
          querySnapshot.docs.forEach((doc) => {
            const lastUpdatedTime = new Date(doc.data().lastUpdated);
            const today = new Date();

            if (
              lastUpdatedTime.getTime() !== 0 &&
              diff_hours(lastUpdatedTime, today) > 72
            ) {
              count++;
            }
          });

          setOverdueMonitoring(count);
        });
      });
  }

  function diff_hours(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
  }

  useEffect(() => {
    getOverdueMonitoring();
  }, [patientHasNotifList]);

  return (
    <div className="dashboard">
      <div className="dashboardUpper">
        <Grid container spacing={4} className="gridContainer">
          <Grid item xs={3} className="gridItem">
            <div className="dashboardSection">
              <FaUsers className="iconModule" />
              <div>
                <h1>{totalPatient}</h1>
                <p>total patients</p>
              </div>
            </div>
          </Grid>
          <Grid item xs={3} className="gridItem">
            <div className="dashboardSection">
              <FaUserPlus className="iconModule" />
              <div>
                <h1>{newPatientRegistration}</h1>
                <p>new patient registration</p>
              </div>
            </div>
          </Grid>
          <Grid item xs={3} className="gridItem">
            <div className="dashboardSection">
              <MdNotifications className="iconModule" />
              <div>
                <h1>
                  {
                    patientHasNotifList.filter(
                      (value, index, self) => self.indexOf(value) === index
                    ).length
                  }
                </h1>
                <p>self-monitoring update</p>
              </div>
            </div>
          </Grid>
          <Grid item xs={3} className="gridItem">
            <div className="dashboardSection">
              <GoAlert className="iconModule" />
              <div>
                <h1>{overdueMonitoring}</h1>
                <p>overdue monitoring (i.e > 72hrs)</p>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>

      <div className="dashboardLower">
        <Grid container spacing={4} className="gridContainer">
          <Grid item xs={6} className="gridItem">
            <div className="dashboardSection"></div>
          </Grid>
          <Grid item xs={6}>
            <div className="dashboardSection"></div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Dashboard;
