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
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";
import {
  usePageDispatch,
  usePatientDispatch,
  usePatientState,
} from "../context";
import { firestore } from "../firebase";
import {
  deleteAllSelectedPatients,
  fetchPatientList,
  filterPatientList,
  setCurrentPatient,
} from "../service";
import { GoPrimitiveDot } from "react-icons/go";

function SearchPatient() {
  // Global state
  const patientState = usePatientState();

  // Dispatch
  const patientDispatch = usePatientDispatch();
  const pageDispatch = usePageDispatch();
  const navigate = useNavigate();

  // State
  const [searchResult, setSearchResult] = useState("");
  const [healthDiaryNotification, setHealthDiaryNotification] = useState(false);
  const [patientHasNotifList, setPatientHasNotifList] = useState([]);
  const [hasNewNotif, setHasNewNotif] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

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
          patientHasNotifList.find(
            (patientId) => patientId === params.row.patientId
          )
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

  // useEffect(() => {
  //   console.log("list", patientHasNotifList);
  //   console.log("list11", patientHasNotifList);
  //   let arr = [];
  //   if (firstLoad) {
  //     const qBpAndHeartRate = query(
  //       collection(firestore, "notification"),
  //       where("SM_bpAndHeartRate", "==", true)
  //     );
  //     const qSugarLevel = query(
  //       collection(firestore, "notification"),
  //       where("SM_sugarLevel", "==", true)
  //     );
  //     const qBodyWeight = query(
  //       collection(firestore, "notification"),
  //       where("SM_bodyWeight", "==", true)
  //     );
  //     const qBleedingSymptom = query(
  //       collection(firestore, "notification"),
  //       where("SM_bleedingSymptom", "==", true)
  //     );
  //     const qHealthDiary = query(
  //       collection(firestore, "notification"),
  //       where("SM_healthDiary", "==", true)
  //     );

  //     const unsubscribe1 = onSnapshot(
  //       qBpAndHeartRate,
  //       async (querySnapshot) => {
  //         if (querySnapshot.docs.length > 0) {
  //           querySnapshot.docs.forEach((doc) => {
  //             console.log("bp&HeartRate", doc.data());
  //             if (!patientHasNotifList.includes(doc.id)) {
  //               // setPatientHasNotifList((id) => [...id, doc.id]);
  //               arr.push(doc.id);
  //             }
  //           });
  //         }
  //       }
  //     );

  //     const unsubscribe2 = onSnapshot(qSugarLevel, async (querySnapshot) => {
  //       console.log("querySnapshot.docs.length", querySnapshot.docs.length);
  //       if (querySnapshot.docs.length > 0) {
  //         querySnapshot.docs.forEach((doc) => {
  //           console.log("sugar level", doc.id);
  //           console.log("exist", !patientHasNotifList.includes(doc.id));
  //           if (!patientHasNotifList.includes(doc.id)) {
  //             // setPatientHasNotifList((id) => [...id, doc.id]);
  //             arr.push(doc.id);
  //             console.log("??", arr);
  //           }
  //         });
  //       }
  //     });

  //     const unsubscribe3 = onSnapshot(qBodyWeight, async (querySnapshot) => {
  //       if (querySnapshot.docs.length > 0) {
  //         querySnapshot.docs.forEach((doc) => {
  //           console.log("body weight", doc.id);
  //           if (!patientHasNotifList.includes(doc.id)) {
  //             // setPatientHasNotifList((id) => [...id, doc.id]);
  //             arr.push(doc.id);
  //           }
  //         });
  //       }
  //     });

  //     const unsubscribe4 = onSnapshot(
  //       qBleedingSymptom,
  //       async (querySnapshot) => {
  //         if (querySnapshot.docs.length > 0) {
  //           querySnapshot.docs.forEach((doc) => {
  //             console.log("bleeding", doc.id);
  //             if (!patientHasNotifList.includes(doc.id)) {
  //               // setPatientHasNotifList((id) => [...id, doc.id]);
  //               arr.push(doc.id);
  //             }
  //           });
  //         }
  //       }
  //     );

  //     const unsubscribe5 = onSnapshot(qHealthDiary, async (querySnapshot) => {
  //       if (querySnapshot.docs.length > 0) {
  //         querySnapshot.docs.forEach((doc) => {
  //           console.log("health diary", doc.data());
  //           if (!patientHasNotifList.includes(doc.id)) {
  //             // setPatientHasNotifList((id) => [...id, doc.id]);
  //             arr.push(doc.id);
  //           }
  //         });
  //       }
  //     });
  //     console.log("arr", arr);
  //   }
  //   setFirstLoad(false);
  //   setPatientHasNotifList(arr);
  // }, []);

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

  useEffect(() => {
    console.log("list123", patientHasNotifList);
    getPatientList();
  }, [patientHasNotifList]);

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
          <BiSearch className="searchIcon" />
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
