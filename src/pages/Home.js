import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import PatientRegistration from "./PatientRegistration";
import SearchPatient from "./SearchPatient";
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import {
  usePageState,
  usePatientDispatch,
  usePatientState,
  useUserDispatch,
  useUserState,
} from "../context";
import Patient from "./Patient";
import PatientProfile from "./PatientProfile";
import MedicalCondition from "./MedicalCondition";
import Allergy from "./Allergy";
import HealthGoal from "./HealthGoal";
import RiskScoring from "./RiskScoring/RiskScoring";
import StrokeRisk from "./RiskScoring/StrokeRisk";
import BleedingRisk from "./RiskScoring/BleedingRisk";
import WarfarinQuality from "./RiskScoring/WarfarinQuality";
import Loader from "../components/Loader";
import Medication from "./Medication";
import BloodThinner from "./BloodThinner/BloodThinner";
import BTTable from "./BloodThinner/BTTable";
import BTGraph from "./BloodThinner/BTGraph";
import Profile from "./Profile";
import PatientMonitoring from "./PatientMonitoring/PatientMonitoring";
import BPAndHeartRate from "./PatientMonitoring/BPAndHeartRate";
import BloodSugarLevel from "./PatientMonitoring/BloodSugarLevel";
import BodyWeight from "./PatientMonitoring/BodyWeight";
import BleedingSymptom from "./PatientMonitoring/BleedingSymptom";
import HealthDiaryRecord from "./PatientMonitoring/HealthDiaryRecord";
import Notification from "./Notification";
import Hemoglobin from "./BloodThinner/Hemoglobin";
import Header from "../components/Header";
import UserList from "./UserList";
import AppAnalytics from "./AppAnalytics";
import { setCurrentPatient } from "../service";
import MessageForPatient from "./PatientMonitoring/MessageForPatient";
import Dashboard from "./Dashboard";
import { fetchAllData } from "../service/PatientService";
import LoadingBar from "react-top-loading-bar";

function Home() {
  const patientLoading = usePatientState().loading;
  const pageLoading = usePageState().loading;

  const params = useParams();
  const navigate = useNavigate();
  const patientState = usePatientState();
  const pageState = usePageState();
  const userState = useUserState();

  const patientDispatch = usePatientDispatch();
  const userDispatch = useUserDispatch();

  const [openSidebar, setOpenSidebar] = useState("");

  async function resetCurrentPatient() {
    const patientId = params["*"].split("/")[1];
    await setCurrentPatient(patientDispatch, patientId);
    navigate(-1);
  }

  useEffect(() => {
    console.log(params["*"].startsWith("patient/"));
    if (params["*"].startsWith("patient/")) {
      resetCurrentPatient();
    }

    fetchAllData(userDispatch);
  }, []);

  return (
    <div className="bgHome">
      {userState.progress > 0 && userState.progress < 100 ? (
        <div className="bgPending"></div>
      ) : null}
      <LoadingBar
        color="red"
        progress={userState.progress}
        onLoaderFinished={() => {
          userDispatch({
            type: "RESET_PROGRESS",
          });
        }}
      />
      {/* Sidebar */}
      <Sidebar />

      {/* Header */}
      <div className="rightSide">
        <Header />

        {/* Section */}
        <div className={`section ${openSidebar}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<SearchPatient />} />
            <Route path="/registration" element={<PatientRegistration />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/appAnalytics" element={<AppAnalytics />} />
            <Route path="/patient/:patientId" element={<Patient />} />
            <Route
              path="/patient/:patientId/patientProfile"
              element={<PatientProfile />}
            />
            <Route
              path="/patient/:patientId/medicalCondition"
              element={<MedicalCondition />}
            />
            <Route path="/patient/:patientId/allergy" element={<Allergy />} />
            <Route
              path="/patient/:patientId/healthGoal"
              element={<HealthGoal />}
            />
            <Route
              path="/patient/:patientId/riskScoring"
              element={<RiskScoring />}
            />
            <Route
              path="/patient/:patientId/riskScoring/strokeRisk"
              element={<StrokeRisk />}
            />
            <Route
              path="/patient/:patientId/riskScoring/bleedingRisk"
              element={<BleedingRisk />}
            />
            <Route
              path="/patient/:patientId/riskScoring/warfarinQuality"
              element={<WarfarinQuality />}
            />
            <Route
              path="/patient/:patientId/medication"
              element={<Medication />}
            />
            <Route
              path="/patient/:patientId/bloodThinner"
              element={<BloodThinner />}
            />
            <Route
              path="/patient/:patientId/bloodThinner/table"
              element={<BTTable />}
            />
            <Route
              path="/patient/:patientId/bloodThinner/graph"
              element={<BTGraph />}
            />
            <Route
              path="/patient/:patientId/bloodThinner/hemoglobin"
              element={<Hemoglobin />}
            />
            <Route
              path="/patient/:patientId/patientMonitoring"
              element={<PatientMonitoring />}
            />
            <Route
              path="/patient/:patientId/patientMonitoring/bloodPressure&HeartRate"
              element={<BPAndHeartRate />}
            />
            <Route
              path="/patient/:patientId/patientMonitoring/bloodSugarLevel"
              element={<BloodSugarLevel />}
            />
            <Route
              path="/patient/:patientId/patientMonitoring/bodyWeight"
              element={<BodyWeight />}
            />
            <Route
              path="/patient/:patientId/patientMonitoring/bleedingSymptom"
              element={<BleedingSymptom />}
            />
            <Route
              path="/patient/:patientId/patientMonitoring/healthDiary"
              element={<HealthDiaryRecord />}
            />
            <Route
              path="/patient/:patientId/patientMonitoring/messageForPatients"
              element={<MessageForPatient />}
            />
          </Routes>
        </div>
      </div>
      <Loader loading={patientLoading ? patientLoading : pageLoading} />
    </div>
  );
}

export default Home;
