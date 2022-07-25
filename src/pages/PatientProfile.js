import React, { useState } from "react";
import {
  usePageDispatch,
  usePatientDispatch,
  usePatientState,
} from "../context";
import { useParams, useNavigate } from "react-router-dom";
import { setCurrentPatient, updatePatientProfile } from "../service";

function PatientProfile() {
  const patientState = usePatientState();

  const [name, setName] = useState(patientState.currentPatient.name);
  const [phoneNo, setPhoneNo] = useState(
    patientState.currentPatient.phoneNo.substring(2)
  );
  const [icNo, setIcNo] = useState(patientState.currentPatient.icNo);
  const [birthDate, setBirthDate] = useState(
    patientState.currentPatient.birthDate
      ? patientState.currentPatient.birthDate
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

  const params = useParams();
  const navigate = useNavigate();

  const patientDispatch = usePatientDispatch();
  const pageDispatch = usePageDispatch();

  const maxYear = new Date().getFullYear() - 18;

  function calculateAge(date) {
    const year = new Date().getFullYear();
    const birthYear = parseInt(date);
    const patientAge = year - birthYear;

    setAge(patientAge);
  }

  console.log(
    name,
    phoneNo,
    icNo,
    birthDate,
    age,
    gender,
    nextOfKin,
    nextOfKinContact
  );

  const newData = {
    patientId: params.patientId,
    name: name,
    phoneNo: phoneNo,
    icNo: icNo,
    birthDate: birthDate,
    age: age,
    gender: gender,
    nextOfKin: nextOfKin,
    nextOfKinContact: nextOfKinContact,
  };

  async function handleUpdatePatientData(newData) {
    if (window.confirm("Are you sure you want to continue?")) {
      if (
        ((phoneNo.substring(0, 3) === "011" ||
          phoneNo.substring(0, 3) === "015") &&
          phoneNo.length !== 11) ||
        (phoneNo.substring(0, 3) !== "011" &&
          phoneNo.substring(0, 3) !== "015" &&
          phoneNo.length !== 10)
      ) {
        alert("The phone number is invalid. Please try again.");
        return;
      }

      if (
        (icNo.charAt(0) === "A" && icNo.length !== 9) ||
        (icNo.charAt(0) !== "A" && icNo.length !== 12)
      ) {
        alert("The I/C / Passport number is invalid. Please try again.");
        return;
      }

      if (
        nextOfKinContact !== "" &&
        (((nextOfKinContact.substring(0, 3) === "011" ||
          nextOfKinContact.substring(0, 3) === "015") &&
          nextOfKinContact.length !== 11) ||
          (nextOfKinContact.substring(0, 3) !== "011" &&
            nextOfKinContact.substring(0, 3) !== "015" &&
            nextOfKinContact.length !== 10))
      ) {
        alert("The phone number of next of kin is invalid. Please try again.");
        return;
      }

      const checkRepeatedNameForSamePhone = patientState.patientList
        .filter(
          (patient) =>
            patient.phoneNo === phoneNo &&
            patient.patientId !== newData.patientId
        )
        .filter((p) => p.name.toLowerCase() === name.toLowerCase());
      if (checkRepeatedNameForSamePhone.length > 0) {
        alert("The patient's name is already existed under this phone number.");
        return;
      }

      const checkRepeatedIc = patientState.patientList.filter(
        (patient) =>
          patient.icNo === icNo && patient.patientId !== newData.patientId
      );
      if (checkRepeatedIc.length > 0) {
        alert("The I/C No / Passport No. is already existed.");
        return;
      }

      await updatePatientProfile(newData);
      await setCurrentPatient(patientDispatch, newData.patientId);
      alert("Update patient's profile successfully.");
      pageDispatch({
        type: "SET_CURRENT_PAGE",
        payload: "Patient Details",
      });
      navigate(`/dashboard/patient/${params.patientId}`);
    } else {
      return;
    }
  }

  return (
    <div className="patientProfile">
      <div style={{ padding: "50px 70px" }}>
        <h1>General Information</h1>

        <form
          className="patientProfileForm"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdatePatientData(newData);
          }}
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
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PatientProfile;
