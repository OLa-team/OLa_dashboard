import React, { useEffect, useState } from "react";
import profile from "../../src/assets/profile.jpg";
import Loader from "../components/Loader";
import { useAuthDispatch, useAuthState, usePatientState } from "../context";
import { setCurrentHcp, updateHcpProfile } from "../service";

function Profile() {
  const userState = useAuthState();
  const userDispatch = useAuthDispatch();
  const loading = userState.loading;

  const hcpId = userState.userDetails.id ? userState.userDetails.id : "";
  const [username, setUsername] = useState(
    userState.userDetails ? userState.userDetails.username : ""
  );
  const [icNo, setIcNo] = useState(
    userState.userDetails ? userState.userDetails.icNo : ""
  );
  const [email, setEmail] = useState(
    userState.userDetails ? userState.userDetails.email : ""
  );

  async function handleSubmitProfile(e) {
    e.preventDefault();

    if (username === "" || icNo === "" || email === "") {
      alert("Please fill in all the info");
      return;
    }

    // Check validation of ic number
    if (
      (icNo.charAt(0) === "A" && icNo.length !== 9) ||
      (icNo.charAt(0) !== "A" && icNo.length !== 12)
    ) {
      alert("Please enter a valid I/C No. or Passport No.");
      return;
    }

    let hcpProfileData = {
      username: username,
      icNo: icNo,
      email: email,
    };

    if (window.confirm("Are you confirm to proceed?")) {
      await updateHcpProfile(hcpProfileData, hcpId);
      await setCurrentHcp(userDispatch, hcpId);
      alert("Update HCP profile successfully!");
    } else {
      return;
    }
  }

  async function getUserData() {
    await setCurrentHcp(userDispatch, hcpId);
  }

  useEffect(() => {
    getUserData();
  }, []);

  const [imgSrc, setImgSrc] = useState("");
  return (
    <div className="hcpProfile">
      <Loader loading={loading} />
      <div className="leftHcpProfile">
        <div style={{ padding: "40px 20px" }}>
          <div className="profilePhoto">
            <img src={profile} alt="profile photo" />
          </div>
          {/* <input
            type="file"
            id="img"
            name="img"
            accept="image/*"
            onChange={(e) => {
              setImgSrc(URL.createObjectURL(e.target.files[0]));
            }}
          /> */}
          {/* <p>{imgSrc}</p> */}
          <h2>{username}</h2>
          <p>HCP</p>
        </div>
      </div>

      <div className="rightHcpProfile">
        <div
          style={{
            padding: "40px 60px",
            width: "85%",
          }}
        >
          <h1>Profile Information</h1>

          <form onSubmit={(e) => handleSubmitProfile(e)}>
            <div className="profileInput">
              <label>Name:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                disabled
              />
            </div>
            <div className="profileInput">
              <label>IC No.:</label>
              <input
                type="text"
                value={icNo}
                onChange={(e) => setIcNo(e.target.value)}
                placeholder="Enter your ic no"
                // disabled
              />
            </div>
            <div className="profileInput">
              <label>Email:</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                // disabled
              />
            </div>
            <button className="saveHcpProfile" type="submit">
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
