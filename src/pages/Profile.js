import React, { useState } from "react";

function Profile() {
  const [imgSrc, setImgSrc] = useState("");
  console.log(imgSrc);
  return (
    <div className="hcpProfile">
      <div className="leftHcpProfile">
        <div style={{ padding: "40px" }}>
          <div className="profilePhoto">
            <img src={imgSrc} alt="profile photo" />
          </div>
          <input
            type="file"
            id="img"
            name="img"
            accept="image/*"
            onChange={(e) => {
              setImgSrc(URL.createObjectURL(e.target.files[0]));
            }}
          />
          {/* <p>{imgSrc}</p> */}
          <h2>Kee Yan Shiuh</h2>
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

          <form>
            <div className="profileInput">
              <label>Name:</label>
              <input type="text" />
            </div>
            <div className="profileInput">
              <label>IC No.:</label>
              <input type="text" />
            </div>
            <div className="profileInput">
              <label>Email:</label>
              <input type="text" />
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
