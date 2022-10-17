import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import PatientRegistration from "./PatientRegistration";
import SearchPatient from "./SearchPatient";
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import { usePageState, usePatientDispatch, usePatientState } from "../context";
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

function Home() {
  const patientLoading = usePatientState().loading;
  const pageLoading = usePageState().loading;

  const params = useParams();
  const navigate = useNavigate();
  const patientState = usePatientState();
  const patientDispatch = usePatientDispatch();
  async function resetCurrentPatient() {
    const patientId = params["*"].split("/")[1];
    console.log("id", patientId);
    await setCurrentPatient(patientDispatch, patientId);
  }

  useEffect(() => {
    if (params["*"].startsWith("patient")) {
      resetCurrentPatient();
    } else {
      return;
    }
    // window.location.reload();
    // alert("!23");
  }, []);

  return (
    <div className="bgHome">
      {/* Sidebar */}
      <Sidebar />

      {/* Header */}
      <div className="rightSide">
        <Header />

        {/* Section */}
        <div className="section">
          <Routes>
            <Route path="/" element={<SearchPatient />} />
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
          </Routes>
        </div>
      </div>
      <Loader loading={patientLoading ? patientLoading : pageLoading} />
    </div>
  );
}

export default Home;
