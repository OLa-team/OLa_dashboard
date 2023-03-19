import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { HiOutlineRefresh } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";
import {
  useNotifDispatch,
  useNotifState,
  usePageDispatch,
  usePatientDispatch,
  usePatientState,
  useUserDispatch,
} from "../context";
import { firestore } from "../firebase";
import {
  deleteAllSelectedPatients,
  fetchPatientList,
  filterPatientList,
  getHasNotifPatientList,
  setCurrentPatient,
} from "../service";
import { GoPrimitiveDot } from "react-icons/go";
import { fetchAllData } from "../service/PatientService";

function SearchPatient() {
  // Global state
  const patientState = usePatientState();
  const notifState = useNotifState();

  // Dispatch
  const patientDispatch = usePatientDispatch();
  const notifDispatch = useNotifDispatch();
  const pageDispatch = usePageDispatch();
  const userDipatch = useUserDispatch();
  const navigate = useNavigate();

  // State
  const [searchResult, setSearchResult] = useState("");
  const [patientHasNotifList, setPatientHasNotifList] = useState([]);

  const style = { height: "90%", width: "95%", margin: "auto" };

  const gridStyle = {
    minHeight: "600",
    fontSize: "20px",
    fontWeight: "bold",
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "No.", width: 80 },
    {
      field: "patientId",
      headerName: "Patient ID",
      width: 215,
      hide: true,
    },
    {
      field: "name",
      headerName: "Patient's name",
      flex: 2,
      renderCell: (params) => {
        if (
          patientHasNotifList
            .filter((value, index, self) => self.indexOf(value) === index)
            .find((patientId) => patientId === params.row.patientId)
        ) {
          return (
            <div>
              {params.row.name} {<GoPrimitiveDot className="alertDot home" />}
            </div>
          );
        } else {
          return <div>{params.row.name} </div>;
        }
      },
    },
    {
      field: "icNo",
      headerName: "I/C No. / Passport No.",
      flex: 1,
    },
    {
      field: "phoneNo",
      headerName: "Mobile Phone No.",
      flex: 1,
    },
  ];

  function setSelectedPatientList(ids, data) {
    const selectedIDs = new Set(ids);
    const selectedRowData = data.filter((row) => selectedIDs.has(row.id));

    patientDispatch({
      type: "SELECT_AND_SET_SELECTED_PATIENT_LIST_TO_DELETE",
      payload: selectedRowData,
    });
  }

  async function getPatientList() {
    await fetchPatientList(patientDispatch, pageDispatch, patientHasNotifList);
  }

  async function selectPatient(row) {
    await setCurrentPatient(patientDispatch, row.row.patientId);
    navigate(`/dashboard/patient/${row.row.patientId}`);
    pageDispatch({
      type: "SET_CURRENT_PAGE",
      payload: "Patient Details",
    });
  }

  async function deletePatient() {
    if (patientState.selectedPatientList.length === 0) {
      alert("Please select patient before deleting.");
      return;
    }
    if (window.confirm("Are you sure you want to delete the patient(s)?")) {
      await deleteAllSelectedPatients(
        patientDispatch,
        patientState.selectedPatientList
      );
      await checkDeletedPatientIsExisted();
      await fetchAllData(userDipatch);
      getPatientList();
      alert("Deleted the patient(s) successfully");
      patientDispatch({
        type: "SET_LOADING_FALSE",
      });
    }
  }

  async function checkDeletedPatientIsExisted() {
    const list = patientState.selectedPatientList;
    let check = false;

    patientDispatch({
      type: "SET_LOADING_TRUE",
    });
    do {
      for (let i = 0; i < list.length; i++) {
        let response = await (
          await getDoc(doc(firestore, "patient", list[i].patientId))
        ).data();

        if (response === undefined) {
          check = true;
          return;
        }
      }
    } while (!check);
  }

  const qBpAndHeartRate = query(
    collection(firestore, "notification"),
    where("SM_bpAndHeartRate", "==", true)
  );
  const qSugarLevel = query(
    collection(firestore, "notification"),
    where("SM_sugarLevel", "==", true)
  );
  const qBodyWeight = query(
    collection(firestore, "notification"),
    where("SM_bodyWeight", "==", true)
  );
  const qBleedingSymptom = query(
    collection(firestore, "notification"),
    where("SM_bleedingSymptom", "==", true)
  );
  const qHealthDiary = query(
    collection(firestore, "notification"),
    where("SM_healthDiary", "==", true)
  );

  const unsubscribe1 = onSnapshot(qBpAndHeartRate, (querySnapshot) => {
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.forEach((doc) => {
        if (!patientHasNotifList.includes(doc.id)) {
          setPatientHasNotifList((id) => [...id, doc.id]);
        }
      });
    }
  });

  const unsubscribe2 = onSnapshot(qSugarLevel, (querySnapshot) => {
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.forEach((doc) => {
        if (!patientHasNotifList.includes(doc.id)) {
          setPatientHasNotifList((id) => [...id, doc.id]);
        }
      });
    }
  });

  const unsubscribe3 = onSnapshot(qBodyWeight, (querySnapshot) => {
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.forEach((doc) => {
        if (!patientHasNotifList.includes(doc.id)) {
          setPatientHasNotifList((id) => [...id, doc.id]);
        }
      });
    }
  });

  const unsubscribe4 = onSnapshot(qBleedingSymptom, (querySnapshot) => {
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.forEach((doc) => {
        if (!patientHasNotifList.includes(doc.id)) {
          setPatientHasNotifList((id) => [...id, doc.id]);
        }
      });
    }
  });

  const unsubscribe5 = onSnapshot(qHealthDiary, (querySnapshot) => {
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.forEach((doc) => {
        if (!patientHasNotifList.includes(doc.id)) {
          setPatientHasNotifList((id) => [...id, doc.id]);
        }
      });
    }
  });

  useEffect(() => {
    getPatientList();
  }, [patientHasNotifList]);

  useEffect(() => {
    getPatientList();
  }, []);

  useEffect(() => {
    if (patientState.patientList.length > 0 && searchResult !== "") {
      filterPatientList(
        patientDispatch,
        patientState.patientList,
        searchResult
      );
    }
  }, [searchResult]);

  return (
    <div className="searchPatient">
      <div className="bar">
        <div className="searchBar">
          <input
            type="text"
            placeholder="Search any value"
            onChange={(e) => setSearchResult(e.target.value)}
          />
          <BiSearch className="searchIcon" title="Search" />
          {/* <HiOutlineRefresh
            className="refreshCircle"
            title="Refresh patient list"
            onClick={() => {
              setPatientHasNotifList([]);
              getPatientList();
            }}
          /> */}
        </div>
        <button onClick={deletePatient}>Delete</button>
      </div>

      <Table
        style={style}
        data={
          searchResult === ""
            ? patientState.patientList
            : patientState.tempPatientList
        }
        columns={columns}
        clickRowFunction={selectPatient}
        selectFunction={setSelectedPatientList}
        toolbar={true}
        gridStyle={gridStyle}
        density="comfortable"
        checkboxSelection={true}
        // deletePatient={(data) => setSelectedPatients(data)}
      />
    </div>
  );
}

export default SearchPatient;
