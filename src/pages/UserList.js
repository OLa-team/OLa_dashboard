import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";
import {
  useAuthState,
  usePageDispatch,
  usePatientDispatch,
  usePatientState,
  useUserDispatch,
  useUserState,
} from "../context";
import { firestore } from "../firebase";
import {
  deleteAllSelectedPatients,
  deleteAllSelectedUsers,
  deleteUser,
  fetchPatientList,
  fetchUserList,
  filterPatientList,
  filterUserList,
  filterUserListByRole,
  setCurrentPatient,
  updateAdminOrHcpProfile,
} from "../service";
import { BsArrowLeft } from "react-icons/bs";

function UserList() {
  // Global state
  const patientState = usePatientState();
  const currentUserState = useAuthState();
  const userState = useUserState();

  // Dispatch
  const patientDispatch = usePatientDispatch();
  const pageDispatch = usePageDispatch();
  const userDispatch = useUserDispatch();
  const navigate = useNavigate();

  // State
  const [userList, setUserList] = useState([]);
  const [searchResult, setSearchResult] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [changeView, setChangeView] = useState("table");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [icNo, setIcNo] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isHcp, setIsHcp] = useState(false);
  const [userId, setUserId] = useState("");

  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");

  const style = { height: "90%", width: "95%", margin: "auto" };

  const gridStyle = {
    minHeight: "600",
    fontSize: "20px",
    fontWeight: "bold",
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "No.", flex: 0.2 },
    {
      field: "userId",
      headerName: "User ID",
      width: 215,
      hide: true,
    },
    {
      field: "username",
      headerName: "Username",
      flex: 2.5,
    },
    {
      field: "email",
      headerName: "Email Address",
      flex: 2.5,
    },
    {
      field: "icNo",
      headerName: "IC No.",
      flex: 1.5,
    },
    {
      field: "isAdmin",
      headerName: "isAdmin",
      flex: 1,
      hide: true,
    },
    {
      field: "isHcp",
      headerName: "isHcp",
      flex: 1,
      hide: true,
    },
    {
      field: "button",
      headerName: "Action",
      flex: 0.7,
      sortable: false,
      renderCell: (params) => {
        return (
          <div style={{ width: "100%", textAlign: "center" }}>
            <button className="action" onClick={() => selectUser(params.row)}>
              Edit
            </button>
          </div>
        );
      },
    },
  ];

  async function udpateProfile(e) {
    e.preventDefault();
    setColor("red");
    setMessage("");

    if (icNo === "" || icNo === undefined) {
      alert("Please enter your I/C No");
      return;
    }

    if (!isAdmin && !isHcp) {
      alert("Please select the permission(s).");
      return;
    }

    // Check valid email
    if (!isValidEmail(email)) {
      setMessage("The email is not valid.");
      return;
    }

    // Check valid ic no
    if (
      (icNo.charAt(0) === "A" && icNo.length !== 9) ||
      (icNo.charAt(0) !== "A" && icNo.length !== 12)
    ) {
      setMessage("The I/C No. or Passport No. is not valid");
      return;
    }

    // Check exist of username
    // const repeatedAdminOrHcpUsername = userList.filter((user) => user.username === username);
    // if (repeatedAdminOrHcpUsername.length > 1) {
    //   setMessage("The name is existed");
    //   return;
    // }

    // Check exist of email
    const repeatedAdminOrHcpEmail = userList.filter(
      (user) => user.email === email
    );
    if (repeatedAdminOrHcpEmail.length > 1) {
      setMessage("The email is existed");
      return;
    }

    // Check exist of ic
    const repeatedAdminOrHcpIcNo = userList.filter(
      (user) => user.icNo === icNo
    );
    if (repeatedAdminOrHcpIcNo.length > 1) {
      setMessage("I/C No. is existed.");
      return;
    }

    if (window.confirm("Are you sure to proceed?")) {
      const newUserData = {
        id: userId,
        username: username,
        email: email,
        icNo: icNo,
        isAdmin: isAdmin,
        isHcp: isHcp,
      };

      console.log(newUserData);
      await updateAdminOrHcpProfile(newUserData, pageDispatch);

      setIsAdmin(false);
      setIsHcp(false);
      setColor("rgb(46, 183, 46)");
      alert("The account has been updated successfully");
    }

    e.target.reset();
    setChangeView("table");
    getUserList();
  }

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function setSelectedUserList(ids, data) {
    const selectedIDs = new Set(ids);
    const selectedRowData = data.filter((row) => selectedIDs.has(row.id));

    userDispatch({
      type: "SET_SELECTED_USER_LIST",
      payload: selectedRowData,
    });
  }

  async function getUserList() {
    await fetchUserList(
      currentUserState.userDetails.email,
      userDispatch,
      pageDispatch
    );
  }

  async function selectUser(row) {
    console.log("userlist", userList);
    setUsername(row.username);
    setEmail(row.email);
    setIcNo(row.icNo);
    setIsAdmin(row.isAdmin);
    setIsHcp(row.isHcp);
    setUserId(row.userId);

    setChangeView("detail");
    setMessage("");
  }

  async function deleteSelectedAdminOrHcp() {
    if (userState.selectedUserList.length === 0) {
      alert("Please select user(s) before deleting.");
      return;
    }
    if (window.confirm("Are you sure you want to delete the user(s)?")) {
      await deleteAllSelectedUsers(
        userState.selectedUserList,
        userDispatch,
        pageDispatch
      );
      alert("Deleted the user(s) successfully");
      getUserList();
    }
  }

  async function deleteAdminOrHcp() {
    if (window.confirm("Are you sure to proceed?")) {
      await deleteUser(userId);
      alert("Delete user successfully");
      setChangeView("table");
      getUserList();
    }
  }

  useEffect(() => {
    getUserList();
  }, []);

  useEffect(() => {
    console.log("searchResult", searchResult);
    console.log("filterRole", filterRole);
    if (userState.userList.length > 0) {
      filterUserList(
        userDispatch,
        userState.userList,
        filterRole,
        searchResult
      );
    }
  }, [searchResult]);

  useEffect(() => {
    console.log("searchResult", searchResult);
    console.log("filterRole", filterRole);
    filterUserList(userDispatch, userState.userList, filterRole, searchResult);
  }, [filterRole]);

  return (
    <>
      {changeView === "table" ? (
        <div className="searchPatient">
          <>
            <div className="bar">
              <div className="leftBar">
                <div className="searchBar">
                  <input
                    type="text"
                    placeholder="Search"
                    onChange={(e) => setSearchResult(e.target.value)}
                  />
                  <BiSearch className="searchIcon" />
                </div>
                <select
                  className="filterRoleOption"
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="">Filter by role</option>
                  <option value="both">Admin & HCP</option>
                  <option value="admin">Admin</option>
                  <option value="hcp">HCP</option>
                </select>
              </div>
              <button
                onClick={() =>
                  deleteSelectedAdminOrHcp(selectedUsers, pageDispatch)
                }
              >
                Delete
              </button>
            </div>

            <Table
              style={style}
              data={
                searchResult === "" && filterRole === ""
                  ? userState.userList
                  : userState.tempUserList
              }
              columns={columns}
              clickRowFunction={() => {}}
              selectFunction={setSelectedUserList}
              toolbar={true}
              gridStyle={gridStyle}
              density="comfortable"
              checkboxSelection={true}
              // deletePatient={(data) => setSelectedPatients(data)}
            />
          </>
        </div>
      ) : (
        <div className="patientRegistration">
          <BsArrowLeft
            className="backArrow"
            onClick={() => {
              setChangeView("table");
            }}
          />
          <h2>Edit User Details</h2>
          <form
            className="patientRegistrationForm"
            onSubmit={(e) => udpateProfile(e)}
          >
            <div className="register-inputField">
              <label>Name</label>
              <input
                type="text"
                value={username}
                placeholder="Enter name"
                onChange={(e) => setUsername(e.target.value)}
                name="name"
                required
              />
            </div>
            <div className="register-inputField">
              <label>Email Address</label>
              <input
                type="text"
                value={email}
                placeholder="Enter email address"
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                required
              />
            </div>

            <div
              className="register-inputField"
              style={{ marginBottom: "15px" }}
            >
              <label>I/C No. / Passport No.</label>
              <input
                type="text"
                value={icNo}
                placeholder="Enter I/C or passport no. (e.g. XXXXXX-XX-XXXX)"
                onChange={(e) =>
                  setIcNo(
                    e.target.value.trim().replace("-", "").replace("-", "")
                  )
                }
                name="icNo"
                // required
              />
            </div>

            <div className="checkbox-yesOrNo">
              <h3 style={{ width: "150px" }}>
                <span>Permissions</span>
                <span>:</span>
              </h3>

              <div className="yesOrNo-choice">
                <div className="yes-choice">
                  <label>Admin</label>
                  <input
                    type="checkbox"
                    checked={isAdmin}
                    onChange={() => setIsAdmin((admin) => !admin)}
                  />
                </div>
                <div className="no-choice">
                  <label>HCP</label>
                  <input
                    type="checkbox"
                    checked={isHcp}
                    onChange={() => setIsHcp((hcp) => !hcp)}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
              }}
            >
              <button type="submit">Update</button>
              <button
                type="button"
                style={{ backgroundColor: "black" }}
                onClick={() => deleteAdminOrHcp()}
              >
                Delete
              </button>
            </div>
            <p style={{ color: color, textAlign: "center", marginTop: "10px" }}>
              {message}
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export default UserList;
