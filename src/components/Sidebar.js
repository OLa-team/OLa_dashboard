import React, { useState } from "react";
import logoWhite from "../../src/assets/logo-white.png";
import { BsPencilSquare, BsPersonFill } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { IoMdNotifications } from "react-icons/io";
import { IoLogOutSharp } from "react-icons/io5";
import SidebarItem from "./SidebarItem";
import { useNavigate } from "react-router-dom";
import { useAuthDispatch } from "../context";
import { usePageDispatch } from "../context/PageContext";
import { logout } from "../service";
import { setCurrentHcp } from "../service/AuthService";

function Sidebar() {
  // State
  const [ac1, setAc1] = useState(true);
  const [ac2, setAc2] = useState(false);
  const [ac3, setAc3] = useState(false);
  const [ac4, setAc4] = useState(false);

  // Navigate
  const navigate = useNavigate();

  // Dispatch
  const dispatch = useAuthDispatch();
  const pageDispatch = usePageDispatch();
  const authDispatch = useAuthDispatch();

  const hcpId = JSON.parse(localStorage.getItem("currentUser")).id;

  function reset() {
    setAc1(false);
    setAc2(false);
    setAc3(false);
    setAc4(false);
  }

  function handleLogout() {
    logout(dispatch);
    navigate("/login");
    localStorage.removeItem("currentPageNumber");
  }

  window.onload = () => {
    console.log("reload");

    if (localStorage.getItem("currentPageNumber")) {
      console.log("run");
      switch (JSON.parse(localStorage.getItem("currentPageNumber"))) {
        case 1:
          reset();
          setAc1((prev) => !prev);
          return;

        case 2:
          reset();
          setAc2((prev) => !prev);
          return;

        case 3:
          reset();
          setAc3((prev) => !prev);
          return;

        case 4:
          reset();
          setAc4((prev) => !prev);
          return;

        default:
          break;
      }
    }
  };

  return (
    <div className="sidebar">
      <img src={logoWhite} alt="logo-white.png" />

      <div className="listItems">
        <div
          onClick={() => {
            reset();
            setAc1((prev) => !prev);
            localStorage.setItem("currentPageNumber", JSON.stringify(1));
            pageDispatch({
              type: "SET_CURRENT_PAGE",
              payload: "Patient List",
            });
            navigate("/dashboard");
          }}
          className="item-wrapper"
        >
          <SidebarItem Icon={<BiSearch />} section="Search" active={ac1} />
        </div>

        <div
          onClick={() => {
            reset();
            setAc2((prev) => !prev);
            localStorage.setItem("currentPageNumber", JSON.stringify(2));
            pageDispatch({
              type: "SET_CURRENT_PAGE",
              payload: "Patient Registration",
            });
            navigate("/dashboard/patientRegistration");
          }}
        >
          <SidebarItem
            Icon={<BsPencilSquare />}
            section="Register"
            active={ac2}
          />
        </div>

        <div
          onClick={() => {
            reset();
            setAc3((prev) => !prev);
            localStorage.setItem("currentPageNumber", JSON.stringify(3));
            pageDispatch({
              type: "SET_CURRENT_PAGE",
              payload: "Notification",
            });
            navigate("/dashboard/notification");
          }}
        >
          <SidebarItem
            Icon={<IoMdNotifications />}
            section="Notification"
            active={ac3}
          />
        </div>
        <div
          onClick={() => {
            reset();
            setAc4((prev) => !prev);
            localStorage.setItem("currentPageNumber", JSON.stringify(4));
            pageDispatch({
              type: "SET_CURRENT_PAGE",
              payload: "Profile",
            });
            setCurrentHcp(authDispatch, hcpId);
            navigate("/dashboard/profile");
          }}
        >
          <SidebarItem Icon={<BsPersonFill />} section="Profile" active={ac4} />
        </div>
        <div
          onClick={() => {
            if (window.confirm("Are you sure you want to log out?")) {
              handleLogout();
            } else {
              return;
            }
          }}
        >
          <SidebarItem Icon={<IoLogOutSharp />} section="Log Out" />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
