import React, { useEffect, useState } from "react";
import logoWhite from "../../src/assets/logo-white.png";
import logo2 from "../../src/assets/logo_2.png";
import { BsPencilSquare, BsPersonFill } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { IoMdNotifications } from "react-icons/io";
import { IoLogOutSharp } from "react-icons/io5";
import SidebarItem from "./SidebarItem";
import { useNavigate } from "react-router-dom";
import { useAuthDispatch } from "../context";
import { usePageDispatch } from "../context/PageContext";
import { fetchAllNotification, logout } from "../service";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase";

function Sidebar() {
  // State
  const [ac1, setAc1] = useState(true);
  const [ac2, setAc2] = useState(false);
  const [ac3, setAc3] = useState(false);
  const [ac4, setAc4] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);

  // Navigate
  const navigate = useNavigate();

  // Dispatch
  const dispatch = useAuthDispatch();
  const pageDispatch = usePageDispatch();
  const authDispatch = useAuthDispatch();

  const hcpId = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).id
    : "";

  function reset() {
    setAc1(false);
    setAc2(false);
    setAc3(false);
    setAc4(false);
  }

  function handleLogout() {
    logout(dispatch);
    navigate("/login");
    localStorage.removeItem("currentSection");
  }

  useEffect(() => {
    if (localStorage.getItem("currentSection")) {
      switch (JSON.parse(localStorage.getItem("currentSection"))) {
        case "Search Section":
          reset();
          setAc1((prev) => !prev);
          navigate("/dashboard");
          return;

        case "Register Section":
          reset();
          setAc2((prev) => !prev);
          navigate("/dashboard/patientRegistration");
          return;

        case "Notification Section":
          reset();
          setAc3((prev) => !prev);
          navigate("/dashboard/notification");
          return;

        case "Profile Section":
          reset();
          setAc4((prev) => !prev);
          navigate("/dashboard/profile");
          return;

        default:
          break;
      }
    }
  }, []);

  // get data instantly
  const q = query(
    collection(firestore, "notification"),
    where("registrationWeb", "==", false)
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    if (querySnapshot.docs.length > 0) {
      setHasNotification(true);
    } else {
      setHasNotification(false);
    }
  });

  return (
    <div className="sidebar">
      {/* <img src={logoWhite} alt="logo-white.png" /> */}
      <img src={logo2} alt="logo-white.png" />

      <div className="listItems">
        <div
          onClick={() => {
            reset();
            setAc1((prev) => !prev);
            localStorage.setItem(
              "currentSection",
              JSON.stringify("Search Section")
            );
            pageDispatch({
              type: "SET_CURRENT_PAGE",
              payload: "Patient List",
            });
            navigate("/dashboard");
          }}
          className="item-wrapper"
        >
          <SidebarItem
            Icon={<BiSearch />}
            section="Search"
            active={ac1}
            alert={false}
          />
        </div>

        <div
          onClick={() => {
            reset();
            setAc2((prev) => !prev);
            localStorage.setItem(
              "currentSection",
              JSON.stringify("Register Section")
            );
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
            alert={false}
          />
        </div>

        <div
          onClick={() => {
            reset();
            setAc3((prev) => !prev);
            localStorage.setItem(
              "currentSection",
              JSON.stringify("Notification Section")
            );
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
            alert={hasNotification}
          />
        </div>
        <div
          onClick={() => {
            reset();
            setAc4((prev) => !prev);
            localStorage.setItem(
              "currentSection",
              JSON.stringify("Profile Section")
            );
            pageDispatch({
              type: "SET_CURRENT_PAGE",
              payload: "Profile",
            });
            navigate("/dashboard/profile");
          }}
        >
          <SidebarItem
            Icon={<BsPersonFill />}
            section="Profile"
            active={ac4}
            alert={false}
          />
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
