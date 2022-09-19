import React, { useEffect } from "react";
import { CgMenu } from "react-icons/cg";
import { IoPersonCircle } from "react-icons/io5";
import { useAuthState, usePageState } from "../context";

function Header() {
  const userState = useAuthState();
  const pageState = usePageState();

  var windowWidth;
  window.onresize = window.onload = function () {
    windowWidth = this.innerWidth;
    console.log("width", windowWidth < 1100);
  };

  function openSiderbar() {
    // if (windowWidth < 1100) {
    //   alert(windowWidth);
    //   console.log(document.getElementsByClassName("sidebar").style.width);
    // }
  }

  return (
    <div className="header">
      <div className="headerDetails">
        <div className="leftDetail">
          <CgMenu className="menu-icon" onClick={() => openSiderbar()} />
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
  );
}

export default Header;
