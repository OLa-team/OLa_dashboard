import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import { BsArrowLeft } from "react-icons/bs";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase";
import {
  createPatientAccount,
  fetchAllNotification,
  updatePatientRegistrationNotification,
} from "../service";
import { getCurrentDate, getCurrentTime } from "../utils";
import { useNavigate } from "react-router-dom";
import { usePageDispatch, usePatientDispatch } from "../context";

function Notification() {
  const navigate = useNavigate();
  const patientDispatch = usePatientDispatch();

  const [page, setPage] = useState("table");
  const [pendingNotification, setPendingNotification] = useState([]);
  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [icNo, setIcNo] = useState("");
  const [patientId, setPatientId] = useState("");

  const style = {
    height: "95%",
    width: "100%",
    margin: "auto",
  };

  const gridStyle = {
    minHeight: "600",
    fontSize: "17px",
    fontWeight: "normal",
    marginTop: "10px",
    width: "100%",
    border: "none",
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "No.", width: 50, hide: true },
    {
      field: "dateTime",
      headerName: "Date & Time",
      flex: 1,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 3,
    },
    {
      field: "button",
      headerName: "Action",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <div style={{ width: "100%", textAlign: "center" }}>
            <button
              className="action"
              onClick={() => viewNotificationDetails(params.row)}
            >
              View Details
            </button>
          </div>
        );
      },
    },
  ];

  // const data = [
  //   {
  //     id: 1,
  //     dateTime: "2022-04-03 15:03",
  //     title: "Heng Ong Huat requests to register a new account.",
  //   },
  //   {
  //     id: 2,
  //     dateTime: "2022-04-03 15:03",
  //     title: "Heng Ong Huat requests to register a new account.",
  //   },
  // ];

  const data =
    pendingNotification.length > 0
      ? pendingNotification.map((notif) => ({
          id: notif.id,
          dateTime:
            getCurrentDate(notif.registration.time) +
            " " +
            getCurrentTime(notif.registration.time),
          title: `${notif.registration.name} requests to register a new account.`,
          details: notif.registration,
        }))
      : [];

  function viewNotificationDetails(row) {
    setPage("details");

    console.log("row", row);
    setName(row.details.name);
    setPhoneNo(row.details.phoneNo);
    setIcNo(row.details.icNo);
    setPatientId(row.id);
  }

  async function approveRegistration() {
    if (window.confirm("Are you sure to proceed?")) {
      const newPatientData = {
        name: name,
        phoneNo: phoneNo,
        icNo: icNo,
        patientId: patientId,
      };

      await updatePatientRegistrationNotification(patientId);
      createPatientAccount(newPatientData, patientDispatch);

      setPage("table");
      setPendingNotification(
        pendingNotification.filter((notif) => notif.id !== patientId)
      );

      alert("Patient register successfully!");
    }
  }

  async function rejectRegistration() {
    if (window.confirm("Are you sure to proceed?")) {
      await updatePatientRegistrationNotification(patientId);
      setPendingNotification(
        pendingNotification.filter((notif) => notif.id !== patientId)
      );
      setPage("table");
    }
  }

  async function getAllNotification() {
    const notificationData = await fetchAllNotification();
    let pendingRequestList = [];

    notificationData.forEach((notif) => {
      if (notif.registrationMobile && !notif.registrationWeb) {
        pendingRequestList.push(notif);
      }
    });

    if (pendingRequestList.length > 0) {
      setPendingNotification(pendingRequestList);
    }
  }

  useEffect(() => {
    getAllNotification();
  }, []);

  return (
    <div className="wrapper notification">
      <div style={{ padding: "1px 30px", height: "100%" }}>
        {page === "table" && (
          <Table
            style={style}
            className="medicationTable"
            columns={columns}
            data={data}
            clickRowFunction={() => {}}
            selectFunction={() => {}}
            toolbar={false}
            gridStyle={gridStyle}
            density="comfortable"
            checkboxSelection={false}
          />
        )}

        {page === "details" && (
          <div className="notifDetails">
            <BsArrowLeft
              className="backToNotificationMainPage"
              onClick={() => setPage("table")}
              style={{ cursor: "pointer" }}
            />
            <h1 style={{ textAlign: "center" }}>Registration Details</h1>

            {/* <div className="patientNotifDetails">
              <p>
                <h3>
                  Patient's name<span>:</span>{" "}
                </h3>
                {name}
              </p>
              <p>
                <h3>
                  Patient's phone number<span>:</span>
                </h3>
                {phoneNo}
              </p>
              <p>
                <h3>
                  Patient's IC / Passport Number<span>:</span>{" "}
                </h3>
                {icNo}
              </p>
            </div> */}

            <div className="patientNotifDetails">
              <div className="register-inputField">
                <label>Patient's Name</label>
                <input
                  type="text"
                  placeholder="Enter patient's name"
                  name="patientName"
                  value={name}
                  disabled
                />
              </div>

              <div className="register-inputField">
                <label>Mobile Phone No.</label>
                <input
                  type="text"
                  placeholder="Enter phone number (e.g. 01X-XXXXXXX)"
                  name="phoneNo"
                  value={phoneNo}
                  disabled
                />
              </div>

              <div className="register-inputField">
                <label>I/C No. / Passport No.</label>
                <input
                  type="text"
                  placeholder="Enter I/C or passport no. (e.g. XXXXXX-XX-XXXX)"
                  name="icNo"
                  value={icNo}
                  disabled
                />
              </div>
            </div>

            <div className="notifButton">
              <button
                className="approveNotif"
                onClick={() => approveRegistration()}
              >
                Approve
              </button>
              <button
                className="rejectNotif"
                onClick={() => rejectRegistration()}
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notification;
