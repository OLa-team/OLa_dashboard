import { async } from "@firebase/util";
import React, { useState } from "react";
import profile from "../../src/assets/profile.jpg";
import { useAuthDispatch, useAuthState, usePatientState } from "../context";
import { updateHcpProfile } from "../service";
import { setCurrentHcp } from "../service/AuthService";

function Profile() {
  const userState = useAuthState();
  const userDispatch = useAuthDispatch();

  const hcpId = userState.userDetails.id ? userState.userDetails.id : "";
  const [username, setUsername] = useState(
    userState.userDetails.username ? userState.userDetails.username : ""
  );
  const [icNo, setIcNo] = useState(
    userState.userDetails.icNo ? userState.userDetails.icNo : ""
  );
  const [email, setEmail] = useState(
    userState.userDetails.email ? userState.userDetails.email : ""
  );
  console.log(userState.userDetails);
  console.log("icNo", icNo);

  async function handleSubmitProfile(e) {
    e.preventDefault();

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

  const [imgSrc, setImgSrc] = useState("");
  return (
    <div className="hcpProfile">
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
              />
            </div>
            <div className="profileInput">
              <label>IC No.:</label>
              <input
                type="text"
                value={icNo}
                onChange={(e) => setIcNo(e.target.value)}
                placeholder="Enter your ic no"
              />
            </div>
            <div className="profileInput">
              <label>Email:</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
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
