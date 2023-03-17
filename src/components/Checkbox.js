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
          <input
            type="checkbox"
            checked={checkedYes}
            onClick={onChangeYes}
            onChange={(e) => {}}
          />
        </div>
        <div className="no-choice">
          <label>No</label>
          <input
            type="checkbox"
            checked={checkedNo}
            onClick={onChangeNo}
            onChange={(e) => {}}
          />
        </div>
      </div>
    </div>
  );
}

export default Checkbox;
