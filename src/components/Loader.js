import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

function Loader({ loading }) {
  return (
    // <div className={loading ? "loading" : ""}>
    //   <ClipLoader color="red" loading={loading} size={100} className="loader" />
    // </div>
    <div className={loading ? "spinner" : ""}>
      <div className={loading ? "spinner-icon" : ""}></div>
    </div>
  );
}

export default Loader;
