import React, { useEffect, useState } from "react";
import { CgMenu } from "react-icons/cg";
import { IoPersonCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import {
  useAuthState,
  usePageDispatch,
  usePageState,
  usePatientState,
} from "../context";

function Header() {
  const navigate = useNavigate();

  const currentUserState = useAuthState();
  const pageState = usePageState();
  const pageDispatch = usePageDispatch();
  const patientState = usePatientState();

  const isUserAdmin = currentUserState.userDetails.isAdmin;
  const isUserHcp = currentUserState.userDetails.isHcp;
  const role =
    isUserAdmin && isUserHcp ? "Admin & HCP" : isUserAdmin ? "Admin" : "HCP";

  function openSidebar() {
    if (!pageState.openSidebar) {
      pageDispatch({
        type: "OPEN_SIDEBAR",
      });
    } else {
      pageDispatch({
        type: "CLOSE_SIDEBAR",
      });
    }
  }

  function checkCurrentPage() {
    return (
      pageState.currentPage === "OLa Dashboard" ||
      pageState.currentPage === "Patient List" ||
      pageState.currentPage === "Patient Details" ||
      pageState.currentPage === "Patient Profile" ||
      pageState.currentPage === "Registration" ||
      pageState.currentPage === "Notification" ||
      pageState.currentPage === "Profile" ||
      pageState.currentPage === "User List" ||
      pageState.currentPage === "App Analytics"
    );
  }

  return (
    <div className="header">
      <div className="headerDetails">
        <div className="leftDetail">
          <CgMenu className="menu-icon" onClick={openSidebar} />
          <h2>{pageState.currentPage}</h2>
        </div>

        <h2
          style={{
            fontWeight: "normal",
            // position: "absolute",
            // right: " 620px",
            // top: "25px",
            // textAlign: "left",
          }}
        >
          {checkCurrentPage() ? "" : `${patientState.currentPatient.name}`}
        </h2>

        <div
          className="rightDetail"
          onClick={() => {
            localStorage.setItem(
              "currentSection",
              JSON.stringify("Profile Section")
            );
            pageDispatch({
              type: "SET_CURRENT_PAGE",
              payload: "Profile",
            });
            navigate("/profile");
          }}
        >
          <IoPersonCircle className="profile-icon" />
          <div className="userDetail">
            <h4>{currentUserState.userDetails.username}</h4>
            <p>{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
