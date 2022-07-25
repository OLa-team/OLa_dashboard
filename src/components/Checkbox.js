import React from "react";

function Checkbox({ name, checkedYes, onChangeYes, checkedNo, onChangeNo }) {
  return (
    <div className="checkbox-yesOrNo">
      <h3>
        <span>{name}</span>
        <span>:</span>
      </h3>

      <div className="yesOrNo-choice">
        <div className="yes-choice">
          <label>Yes</label>
          <input type="checkbox" checked={checkedYes} onChange={onChangeYes} />
        </div>
        <div className="no-choice">
          <label>No</label>
          <input type="checkbox" checked={checkedNo} onChange={onChangeNo} />
        </div>
      </div>
    </div>
  );
}

export default Checkbox;
