import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";
import { v4 as uuid } from "uuid";
import { createPatientAccount } from "../service";

function PatientRegistration() {
  // State
  const [patientName, setPatientName] = useState("");
  const [icNo, setIcNo] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [patients, setPatients] = useState([]);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");

  // db collection
  const patientCollectionRef = collection(firestore, "patient");

  const patientId = uuid().slice(0, 15);
  const newPatientData = {
    name: patientName,
    icNo: icNo,
    phoneNo: phoneNo,
    patientId: patientId,
  };

  function submitPatientRegistration(e) {
    e.preventDefault();

    setColor("red");
    //  Check validation of phone number
    if (
      ((phoneNo.substring(0, 3) === "011" ||
        phoneNo.substring(0, 3) === "015") &&
        phoneNo.length !== 11) ||
      (phoneNo.substring(0, 3) !== "011" &&
        phoneNo.substring(0, 3) !== "015" &&
        phoneNo.length !== 10)
    ) {
      setMessage("Please enter a valid phone number");
      return;
    }

    // Check validation of ic number
    if (
      (icNo.charAt(0) === "A" && icNo.length !== 9) ||
      (icNo.charAt(0) !== "A" && icNo.length !== 12)
    ) {
      setMessage("Please enter a valid I/C No. or Passport No.");
      return;
    }

    // Check repeated name under same phone number
    const repeatedPhoneNo = patients.filter(
      (patient) => patient.phoneNo === "+6" + phoneNo
    );

    if (repeatedPhoneNo.length > 0) {
      const repeatedPatientName = repeatedPhoneNo.filter(
        (patient) => patient.name.toLowerCase() === patientName.toLowerCase()
      );

      if (repeatedPatientName.length > 0) {
        setMessage("Patient's name is existed under the phone number");
        return;
      }

      // Check repeated I/C number
      const repeatedIcNo = patients.filter((patient) => patient.icNo === icNo);

      if (repeatedIcNo.length > 0) {
        setMessage("I/C number existed");
        return;
      }
    }

    setColor("rgb(46, 183, 46)");
    setMessage("Patient account is created");
    createPatientAccount(newPatientData, patientId);
    e.target.reset();
  }

  const getPatients = async () => {
    const data = await getDocs(patientCollectionRef);
    setPatients(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    getPatients();
  }, []);

  return (
    <div className="patientRegistration">
      <h2>Register New Patient</h2>
      <form
        className="patientRegistrationForm"
        onSubmit={(e) => submitPatientRegistration(e)}
      >
        <div className="register-inputField">
          <label>Patient's Name</label>
          <input
            type="text"
            placeholder="Enter patient's name"
            onChange={(e) => setPatientName(e.target.value.trim())}
            name="patientName"
            required
          />
        </div>

        <div className="register-inputField">
          <label>Mobile Phone No.</label>
          <input
            type="text"
            placeholder="Enter phone number (e.g. 01X-XXXXXXX)"
            onChange={(e) => setPhoneNo(e.target.value.trim().replace("-", ""))}
            name="phoneNo"
            required
          />
        </div>

        <div className="register-inputField">
          <label>I/C No. / Passport No.</label>
          <input
            type="text"
            placeholder="Enter I/C or passport no. (e.g. XXXXXX-XX-XXXX)"
            onChange={(e) =>
              setIcNo(e.target.value.trim().replace("-", "").replace("-", ""))
            }
            name="icNo"
            required
          />
        </div>

        <button type="submit">Create Account</button>
        <p style={{ color: color, textAlign: "center", marginTop: "10px" }}>
          {message}
        </p>
      </form>
    </div>
  );
}

export default PatientRegistration;
