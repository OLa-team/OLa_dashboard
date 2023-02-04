import React, { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { MdAdd, MdDelete } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Table from "../../components/Table";
import {
  useAuthState,
  usePatientDispatch,
  usePatientState,
} from "../../context";
import {
  setCurrentPatient,
  updateMessageForPatients,
} from "../../service/PatientService";
import { getCurrentDate, getCurrentTime } from "../../utils";
import { v4 as uuid } from "uuid";

function MessageForPatient() {
  const navigate = useNavigate();
  const params = useParams();

  const currentUserState = useAuthState();
  const patientState = usePatientState();
  const patientDispatch = usePatientDispatch();

  const patientId = params.patientId;

  const [date, setDate] = useState(0);
  const [message, setMessage] = useState("");
  const [hcp, setHcp] = useState("");
  const [messageId, setMessageId] = useState("");
  const [messageList, setMessageList] = useState(
    patientState.messageForPatients
      ? patientState.messageForPatients.messageList
      : []
  );
  const [selectedMessage, setSelectedMessage] = useState();
  const [openForm, setOpenForm] = useState({
    open: false,
    action: "",
  });

  const dateTimeUpdated = patientState.messageForPatients
    ? patientState.messageForPatients.dateTimeUpdated
    : "";

  function selectMessageDetails(row) {
    setDate(row.date);
    setMessage(row.message);
    setHcp(row.hcp);
    setMessageId(row.id);

    setOpenForm({
      open: true,
      action: "edit",
    });
  }

  function setSelectedMessageList(ids, data) {
    const selectedIDs = new Set(ids);
    const selectedRowData = data.filter((row) => selectedIDs.has(row.id));
    setSelectedMessage(selectedRowData);
  }

  async function handleDeleteMessage() {
    let messageList = [...patientState.messageForPatients.messageList];
    for (let i = 0; i < selectedMessage.length; i++) {
      messageList = messageList.filter(
        (msg) => msg.id !== selectedMessage[i].id
      );
    }

    const messageForPatientsData = {
      messageList: messageList,
      read: false,
    };

    if (window.confirm("Are you sure to delete the message(s)?")) {
      await updateMessageForPatients(
        messageForPatientsData,
        patientId,
        patientDispatch
      );
      // await setCurrentPatient(patientDispatch, patientId);
      alert("Delete the message(s) successfully.");
    }
  }

  async function handleSubmitMessageForPatients(e) {
    e.preventDefault();

    const newMessageId = uuid().slice(0, 5);
    const messageData = {
      id: newMessageId,
      date: new Date().getTime(),
      message: message,
      hcp: currentUserState.userDetails.username,
    };

    let messageList = [
      ...patientState.messageForPatients.messageList,
      messageData,
    ];

    const messageForPatientsData = {
      messageList: messageList,
      read: false,
    };

    if (window.confirm("Are you sure to send the message to the patient?")) {
      await updateMessageForPatients(
        messageForPatientsData,
        patientId,
        patientDispatch
      );
      // await setCurrentPatient(patientDispatch, patientId);
      alert("Update patient's message for patients successfully.");

      setOpenForm({
        open: false,
        action: "",
      });

      setDate(0);
      setMessage("");
      setHcp("");
      setMessageId("");
    }
  }

  const style = {
    height: "80%",
    width: "100%",
    margin: "auto",
  };

  const gridStyle = {
    minHeight: "600",
    fontSize: "18px",
    fontWeight: "normal",
    marginTop: "15px",
    width: "100%",
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "No.", width: 50, hide: true },
    {
      field: "messageId",
      headerName: "Message ID",
      width: 215,
      hide: true,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0.5,
      renderCell: (params) => {
        return <div>{getCurrentDate(params.row.date)}</div>;
      },
    },
    {
      field: "message",
      headerName: "Message",
      flex: 2,
    },
    {
      field: "hcp",
      headerName: "HCP",
      flex: 0.8,
    },
  ];

  return (
    <div className="wrapper eachMonitoringPage messageForPatients">
      <div style={{ padding: "30px 50px", height: "90%" }}>
        <h2>
          <BsArrowLeft
            className="backToMonitoringMainPage"
            onClick={() => {
              if (!openForm.open) {
                navigate(
                  `/dashboard/patient/${params.patientId}/patientMonitoring`
                );
              } else {
                if (
                  window.confirm(
                    "Are you sure to exit this page? \nPlease ensure you have saved the message before leaving this page. "
                  )
                ) {
                  setOpenForm({
                    open: false,
                    action: "",
                  });
                }
              }
            }}
          />
          Message for pateints
        </h2>

        {!openForm.open && (
          <>
            <Table
              className="medicationTable"
              style={style}
              columns={columns}
              data={patientState.messageForPatients.messageList}
              clickRowFunction={() => {}}
              selectFunction={setSelectedMessageList}
              toolbar={false}
              gridStyle={gridStyle}
              density="standard"
              checkboxSelection={true}
            />

            <div className="addAndDeleteMedicationButton">
              <button
                className="deleteMedication"
                onClick={() => handleDeleteMessage()}
              >
                <MdDelete />
                Delete
              </button>
              <button
                className="addMedication"
                onClick={() => {
                  setOpenForm({
                    open: true,
                    action: "add",
                  });
                }}
              >
                <MdAdd />
                Add
              </button>
            </div>

            <div className="saveOrCancelMedBtn">
              {/* <button
                className="saveMedication"
                onClick={(e) => handleSubmitMessageForPatients(e)}
              >
                Save
              </button> */}
              <button
                className="medBackBtn"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure to exit this page? \nPlease ensure you have saved all the changes before leaving this page. "
                    )
                  ) {
                    navigate(
                      `/dashboard/patient/${params.patientId}/patientMonitoring`
                    );
                  }
                }}
              >
                Back
              </button>
            </div>
          </>
        )}

        {openForm.open && (
          <div className="messageForPatientsContent">
            <textarea
              type="text"
              placeholder="Any message for patient . . ."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div>
              <button onClick={(e) => handleSubmitMessageForPatients(e)}>
                Send
              </button>
              <button
                onClick={() =>
                  setOpenForm({
                    open: false,
                    action: "",
                  })
                }
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageForPatient;
