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
import RiskScoring from "./RiskScoring";
import StrokeRisk from "./StrokeRisk";
import BleedingRisk from "./BleedingRisk";
import WarfarinQuality from "./WarfarinQuality";
import Loading from "./Loading";

function Home() {
  // Global state
  const userState = useAuthState();
  const pageState = usePageState();
  const { loading } = usePatientState();
  console.log("Loading", loading);

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
          </Routes>
        </div>
      </div>
      <Loading loading={loading} />
    </div>
  );
}

export default Home;
