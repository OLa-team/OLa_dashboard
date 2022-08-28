import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { CgMenu } from "react-icons/cg";
import { IoPersonCircle } from "react-icons/io5";
import PatientRegistration from "./PatientRegistration";
import SearchPatient from "./SearchPatient";
import { Routes, Route } from "react-router-dom";
import { useAuthState, usePageState, usePatientState } from "../context";
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

function Home() {
  // Global state
  const userState = useAuthState();
  const pageState = usePageState();
  const { loading } = usePatientState();

  return (
    <div className="bgHome">
      {/* Sidebar */}
      <Sidebar />

      {/* Header */}
      <div className="rightSide">
        <div className="header">
          <div className="headerDetails">
            <div className="leftDetail">
              <CgMenu className="menu-icon" />
              <h2>{pageState.currentPage}</h2>
            </div>

            <div className="rightDetail">
              <IoPersonCircle className="profile-icon" />
              <div className="userDetail">
                <h4>{userState.userDetails.username}</h4>
                <p>HCP</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section */}
        <div className="section">
          <Routes>
            <Route path="/" element={<SearchPatient />} />
            <Route
              path="/patientRegistration"
              element={<PatientRegistration />}
            />
            <Route path="/notification" element={<Notification />} />
            <Route path="/profile" element={<Profile />} />
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
      <Loader loading={loading} />
    </div>
  );
}

export default Home;
