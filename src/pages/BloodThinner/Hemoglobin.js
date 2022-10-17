import React, { useState } from "react";
import Table from "../../components/Table";
import { MdAdd, MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { v4 as uuid } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAuthState,
  usePatientDispatch,
  usePatientState,
} from "../../context";
import {
  setCurrentPatient,
  updateHemoglobinRecord,
  updateNameVerified,
} from "../../service";
import { getCurrentDate, getCurrentTime, getMaxDate } from "../../utils";
import { Line } from "react-chartjs-2";

function Hemoglobin() {
  const navigate = useNavigate();
  const params = useParams();

  const currentUserState = useAuthState();
  const patientState = usePatientState();
  const patientDispatch = usePatientDispatch();
  const patientId = params.patientId;

  const [date, setDate] = useState("");
  const [hemoglobin, setHemoglobin] = useState(0);
  const [note, setNote] = useState("");
  const [hemoglobinId, setHemoglobinId] = useState("");
  const [hemoglobinList, setHemoglobinList] = useState(
    patientState.hemoglobin ? patientState.hemoglobin.hemoglobinRecord : []
  );
  const [selectedHemoglobin, setSelectedHemoglobin] = useState();
  const [openForm, setOpenForm] = useState({
    open: false,
    action: "",
  });
  const [changeView, setChangeView] = useState("table");

  const style = {
    height: "65%",
    width: "100%",
    margin: "auto",
  };

  const gridStyle = {
    minHeight: "600",
    fontSize: "16px",
    fontWeight: "normal",
    marginTop: "15px",
    width: "100%",
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "No.", width: 50, hide: true },
    {
      field: "medicineId",
      headerName: "Medicine ID",
      width: 215,
      hide: true,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0.7,
    },
    {
      field: "hemoglobin",
      headerName: "Hemoglobin level (g/dL)",
      flex: 1.5,
    },
    {
      field: "note",
      headerName: "Notes",
      flex: 2.5,
    },
    {
      field: "button",
      headerName: "Action",
      flex: 0.7,
      sortable: false,
      renderCell: (params) => {
        return (
          <div style={{ width: "100%", textAlign: "center" }}>
            <button
              className="action"
              onClick={() => selectHemoglobin(params.row)}
            >
              Edit
            </button>
          </div>
        );
      },
    },
  ];

  const dateTimeUpdated = patientState.hemoglobin
    ? patientState.hemoglobin.dateTimeUpdated
    : "";

  function handleAddOrEditHemoglobin(e) {
    e.preventDefault();

    let hemoglobinData = null;
    if (openForm.action === "add") {
      const hemoglobinId = uuid().slice(0, 5);
      hemoglobinData = {
        id: hemoglobinId,
        date: date,
        hemoglobin: parseFloat(hemoglobin),
        note: note,
      };
    } else {
      hemoglobinData = {
        id: hemoglobinId,
        date: date,
        hemoglobin: parseFloat(hemoglobin),
        note: note,
      };

      setHemoglobinList((hb) =>
        hemoglobinList.filter((record) => record.id !== hemoglobinId)
      );
    }
    setHemoglobinList((hb) => [...hb, hemoglobinData]);

    // sort
    setHemoglobinList((list) =>
      [...list].sort((a, b) => (a.date > b.date ? 1 : -1))
    );

    setOpenForm({
      open: false,
      action: "",
    });
    setDate("");
    setHemoglobin(0);
    setNote("");
    setHemoglobinId("");
  }

  function selectHemoglobin(row) {
    setDate(row.date);
    setHemoglobin(row.hemoglobin);
    setNote(row.note);
    setHemoglobinId(row.id);

    setOpenForm({
      open: true,
      action: "edit",
    });
  }

  function handleDeleteHemoglobin() {
    for (let i = 0; i < selectedHemoglobin.length; i++) {
      setHemoglobinList((list) =>
        list.filter((hb) => hb.id !== selectedHemoglobin[i].id)
      );
    }
  }

  function setSelectedHemoglobinList(ids, data) {
    const selectedIDs = new Set(ids);
    const selectedRowData = data.filter((row) => selectedIDs.has(row.id));
    setSelectedHemoglobin(selectedRowData);
  }

  async function handleSubmitHemoglobin(e) {
    e.preventDefault();

    const hemoglobinData = {
      nameUpdated: currentUserState.userDetails.username,
      dateTimeUpdated: new Date().getTime(),
      hemoglobinList: hemoglobinList,
    };

    if (window.confirm("Are you sure you want to continue?")) {
      await updateHemoglobinRecord(hemoglobinData, patientId);
      await setCurrentPatient(patientDispatch, patientId);
      alert("Update patient's hemoglobin record successfully.");
    } else {
      return;
    }
  }

  async function verifyData() {
    if (window.confirm("Are you sure to verify?")) {
      await updateNameVerified(
        "hemoglobin",
        patientId,
        currentUserState.userDetails.username
      );
      await setCurrentPatient(patientDispatch, patientId);
    }
  }

  // Graph
  const labels = patientState.hemoglobin
    ? patientState.hemoglobin.hemoglobinRecord.map((record) =>
        getCurrentDate(record.date)
      )
    : [];

  const graphDataset = patientState.hemoglobin
    ? patientState.hemoglobin.hemoglobinRecord.map(
        (record) => record.hemoglobin
      )
    : [];

  const graphData = {
    labels: labels,
    datasets: [
      {
        label: "Hemoglobin level (g/dL)",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: graphDataset,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          // This more specific font property overrides the global property
          font: {
            size: 18,
          },
        },
      },
    },
    //   aspectRatio: 1,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          font: {
            size: 18,
          },
        },
        beginAtZero: true,
      },
      x: {
        ticks: {
          font: {
            size: 18,
          },
        },
      },
    },
  };

  return (
    <div className="wrapper">
      <div style={{ padding: "30px 50px", height: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h1 style={{ paddingRight: "10px" }}>
              Hemoglobin record {changeView}
            </h1>
            <button
              style={{
                padding: "7px 17px",
                borderRadius: "15px",
                outline: "none",
                border: "1px solid black",
                cursor: "pointer",
                height: "fit-content",
              }}
              onClick={() => {
                if (changeView === "table") {
                  setChangeView("graph");
                } else {
                  setChangeView("table");
                }
              }}
            >
              {changeView === "table" ? "Graph" : "Table"}
            </button>
          </div>
          {changeView === "table" && (
            <div className="lastUpdatedBox">
              <div>
                <h4>
                  <span>Last updated by</span>
                  <span>:</span>
                </h4>
                <p>{patientState.hemoglobin.nameUpdated}</p>
              </div>
              <div>
                <h4>
                  <span>Last verified by</span>
                  <span>:</span>
                </h4>
                <p>{patientState.hemoglobin.nameVerified}</p>
              </div>
              <div>
                <h4>
                  <span>Last updated on</span>
                  <span>:</span>
                </h4>
                <p>
                  {getCurrentDate(dateTimeUpdated)}{" "}
                  {getCurrentTime(dateTimeUpdated)}
                </p>
              </div>
            </div>
          )}
        </div>

        {changeView === "table" ? (
          <>
            <Table
              className="hemoglobinTable"
              style={style}
              columns={columns}
              data={hemoglobinList}
              clickRowFunction={() => {}}
              selectFunction={setSelectedHemoglobinList}
              toolbar={false}
              gridStyle={gridStyle}
              density="standard"
              checkboxSelection={true}
            />

            <div className="addAndDeleteHemoglobinButton">
              <button
                className="deleteHb"
                onClick={() => handleDeleteHemoglobin()}
              >
                <MdDelete />
                Delete
              </button>
              <button
                className="addHb"
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
              <button
                className="verifyBtn"
                type="button"
                onClick={() => verifyData()}
              >
                Verify
              </button>
              <button
                className="saveHb"
                onClick={(e) => handleSubmitHemoglobin(e)}
              >
                Save
              </button>
              <button
                className="hbBackBtn"
                onClick={() => {
                  navigate(
                    `/dashboard/patient/${params.patientId}/bloodThinner`
                  );
                }}
              >
                Back
              </button>
            </div>

            <div className={openForm.open ? "btBg" : ""}></div>

            <div className={`hemoglobinForm ${openForm.open ? "popup" : ""}`}>
              <form
                className="addOrEditHemoglobinForm"
                onSubmit={(e) => handleAddOrEditHemoglobin(e)}
              >
                <IoClose
                  className="closeForm"
                  onClick={() => {
                    setOpenForm({
                      open: false,
                      action: "",
                    });
                    setDate("");
                    setHemoglobin(0);
                    setNote("");
                    setHemoglobinId("");
                  }}
                />
                <h1>
                  {openForm.action === "add" ? "Add" : "Edit"} Hemoglobin Record
                </h1>
                <div>
                  <label>Date: </label>
                  <input
                    type="date"
                    placeholder="Enter date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                    }}
                    required
                    max={getMaxDate()}
                  />
                </div>
                <div>
                  <label>Hemoglobin level (g/dL): </label>
                  <input
                    type="text"
                    name="hemoglobin"
                    placeholder="Enter dose in mg"
                    value={hemoglobin}
                    onChange={(e) => {
                      setHemoglobin(e.target.value);
                    }}
                    required
                  />
                </div>
                <div>
                  <label>Notes: </label>
                  <textarea
                    type="text"
                    name="note"
                    className="noteInput"
                    placeholder="Any remarks"
                    value={note}
                    onChange={(e) => {
                      setNote(e.target.value);
                    }}
                  />
                </div>

                <button type="submit">
                  {openForm.action === "add" ? "Add" : "Update"} hemoglobin
                  record
                </button>
              </form>
            </div>
          </>
        ) : (
          <>
            <div className="monitoringGraph">
              <Line data={graphData} options={options} />
            </div>
            <div className="saveAndCancelButton" style={{ right: "80px" }}>
              <button
                className="medBackBtn"
                onClick={() => {
                  navigate(
                    `/dashboard/patient/${params.patientId}/bloodThinner`
                  );
                }}
                style={{ padding: "7px 20px" }}
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Hemoglobin;
