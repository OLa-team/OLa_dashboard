import React, { useEffect, useState } from "react";
import profile from "../../src/assets/profile.jpg";
import Loader from "../components/Loader";
import { useAuthDispatch, useAuthState, usePatientState } from "../context";
import { setCurrentAdminOrHcp, updateAdminOrHcpProfile } from "../service";

function Profile() {
  const currentUserState = useAuthState();
  const userDispatch = useAuthDispatch();
  const loading = currentUserState.loading;

  const isUserAdmin = currentUserState.userDetails.isAdmin;
  const isUserHcp = currentUserState.userDetails.isHcp;
  const role = useState(
    isUserAdmin && isUserHcp ? "Admin & HCP" : isUserAdmin ? "Admin" : "HCP"
  );

  const hcpId = currentUserState.userDetails.id
    ? currentUserState.userDetails.id
    : "";
  const [username, setUsername] = useState(
    currentUserState.userDetails ? currentUserState.userDetails.username : ""
  );
  const [icNo, setIcNo] = useState(
    currentUserState.userDetails ? currentUserState.userDetails.icNo : ""
  );
  const [email, setEmail] = useState(
    currentUserState.userDetails ? currentUserState.userDetails.email : ""
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
      await updateAdminOrHcpProfile(hcpProfileData, hcpId);
      await setCurrentAdminOrHcp(userDispatch, hcpId);
      alert("Update HCP profile successfully!");
    } else {
      return;
    }
  }

  async function getUserData() {
    await setCurrentAdminOrHcp(userDispatch, hcpId);
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
          <p>{role}</p>
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
