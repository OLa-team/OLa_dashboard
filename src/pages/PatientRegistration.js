import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";
import { v4 as uuid } from "uuid";
import { createPatientAccount, registerAdminOrHcp } from "../service";
import { useAuthState, usePageDispatch, usePatientDispatch } from "../context";
import { Grid } from "@mui/material";
import { RiAdminFill } from "react-icons/ri";
import { FaUserMd, FaUser } from "react-icons/fa";
import Checkbox from "../components/Checkbox";
import { BsArrowLeft } from "react-icons/bs";

function PatientRegistration() {
  const patientDispatch = usePatientDispatch();
  const pageDispatch = usePageDispatch();
  const currentUserState = useAuthState();

  // State
  const [name, setName] = useState("");
  const [icNo, setIcNo] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isHcp, setIsHcp] = useState(false);

  const [patients, setPatients] = useState([]);
  const [users, setUsers] = useState([]);

  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");

  const isUserAdmin = currentUserState.userDetails.isAdmin;
  const isUserHcp = currentUserState.userDetails.isHcp;
  const [category, setCategory] = useState(
    !isUserAdmin && isUserHcp ? "Patient" : ""
  );

  // db collection
  const patientCollectionRef = collection(firestore, "patient");
  const userCollectionRef = collection(firestore, "user");

  async function submitRegistration(e) {
    e.preventDefault();

    setColor("red");
    setMessage("");

    // Check validation of ic number for all three category
    if (
      (icNo.charAt(0) === "A" && icNo.length !== 9) ||
      (icNo.charAt(0) !== "A" && icNo.length !== 12)
    ) {
      setMessage("Please enter a valid I/C No. or Passport No.");
      return;
    }

    // if register patient
    if (category === "Patient") {
      // Make phone number in correct format
      let validPhoneNo = phoneNo;
      if (phoneNo.startsWith("0")) {
        validPhoneNo = "+6" + validPhoneNo;
      } else if (phoneNo.startsWith("6")) {
        validPhoneNo = "+" + validPhoneNo;
      }

      //  Check validation of phone number
      if (
        ((validPhoneNo.substring(2, 5) === "011" ||
          validPhoneNo.substring(2, 5) === "015") &&
          validPhoneNo.length !== 13) ||
        (validPhoneNo.substring(2, 5) !== "011" &&
          validPhoneNo.substring(2, 5) !== "015" &&
          validPhoneNo.length !== 12)
      ) {
        setMessage("Please enter a valid phone number");
        return;
      }

      // Check repeated name under same phone number
      const repeatedPhoneNo = patients.filter(
        (patient) => patient.phoneNo === validPhoneNo
      );

      if (repeatedPhoneNo.length > 0) {
        const repeatedPatientName = repeatedPhoneNo.filter(
          (patient) => patient.name.toLowerCase() === name.toLowerCase()
        );

        if (repeatedPatientName.length > 0) {
          setMessage("Patient's name is existed under the phone number");
          return;
        }

        // Check repeated I/C number
        const repeatedIcNo = patients.filter(
          (patient) => patient.icNo === icNo
        );

        if (repeatedIcNo.length > 0) {
          setMessage("I/C number existed");
          return;
        }
      }

      console.log("valid phone number", validPhoneNo);
      console.log("valid phone number", validPhoneNo.substring(2, 5));

      if (window.confirm("Are you sure to proceed?")) {
        const patientId = uuid().slice(0, 15);
        const newPatientData = {
          name: name,
          icNo: icNo,
          phoneNo: validPhoneNo,
          patientId: patientId,
        };
        await createPatientAccount(newPatientData, pageDispatch);
        e.target.reset();
        setColor("rgb(46, 183, 46)");
        setMessage("Patient account is created");
        alert("Patient account is created successfully");
      }
    } else {
      if (!isAdmin && !isHcp) {
        alert("Please select the permission(s) for this account");
        return;
      }

      if (!isValidEmail(email)) {
        setMessage("The email is not valid.");
        return;
      }

      const repeatedUsername = users.filter((user) => user.username === name);
      if (repeatedUsername.length > 0) {
        setMessage("The name is existed");
        return;
      }

      const repeatedUserEmail = users.filter((user) => user.email === email);
      if (repeatedUserEmail.length > 0) {
        setMessage("The email is existed");
        return;
      }

      const repeatedUserIcNo = users.filter((user) => user.icNo === icNo);
      if (repeatedUserIcNo.length > 0) {
        setMessage("I/C No. is existed");
        return;
      }

      if (window.confirm("Are you sure to proceed?")) {
        const newUserData = {
          username: name,
          email: email,
          icNo: icNo,
          isAdmin: isAdmin,
          isHcp: isHcp,
        };

        console.log(newUserData);
        await registerAdminOrHcp(newUserData, pageDispatch);

        e.target.reset();
        setIsAdmin(false);
        setIsHcp(false);
        setColor("rgb(46, 183, 46)");
        setMessage(category + " account is created");
        alert(category + " account is created successfully");
      }
    }
  }

  console.log("isAdmin", isAdmin);

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const getPatientsAndUsers = async () => {
    const patientsData = await getDocs(patientCollectionRef);
    setPatients(
      patientsData.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );

    const usersData = await getDocs(userCollectionRef);
    setUsers(usersData.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    getPatientsAndUsers();
  }, []);

  return (
    <div className="registrationCatWrapper">
      {isUserAdmin && category === "" && (
        <Grid container spacing={3} className="gridContainer">
          {isUserAdmin && (
            <Grid item xs={6} className="gridItem">
              <div
                className="registrationModule"
                onClick={() => {
                  setCategory("User");
                  setMessage("");
                  setIsAdmin(false);
                  setIsHcp(false);
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "125px",
                  }}
                >
                  <RiAdminFill className="iconModule" />
                  <FaUserMd className="iconModule" />
                </div>
                <h1>Admin / HCP</h1>
              </div>
            </Grid>
          )}

          {!isUserAdmin && <Grid item xs={3} className="gridItem"></Grid>}

          <Grid item xs={6} className="gridItem">
            <div
              className="registrationModule"
              onClick={() => {
                setCategory("Patient");
                setMessage("");
              }}
            >
              <FaUser className="iconModule" />
              <h1>Patient</h1>
            </div>
          </Grid>
        </Grid>
      )}

      {category !== "" && (
        <div className="patientRegistration">
          {isUserAdmin && (
            <BsArrowLeft
              className="backArrow"
              onClick={() => {
                setCategory("");
              }}
            />
          )}
          <h2>Register New {category}</h2>
          <form
            className="patientRegistrationForm"
            onSubmit={(e) => submitRegistration(e)}
          >
            <div className="register-inputField">
              <label>Name:</label>
              <input
                type="text"
                placeholder="Enter name"
                onChange={(e) => setName(e.target.value.trim())}
                onClick={() => setMessage("")}
                name="name"
                required
              />
            </div>

            {category === "Patient" ? (
              <>
                <div className="register-inputField">
                  <label>Mobile Phone No.:</label>
                  <input
                    type="text"
                    placeholder="Enter phone number (e.g. 01XXXXXXXX)"
                    onChange={(e) => setPhoneNo(e.target.value.trim())}
                    onClick={() => setMessage("")}
                    name="phoneNo"
                    required
                  />
                </div>

                <div className="register-inputField">
                  <label>I/C No. / Passport No.:</label>
                  <input
                    type="text"
                    placeholder="Enter I/C or passport no. (e.g. XXXXXX-XX-XXXX)"
                    onChange={(e) =>
                      setIcNo(
                        e.target.value.trim().replace("-", "").replace("-", "")
                      )
                    }
                    onClick={() => setMessage("")}
                    name="icNo"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="register-inputField">
                  <label>Email Address:</label>
                  <input
                    type="text"
                    placeholder="Enter email address"
                    onChange={(e) => setEmail(e.target.value)}
                    onClick={() => setMessage("")}
                    name="email"
                    required
                  />
                </div>

                <div
                  className="register-inputField"
                  style={{ marginBottom: "15px" }}
                >
                  <label>I/C No. / Passport No.:</label>
                  <input
                    type="text"
                    placeholder="Enter I/C or passport no. (e.g. XXXXXX-XX-XXXX)"
                    onChange={(e) =>
                      setIcNo(
                        e.target.value.trim().replace("-", "").replace("-", "")
                      )
                    }
                    onClick={() => setMessage("")}
                    name="icNo"
                    required
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
              </>
            )}

            <button type="submit">Create Account</button>
            <p style={{ color: color, textAlign: "center", marginTop: "10px" }}>
              {message}
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

export default PatientRegistration;
