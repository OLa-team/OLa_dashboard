import React, { useEffect, useState } from "react";
import { CgMenu } from "react-icons/cg";
import { IoPersonCircle } from "react-icons/io5";
import { useAuthState, usePageState } from "../context";

function Header() {
  const currentUserState = useAuthState();
  const pageState = usePageState();

  const isUserAdmin = currentUserState.userDetails.isAdmin;
  const isUserHcp = currentUserState.userDetails.isHcp;
  const role =
    isUserAdmin && isUserHcp ? "Admin & HCP" : isUserAdmin ? "Admin" : "HCP";

  return (
    <div className="header">
      <div className="headerDetails">
        <div className="leftDetail">
          <CgMenu className="menu-icon" />
          <h2>{pageState.currentPage}</h2>
        </div>

        <div className="rightDetail">
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
