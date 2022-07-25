import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

function Loading({ loading }) {
  return (
    <div className={loading ? "loading" : ""}>
      <ClipLoader color="red" loading={loading} size={100} className="loader" />
    </div>
  );
}

export default Loading;
