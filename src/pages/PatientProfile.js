import React, { useState } from "react";
import {
  usePageDispatch,
  usePatientDispatch,
  usePatientState,
} from "../context";
import { useParams, useNavigate } from "react-router-dom";
import {
  changeProfileDataNotification,
  setCurrentPatient,
  updatePatientProfile,
} from "../service";
import { convertDateObjToDateInput } from "../utils";

function PatientProfile() {
  const params = useParams();
  const navigate = useNavigate();

  const patientDispatch = usePatientDispatch();
  const pageDispatch = usePageDispatch();

  const patientState = usePatientState();
  const patientId = params.patientId;

  const [name, setName] = useState(patientState.currentPatient.name);
  const [phoneNo, setPhoneNo] = useState(patientState.currentPatient.phoneNo);
  const [icNo, setIcNo] = useState(patientState.currentPatient.icNo);
  const [birthDate, setBirthDate] = useState(
    patientState.currentPatient.birthDate
      ? convertDateObjToDateInput(patientState.currentPatient.birthDate)
      : ""
  );
  const [age, setAge] = useState(
    patientState.currentPatient.age ? patientState.currentPatient.age : 0
  );
  const [gender, setGender] = useState(
    patientState.currentPatient.gender ? patientState.currentPatient.gender : ""
  );
  const [nextOfKin, setNextOfKin] = useState(
    patientState.currentPatient.nextOfKin
      ? patientState.currentPatient.nextOfKin
      : ""
  );
  const [nextOfKinContact, setNextOfKinContact] = useState(
    patientState.currentPatient.nextOfKinContact
      ? patientState.currentPatient.nextOfKinContact
      : ""
  );

  const maxYear = new Date().getFullYear() - 18;

  function calculateAge(date) {
    const year = new Date().getFullYear();
    const birthYear = parseInt(date);
    const patientAge = year - birthYear;

    setAge(patientAge);
  }

  function compareDataChanges() {
    // Local data
    const _name = patientState.currentPatient.name;
    const _phoneNo = patientState.currentPatient.phoneNo.substring(2);
    const _icNo = patientState.currentPatient.icNo;
    const _birthDate = patientState.currentPatient.birthDate
      ? convertDateObjToDateInput(patientState.currentPatient.birthDate)
      : "";
    const _age = patientState.currentPatient.age
      ? patientState.currentPatient.age
      : 0;
    const _gender = patientState.currentPatient.gender
      ? patientState.currentPatient.gender
      : "";
    const _nextOfKin = patientState.currentPatient.nextOfKin
      ? patientState.currentPatient.nextOfKin
      : "";
    const _nextOfKinContact = patientState.currentPatient.nextOfKinContact
      ? patientState.currentPatient.nextOfKinContact
      : "";

    console.log("_name", _name);
    console.log("_phoneNo", _phoneNo);
    console.log("_icNo", _icNo);
    console.log("_birthDate", _birthDate);
    console.log("_age", _age);
    console.log("_gender", _gender);

    let changeDataObj = {};
    if (name !== _name) {
      changeDataObj.name = name;
    }
    if (phoneNo !== _phoneNo) {
      changeDataObj.phoneNo = phoneNo;
    }
    if (icNo !== _icNo) {
      changeDataObj.icNo = icNo;
    }
    if (birthDate !== _birthDate) {
      changeDataObj.birthDate = birthDate;
    }
    if (age !== _age) {
      changeDataObj.age = age;
    }
    if (gender !== _gender) {
      changeDataObj.gender = gender;
    }
    if (nextOfKin !== _nextOfKin) {
      changeDataObj.nextOfKin = nextOfKin;
    }
    if (nextOfKinContact !== _nextOfKinContact) {
      changeDataObj.nextOfKinContact = nextOfKinContact;
    }

    console.log("changeDataObj", changeDataObj);
    return changeDataObj;
  }

  async function handleUpdatePatientData(e) {
    e.preventDefault();
    // const newData = {
    //   patientId: params.patientId,
    //   name: name,
    //   phoneNo: phoneNo,
    //   icNo: icNo,
    //   birthDate: new Date(birthDate).getTime(),
    //   age: age,
    //   gender: gender,
    //   nextOfKin: nextOfKin,
    //   nextOfKinContact: nextOfKinContact,
    // };

    // console.log("newData", newData);

    if (window.confirm("Are you sure you want to continue?")) {
      // Make phone number in correct format
      let validPhoneNo = phoneNo;
      if (phoneNo.startsWith("0")) {
        validPhoneNo = "+6" + validPhoneNo;
      } else if (phoneNo.startsWith("6")) {
        validPhoneNo = "+" + validPhoneNo;
      }

      if (
        ((validPhoneNo.substring(2, 5) === "011" ||
          validPhoneNo.substring(2, 5) === "015") &&
          validPhoneNo.length !== 13) ||
        (validPhoneNo.substring(2, 5) !== "011" &&
          validPhoneNo.substring(2, 5) !== "015" &&
          validPhoneNo.length !== 12)
      ) {
        alert("The phone number is invalid. Please try again.");
        return;
      }
      setPhoneNo(validPhoneNo);

      if (
        (icNo.charAt(0) === "A" && icNo.length !== 9) ||
        (icNo.charAt(0) !== "A" && icNo.length !== 12)
      ) {
        alert("The I/C / Passport number is invalid. Please try again.");
        return;
      }

      // Make next of kin phone number in correct format
      let validNextOfKinContact = nextOfKinContact;
      if (nextOfKinContact.startsWith("0")) {
        validNextOfKinContact = "+6" + validNextOfKinContact;
      } else if (nextOfKinContact.startsWith("6")) {
        validNextOfKinContact = "+" + validNextOfKinContact;
      }

      if (
        validNextOfKinContact !== "" &&
        (((validNextOfKinContact.substring(2, 5) === "011" ||
          validNextOfKinContact.substring(2, 5) === "015") &&
          validNextOfKinContact.length !== 13) ||
          (validNextOfKinContact.substring(2, 5) !== "011" &&
            validNextOfKinContact.substring(2, 5) !== "015" &&
            validNextOfKinContact.length !== 12))
      ) {
        alert("The phone number of next of kin is invalid. Please try again.");
        return;
      }
      setNextOfKinContact(validNextOfKinContact);

      const checkRepeatedNameForSamePhone = patientState.patientList
        .filter(
          (patient) =>
            patient.phoneNo === phoneNo && patient.patientId !== patientId
        )
        .filter((p) => p.name.toLowerCase() === name.toLowerCase());
      if (checkRepeatedNameForSamePhone.length > 0) {
        alert("The patient's name is already existed under this phone number.");
        return;
      }

      const checkRepeatedIc = patientState.patientList.filter(
        (patient) => patient.icNo === icNo && patient.patientId !== patientId
      );
      if (checkRepeatedIc.length > 0) {
        alert("The I/C No / Passport No. is already existed.");
        return;
      }

      // await updatePatientProfile(newData);
      let changeDataObj = {
        changeDataWeb: true,
        changeData: compareDataChanges(),
      };
      console.log("cdo", changeDataObj);
      await changeProfileDataNotification(changeDataObj, patientId);
      await setCurrentPatient(patientDispatch, patientId);
      alert(
        "Notification has been sent to patient. Please wait for the patient to approve the changes."
      );
    } else {
      return;
    }
  }

  return (
    <div className="wrapper">
      <div style={{ padding: "30px 70px" }}>
        <h1>General Information</h1>

        <form
          className="patientProfileForm"
          onSubmit={(e) => handleUpdatePatientData(e)}
        >
          <div className="patientInfo">
            <h3>
              <span>Name</span>
              <span>:</span>
            </h3>

            <input
              type="text"
              value={name}
              placeholder="Patient's name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="patientInfo">
            <h3>
              <span>Mobile Phone No.</span>
              <span>:</span>
            </h3>

            <input
              type="text"
              value={phoneNo}
              placeholder="Patient's phone no."
              onChange={(e) => setPhoneNo(e.target.value)}
            />
          </div>

          <div className="patientInfo">
            <h3>
              <span>I/C No. / Passport No.</span>
              <span>:</span>
            </h3>

            <input
              type="text"
              value={icNo}
              placeholder="Patient's ic no. / passport no."
              onChange={(e) => setIcNo(e.target.value)}
            />
          </div>

          <div className="patientInfo">
            <h3>
              <span>Date of birth</span>
              <span>:</span>
            </h3>

            <input
              type="date"
              value={birthDate}
              onChange={(e) => {
                setBirthDate(e.target.value);
                calculateAge(e.target.value.substring(0, 4));
              }}
              max={`${maxYear}-12-31`}
            />
          </div>

          <div className="patientInfo">
            <h3>
              <span>Age</span>
              <span>:</span>
            </h3>

            <p>{age} years old</p>
          </div>

          <div className="patientInfo">
            <h3>
              <span>Gender</span>
              <span>:</span>
            </h3>

            <div className="gender">
              <div className="gender-male">
                <label>Male</label>
                <input
                  type="checkbox"
                  checked={gender === "male" ? true : false}
                  onChange={(e) => setGender("male")}
                />
              </div>
              <div className="gender-female">
                <label>Female</label>
                <input
                  type="checkbox"
                  checked={gender === "female" ? true : false}
                  onChange={(e) => setGender("female")}
                />
              </div>
            </div>
          </div>

          <div className="patientInfo">
            <h3>
              <span>Next of kin</span>
              <span>:</span>
            </h3>

            <input
              type="text"
              value={nextOfKin}
              onChange={(e) => setNextOfKin(e.target.value)}
            />
          </div>

          <div className="patientInfo">
            <h3>
              <span>Contact No. (next of kin)</span>
              <span>:</span>
            </h3>

            <input
              type="text"
              value={nextOfKinContact}
              onChange={(e) => setNextOfKinContact(e.target.value)}
            />
          </div>

          <div className="saveAndCancelButton">
            <button className="saveProfile" type="submit">
              Save
            </button>
            <button
              type="button"
              className="cancelProfile"
              onClick={() => {
                navigate(`/dashboard/patient/${params.patientId}`);
                pageDispatch({
                  type: "SET_CURRENT_PAGE",
                  payload: "Patient Details",
                });
              }}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PatientProfile;
