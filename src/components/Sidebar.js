import React, { useEffect, useState } from "react";
import logo2 from "../../src/assets/logo_2.png";
import { BsPencilSquare, BsPersonFill } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { FiMonitor } from "react-icons/fi";
import { IoMdNotifications } from "react-icons/io";
import { ImExit } from "react-icons/im";
import { HiUsers } from "react-icons/hi";
import { SiSimpleanalytics } from "react-icons/si";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import SidebarItem from "./SidebarItem";
import { useNavigate } from "react-router-dom";
import { useAuthDispatch, useAuthState } from "../context";
import { usePageDispatch, usePageState } from "../context/PageContext";
import { fetchAllNotification, logout } from "../service";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase";

function Sidebar() {
  // Navigate
  const navigate = useNavigate();

  // Dispatch
  const pageDispatch = usePageDispatch();
  const authDispatch = useAuthDispatch();

  // Global State
  const currentUserState = useAuthState();
  const pageState = usePageState();

  const isUserAdmin = currentUserState.userDetails.isAdmin;
  const isUserHcp = currentUserState.userDetails.isHcp;
  const currentSection = localStorage.getItem("currentSection");

  // State
  const [ac0, setAc0] = useState(true);
  const [ac1, setAc1] = useState(false);
  const [ac2, setAc2] = useState(false);
  const [ac3, setAc3] = useState(false);
  const [ac4, setAc4] = useState(false);
  const [ac5, setAc5] = useState(false);
  const [ac6, setAc6] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [searchTabNotification, setSearchTabNotification] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [firstLoad, setFirstLoad] = useState(false);

  function reset() {
    setAc0(false);
    setAc1(false);
    setAc2(false);
    setAc3(false);
    setAc4(false);
    setAc5(false);
    setAc6(false);
  }

  function handleLogout() {
    logout(authDispatch);
    navigate("/login");
    localStorage.removeItem("currentSection");
  }

  useEffect(() => {
    if (currentSection) {
      switch (JSON.parse(currentSection)) {
        case "Dashboard Section":
          reset();
          setAc0((prev) => !prev);
          if (
            JSON.parse(localStorage.getItem("currentPage")) === "OLa Dashboard"
          ) {
            navigate("/dashboard");
          }
          return;

        case "Search Section":
          reset();
          setAc1((prev) => !prev);
          navigate("/dashboard/patients");
          // if (
          //   JSON.parse(localStorage.getItem("currentPage")) === "Patient List"
          // ) {
          //   navigate("/dashboard");
          // }
          return;

        case "Registration Section":
          reset();
          setAc2((prev) => !prev);
          navigate("/dashboard/registration");
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

        case "User List Section":
          reset();
          setAc5((prev) => !prev);
          navigate("/dashboard/users");
          return;

        case "App Analytics Section":
          reset();
          setAc6((prev) => !prev);
          navigate("/dashboard/appAnalytics");
          return;

        default:
          break;
      }
    }
  }, [currentSection]);

  useEffect(() => {
    if (pageState.openSidebar) {
      // console.log("open");
      setOpenSidebar("open");
    } else {
      // console.log("close");
      setOpenSidebar("");
    }
  }, [pageState.openSidebar]);

  // get data instantly
  // Notification
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
    <div className={`sidebar ${openSidebar}`}>
      {/* <img src={logoWhite} alt="logo-white.png" /> */}
      <img
        style={{ cursor: "pointer" }}
        src={logo2}
        alt="logo-white.png"
        onClick={() => {
          localStorage.setItem(
            "currentSection",
            JSON.stringify("Dashboard Section")
          );
          pageDispatch({
            type: "SET_CURRENT_PAGE",
            payload: "OLa Dashboard",
          });
          navigate("/");
        }}
      />

      <div className="listItems">
        <div
          onClick={() => {
            reset();
            setAc0((prev) => !prev);
            localStorage.setItem(
              "currentSection",
              JSON.stringify("Dashboard Section")
            );
            pageDispatch({
              type: "SET_CURRENT_PAGE",
              payload: "OLa Dashboard",
            });
            navigate("/dashboard");
          }}
          className="item-wrapper"
        >
          <SidebarItem
            Icon={<FiMonitor />}
            section="OLa Dashboard"
            active={ac0}
            alert={false}
          />
        </div>
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
            navigate("/dashboard/patients");
          }}
          className="item-wrapper"
        >
          <SidebarItem
            Icon={<BiSearch />}
            section="Patient Registry"
            active={ac1}
            alert={searchTabNotification}
          />
        </div>

        <div
          onClick={() => {
            reset();
            setAc2((prev) => !prev);
            localStorage.setItem(
              "currentSection",
              JSON.stringify("Registration Section")
            );
            pageDispatch({
              type: "SET_CURRENT_PAGE",
              payload: "Registration",
            });
            navigate("/dashboard/registration");
          }}
        >
          <SidebarItem
            Icon={<BsPencilSquare />}
            section="Registration"
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
            section="User Profile"
            active={ac4}
            alert={false}
          />
        </div>

        {isUserAdmin && (
          <>
            <div
              onClick={() => {
                reset();
                setAc5((prev) => !prev);
                localStorage.setItem(
                  "currentSection",
                  JSON.stringify("User List Section")
                );
                pageDispatch({
                  type: "SET_CURRENT_PAGE",
                  payload: "User List",
                });
                navigate("/dashboard/users");
              }}
            >
              <SidebarItem
                Icon={<HiUsers />}
                section="Admin & HCP"
                active={ac5}
                alert={false}
              />
            </div>
            <div
              onClick={() => {
                reset();
                setAc6((prev) => !prev);
                localStorage.setItem(
                  "currentSection",
                  JSON.stringify("App Analytics Section")
                );
                pageDispatch({
                  type: "SET_CURRENT_PAGE",
                  payload: "App Analytics",
                });
                navigate("/dashboard/appAnalytics");
              }}
            >
              <SidebarItem
                Icon={<TbDeviceDesktopAnalytics />}
                section="App Analytics"
                active={ac6}
                alert={false}
                // customStyle={{ cursor: "no-drop" }}
              />
            </div>
          </>
        )}

        <div
          onClick={() => {
            if (window.confirm("Are you sure you want to log out?")) {
              handleLogout();
            }
          }}
        >
          <SidebarItem Icon={<ImExit />} section="Log Out" />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
