import React, { useState } from "react";
import { GiPlainCircle } from "react-icons/gi";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAuthState,
  usePageDispatch,
  usePatientDispatch,
  usePatientState,
} from "../context";
import { setCurrentPatient, updateBloodThinner } from "../service";
import { getCurrentDate, getCurrentTime } from "../utils";

function BloodThinner() {
  const navigate = useNavigate();
  const params = useParams();
  const pageDispatch = usePageDispatch();
  const patientState = usePatientState();
  const patientDispatch = usePatientDispatch();
  const patientId = params.patientId;
  const userState = useAuthState();

  const [selectedMedicine, setSelectedMedicine] = useState(
    patientState.bloodThinner.selectedMedicine
      ? patientState.bloodThinner.selectedMedicine
      : ""
  );
  const [indication, setIndication] = useState({
    select: patientState.bloodThinner.indication.select
      ? patientState.bloodThinner.indication.select
      : "",
    value: patientState.bloodThinner.indication.value
      ? patientState.bloodThinner.indication.value
      : "",
  });
  const [duration, setDuration] = useState({
    select: patientState.bloodThinner.duration.select
      ? patientState.bloodThinner.duration.select
      : "",
    value: patientState.bloodThinner.duration.value
      ? patientState.bloodThinner.duration.value
      : "",
  });
  const [inrRange, setInrRange] = useState({
    select: patientState.bloodThinner.inrRange.select
      ? patientState.bloodThinner.inrRange.select
      : "",
    value: patientState.bloodThinner.inrRange.value
      ? patientState.bloodThinner.inrRange.value
      : "",
  });

  const dateTimeUpdated = patientState.bloodThinner.dateTimeUpdated
    ? patientState.bloodThinner.dateTimeUpdated
    : "";

  let bloodThinnerData = {
    nameUpdated: userState.userDetails.username,
    dateTimeUpdated: new Date().getTime(),
    selectedMedicine: selectedMedicine,
    indication: indication,
    duration: duration,
    inrRange: inrRange,
  };

  console.log(bloodThinnerData);

  async function handleUpdateBloodThinner(e) {
    e.preventDefault();

    if (window.confirm("Are you sure you want to continue?")) {
      await updateBloodThinner(bloodThinnerData, patientId);
      await setCurrentPatient(patientDispatch, patientId);
      alert("Update patient's medical condition successfully.");
    } else {
      return;
    }
  }

  return (
    <div className="bloodThinner">
      <div style={{ padding: "30px 50px", height: "80%" }}>
        <div>
          <div className="lastUpdatedBox">
            <div>
              <h4>
                <span>Last updated by</span>
                <span>:</span>
              </h4>
              <p>{patientState.bloodThinner.nameUpdated}</p>
            </div>
            <div>
              <h4>
                <span>Last updated on</span>
                <span>:</span>
              </h4>
              <p>
                {getCurrentDate(dateTimeUpdated)}{" "}
                {getCurrentTime(dateTimeUpdated)}
              </p>
            </div>
          </div>
        </div>

        <form
          className="bloodThinnerForm"
          onSubmit={(e) => handleUpdateBloodThinner(e)}
        >
          <div className="upperBloodThinner">
            <div
              className={
                selectedMedicine === "warfarin" ? "activeMedicine" : ""
              }
              onClick={() => setSelectedMedicine("warfarin")}
            >
              Warfarin
            </div>
            <div
              className={
                selectedMedicine === "dabigatran" ? "activeMedicine" : ""
              }
              onClick={() => setSelectedMedicine("dabigatran")}
            >
              Dabigatran
            </div>
            <div
              className={
                selectedMedicine === "apixaban" ? "activeMedicine" : ""
              }
              onClick={() => setSelectedMedicine("apixaban")}
            >
              Apixaban
            </div>
            <div
              className={
                selectedMedicine === "rivaroxaban" ? "activeMedicine" : ""
              }
              onClick={() => setSelectedMedicine("rivaroxaban")}
            >
              Rivaroxaban
            </div>
          </div>

          <div className="lowerBloodThinner">
            {selectedMedicine !== "" && (
              <>
                <div className="checkboxBloodThinner">
                  <h3>
                    <span>Indication</span>
                    <span>:</span>
                  </h3>
                  <div className="choiceWrapper">
                    <div>
                      <input
                        type="checkbox"
                        checked={indication.select === "af" ? true : false}
                        onChange={() =>
                          setIndication({
                            select: "af",
                            value: "af",
                          })
                        }
                      />
                      <p>AF</p>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        checked={indication.select === "dvt" ? true : false}
                        onChange={() =>
                          setIndication({
                            select: "dvt",
                            value: "dvt",
                          })
                        }
                      />
                      <p>DVT</p>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        checked={indication.select === "pe" ? true : false}
                        onChange={() =>
                          setIndication({
                            select: "pe",
                            value: "pe",
                          })
                        }
                      />
                      <p>PE</p>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        checked={indication.select === "others" ? true : false}
                        onChange={() =>
                          setIndication({
                            select: "others",
                            value: "",
                          })
                        }
                      />
                      <p>
                        Others, please specify:{" "}
                        <input
                          type="text"
                          value={
                            indication.select === "others"
                              ? indication.value
                              : ""
                          }
                          disabled={
                            indication.select === "others" ? false : true
                          }
                          onChange={(e) =>
                            setIndication({
                              select: "others",
                              value: e.target.value,
                            })
                          }
                        />
                      </p>
                    </div>
                  </div>
                </div>

                <div className="checkboxBloodThinner">
                  <h3>
                    <span>Duration</span>
                    <span>:</span>
                  </h3>
                  <div className="choiceWrapper">
                    <div>
                      <input
                        type="checkbox"
                        checked={duration.select === "lifelong" ? true : false}
                        onChange={() =>
                          setDuration({
                            select: "lifelong",
                            value: "lifelong",
                          })
                        }
                      />
                      <p>Lifelong</p>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        checked={duration.select === "others" ? true : false}
                        onChange={() =>
                          setDuration({
                            select: "others",
                            value: "",
                          })
                        }
                      />
                      <p>
                        Others, please specify:{" "}
                        <input
                          type="text"
                          value={
                            duration.select === "others" ? duration.value : ""
                          }
                          disabled={duration.select === "others" ? false : true}
                          onChange={(e) =>
                            setDuration({
                              select: "others",
                              value: e.target.value,
                            })
                          }
                        />
                      </p>
                    </div>
                  </div>
                </div>

                {selectedMedicine === "warfarin" && (
                  <>
                    <div className="checkboxBloodThinner">
                      <h3>
                        <span>INR Target Range</span>
                        <span>:</span>
                      </h3>
                      <div className="choiceWrapper">
                        <div>
                          <input
                            type="checkbox"
                            checked={inrRange.select === "2-3" ? true : false}
                            onChange={() =>
                              setInrRange({
                                select: "2-3",
                                value: "2-3",
                              })
                            }
                          />
                          <p>2-3</p>
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            checked={
                              inrRange.select === "others" ? true : false
                            }
                            onChange={() =>
                              setInrRange({
                                select: "others",
                                value: "",
                              })
                            }
                          />
                          <p>
                            Others, please specify:{" "}
                            <input
                              type="text"
                              value={
                                inrRange.select === "others"
                                  ? inrRange.value
                                  : ""
                              }
                              disabled={
                                inrRange.select === "others" ? false : true
                              }
                              onChange={(e) =>
                                setInrRange({
                                  select: "others",
                                  value: e.target.value,
                                })
                              }
                            />
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="ttrBtn">
                      <button>TTR result</button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div className="selectedClotPreventer">
            <h1>Selected Clot Preventer</h1>

            <div className="riskScoringTools">
              <div
                className="risk-tool"
                onClick={() => {
                  navigate(
                    `/dashboard/patient/${params.patientId}/riskScoring/strokeRisk`
                  );
                  pageDispatch({
                    type: "SET_CURRENT_PAGE",
                    payload: "Risk Scoring - Stroke Risk",
                  });
                }}
              >
                <div className="tool-name">
                  <h2>Stroke risk</h2>
                  <p>(CHA₂DS₂-VASc test)</p>
                </div>

                <div
                  className="result-risk"
                  style={{ color: `${patientState.strokeRisk.colorMsg}` }}
                >
                  <GiPlainCircle />
                  <h4>
                    {patientState.strokeRisk.result
                      ? patientState.strokeRisk.result
                      : "No result for the test"}
                  </h4>
                </div>

                <div className="assess">
                  <p>Click to assess</p>
                  <FiArrowRight />
                </div>
              </div>

              <div
                className="risk-tool"
                onClick={() => {
                  navigate(
                    `/dashboard/patient/${params.patientId}/riskScoring/bleedingRisk`
                  );
                  pageDispatch({
                    type: "SET_CURRENT_PAGE",
                    payload: "Risk Scoring - Bleeding Risk",
                  });
                }}
              >
                <div className="tool-name">
                  <h2>Bleeding risk</h2>
                  <p>(HAS-BLED test)</p>
                </div>

                <div
                  className="result-risk"
                  style={{ color: `${patientState.bleedingRisk.colorMsg}` }}
                >
                  <GiPlainCircle />
                  <h4>
                    {patientState.bleedingRisk.result
                      ? patientState.bleedingRisk.result
                      : "No result for the test"}
                  </h4>
                </div>

                <div className="assess">
                  <p>Click to assess</p>
                  <FiArrowRight />
                </div>
              </div>

              <div
                className="risk-tool"
                onClick={() => {
                  navigate(
                    `/dashboard/patient/${params.patientId}/riskScoring/warfarinQuality`
                  );
                  pageDispatch({
                    type: "SET_CURRENT_PAGE",
                    payload: "Risk Scoring - Warfarin Quality",
                  });
                }}
              >
                <div className="tool-name">
                  <h2>Warfarin quality</h2>
                  <p>(SAMe-TT₂R₂ test)</p>
                </div>

                <div
                  className="result-risk"
                  style={{ color: `${patientState.warfarinQuality.colorMsg}` }}
                >
                  <GiPlainCircle />
                  <h4>
                    {patientState.warfarinQuality.result
                      ? patientState.warfarinQuality.result
                      : "No result for the test"}
                  </h4>
                </div>

                <div className="assess">
                  <p>Click to assess</p>
                  <FiArrowRight />
                </div>
              </div>
            </div>
          </div>

          <div className="tableButton">
            <button
              onClick={() => {
                navigate(
                  `/dashboard/patient/${params.patientId}/bloodThinner/table`
                );
              }}
            >
              Table
            </button>
            <button
              onClick={() => {
                navigate(
                  `/dashboard/patient/${params.patientId}/bloodThinner/graph`
                );
              }}
            >
              Graph
            </button>
          </div>

          <div className="saveAndCancelButton bt">
            <button className="saveProfile" type="submit">
              Save
            </button>
            <button
              type="button"
              className="cancelProfile"
              onClick={() => {
                navigate(`/dashboard/patient/${params.patientId}/`);
                pageDispatch({
                  type: "SET_CURRENT_PAGE",
                  payload: "Patient Details",
                });
              }}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BloodThinner;
