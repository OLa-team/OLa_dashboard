import React, { useState } from "react";
import { GiPlainCircle } from "react-icons/gi";
import { FiArrowRight } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAuthState,
  usePageDispatch,
  usePatientDispatch,
  usePatientState,
} from "../../context";
import {
  setCurrentPatient,
  updateBloodThinner,
  updateNameVerified,
} from "../../service";
import { getCurrentDate, getCurrentTime } from "../../utils";

function BloodThinner() {
  const navigate = useNavigate();
  const params = useParams();
  const pageDispatch = usePageDispatch();
  const patientState = usePatientState();
  const patientDispatch = usePatientDispatch();
  const patientId = params.patientId;
  const currentUserState = useAuthState();

  const [anticoagulant, setAnticoagulant] = useState(
    patientState.bloodThinner.anticoagulant
      ? patientState.bloodThinner.anticoagulant
      : ""
  );
  const [indication, setIndication] = useState(
    patientState.bloodThinner.indication
      ? patientState.bloodThinner.indication
      : ""
  );
  const [duration, setDuration] = useState(
    patientState.bloodThinner.duration ? patientState.bloodThinner.duration : ""
  );
  // const [initiationDose, setInitiationDose] = useState(
  //   patientState.bloodThinner.initiationDose
  //     ? patientState.bloodThinner.initiationDose
  //     : 0
  // );
  const [dose1, setDose1] = useState(
    patientState.bloodThinner.dose1 ? patientState.bloodThinner.dose1 : 0
  );
  const [dose2, setDose2] = useState(
    patientState.bloodThinner.dose2 ? patientState.bloodThinner.dose2 : 0
  );
  const [dose3, setDose3] = useState(
    patientState.bloodThinner.dose3 ? patientState.bloodThinner.dose3 : 0
  );
  const [inrRange, setInrRange] = useState(
    patientState.bloodThinner.inrRange ? patientState.bloodThinner.inrRange : ""
  );

  // to track the changes of anticoagulant
  const [isChangeAnticoagulant, setIsChangeAnticoagulant] = useState(false);
  const [openTtrResult, setOpenTtrResult] = useState(false);

  const ttrResult = patientState.bloodThinner.ttrResult
    ? patientState.bloodThinner.ttrResult
    : null;

  const dateTimeUpdated = patientState.bloodThinner.dateTimeUpdated
    ? patientState.bloodThinner.dateTimeUpdated
    : "";

  async function handleSubmitBloodThinner() {
    // e.preventDefault();

    if (indication === "" || duration === "" || inrRange === "") {
      alert("Please fill in all the fields before proceed to save.");
      return;
    }

    let bloodThinnerData = {
      nameUpdated: currentUserState.userDetails.username,
      nameVerified: "",
      dateTimeUpdated: new Date().getTime(),
      anticoagulant: anticoagulant,
      indication: indication,
      duration: duration,
      dose1: dose1,
      dose2: dose2,
      dose3: dose3,
      inrRange: inrRange,
    };

    if (isChangeAnticoagulant) {
      bloodThinnerData = {
        ...bloodThinnerData,
        dose: "",
        creatinineRecord: [],
        inrRecord: [],
      };
    }

    if (window.confirm("Are you sure you want to continue?")) {
      await updateBloodThinner(
        bloodThinnerData,
        patientId,
        isChangeAnticoagulant
      );
      await setCurrentPatient(patientDispatch, patientId);
      alert("Oral anticoagulant updated successfully.");
      setIsChangeAnticoagulant(false);
    } else {
      return;
    }
  }

  function openTtrResultBox() {
    console.log("TTR result", ttrResult);
    setOpenTtrResult(true);
  }

  async function verifyData() {
    if (window.confirm("Are you sure to verify?")) {
      await updateNameVerified(
        "blood_thinner",
        patientId,
        currentUserState.userDetails.username
      );
      await setCurrentPatient(patientDispatch, patientId);
    }
  }

  return (
    <div className="wrapper">
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
                <span>Last verified by</span>
                <span>:</span>
              </h4>
              <p>{patientState.bloodThinner.nameVerified}</p>
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

        {/* {anticoagulant === "warfarin" && (
          <div className="ttrBtn">
            <button type="button" onClick={() => openTtrResultBox()}>
              TTR result
            </button>
          </div>
        )} */}

        <form className="bloodThinnerForm">
          <div className="upperBloodThinner">
            <div
              className={anticoagulant === "warfarin" ? "activeMedicine" : ""}
              onClick={() => {
                setAnticoagulant("warfarin");
                setDuration("");
                setIndication("");
                setInrRange("");
                setIsChangeAnticoagulant(true);
              }}
            >
              Warfarin
            </div>
            <div
              className={anticoagulant === "dabigatran" ? "activeMedicine" : ""}
              onClick={() => {
                setAnticoagulant("dabigatran");
                setDuration("");
                setIndication("");
                setDose1(0);
                setDose2(0);
                setDose3(0);
                setIsChangeAnticoagulant(true);
              }}
            >
              Dabigatran
            </div>
            <div
              className={anticoagulant === "apixaban" ? "activeMedicine" : ""}
              onClick={() => {
                setAnticoagulant("apixaban");
                setDuration("");
                setIndication("");
                setIsChangeAnticoagulant(true);
              }}
            >
              Apixaban
            </div>
            <div
              className={
                anticoagulant === "rivaroxaban" ? "activeMedicine" : ""
              }
              onClick={() => {
                setAnticoagulant("rivaroxaban");
                setDuration("");
                setIndication("");
                setIsChangeAnticoagulant(true);
              }}
            >
              Rivaroxaban
            </div>
          </div>

          <div className="lowerBloodThinner">
            {anticoagulant !== "" && (
              <>
                {anticoagulant === "warfarin" && (
                  <div className="checkboxBloodThinner">
                    <div className="ttrBtn">
                      <button type="button" onClick={() => openTtrResultBox()}>
                        TTR result
                      </button>
                    </div>
                  </div>
                )}
                <div className="checkboxBloodThinner">
                  <h3>
                    <span>Indication</span>
                    <span>:</span>
                  </h3>
                  <div className="choiceWrapper">
                    <div>
                      <input
                        type="checkbox"
                        checked={indication === "af" ? true : false}
                        onChange={() => setIndication("af")}
                      />
                      <p>AF</p>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        checked={indication === "dvt" ? true : false}
                        onChange={() => setIndication("dvt")}
                      />
                      <p>DVT</p>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        checked={indication === "pe" ? true : false}
                        onChange={() => setIndication("pe")}
                      />
                      <p>PE</p>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        checked={
                          indication !== "af" &&
                          indication !== "dvt" &&
                          indication !== "pe" &&
                          indication !== ""
                            ? true
                            : false
                        }
                        onChange={() => setIndication("others")}
                      />
                      <p>
                        Others, please specify:{" "}
                        <input
                          type="text"
                          value={
                            indication !== "af" &&
                            indication !== "dvt" &&
                            indication !== "pe" &&
                            indication !== "others"
                              ? indication
                              : ""
                          }
                          disabled={
                            indication === "af" ||
                            indication === "dvt" ||
                            indication === "pe"
                              ? true
                              : false
                          }
                          onChange={(e) => setIndication(e.target.value)}
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
                        checked={duration === "lifelong" ? true : false}
                        onChange={() => setDuration("lifelong")}
                      />
                      <p>Lifelong</p>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        checked={
                          duration !== "lifelong" && duration !== ""
                            ? true
                            : false
                        }
                        onChange={() => setDuration("others")}
                      />
                      <p>
                        Others, please specify:{" "}
                        <input
                          type="text"
                          value={
                            duration !== "lifelong" && duration !== "others"
                              ? duration
                              : ""
                          }
                          disabled={duration === "lifelong" ? true : false}
                          onChange={(e) => setDuration(e.target.value)}
                        />
                      </p>
                    </div>
                  </div>
                </div>

                {anticoagulant === "warfarin" && (
                  <>
                    <div className="checkboxBloodThinner">
                      <h3>
                        <span>Initiation Dose</span>
                        <span>:</span>
                      </h3>
                      <div className="choiceWrapper">
                        <div>
                          <input
                            type="number"
                            value={dose1}
                            onChange={(e) => setDose1(e.target.value)}
                          />
                          /
                          <input
                            type="number"
                            value={dose2}
                            onChange={(e) => setDose2(e.target.value)}
                          />
                          /
                          <input
                            type="number"
                            value={dose3}
                            onChange={(e) => setDose3(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="checkboxBloodThinner">
                      <h3>
                        <span>INR Target Range</span>
                        <span>:</span>
                      </h3>
                      <div className="choiceWrapper">
                        <div>
                          <input
                            type="checkbox"
                            checked={inrRange === "2-3" ? true : false}
                            onChange={() => setInrRange("2-3")}
                          />
                          <p>2-3</p>
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            checked={
                              inrRange !== "2-3" && inrRange !== ""
                                ? true
                                : false
                            }
                            onChange={() => setInrRange("others")}
                          />
                          <p>
                            Others, please specify:{" "}
                            <input
                              type="text"
                              value={
                                inrRange !== "2-3" && inrRange !== "others"
                                  ? inrRange
                                  : ""
                              }
                              disabled={inrRange === "2-3" ? true : false}
                              onChange={(e) => setInrRange(e.target.value)}
                              placeholder="e.g., 3-4"
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div className={openTtrResult ? "btBg" : ""}></div>

          {openTtrResult && (
            <div className="ttrResult">
              <div>
                <h3>TTR Result </h3>
                <IoClose
                  onClick={() => {
                    setOpenTtrResult(false);
                  }}
                />
              </div>
              <label>
                % Days Within Range :{" "}
                <p>
                  {ttrResult.percentageDaysWithinRange
                    ? ttrResult.percentageDaysWithinRange === NaN
                      ? 0
                      : ttrResult.percentageDaysWithinRange.toFixed(1)
                    : 0}
                  {/* {ttrResult.percentageDaysWithinRange
                    ? ttrResult.percentageDaysWithinRange.toFixed(1)
                    : 0} */}
                  %
                </p>
              </label>
              <label>
                % of Tests in Range :{" "}
                <p>
                  {ttrResult.percentageOfTestsInRange
                    ? ttrResult.percentageOfTestsInRange.toFixed(1)
                    : 0}
                  %
                </p>
              </label>
            </div>
          )}

          <div className="selectedClotPreventer">
            <h1>Risk Stratification</h1>

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
                  `/dashboard/patient/${params.patientId}/bloodThinner/hemoglobin`
                );
              }}
              style={{ fontSize: "15px" }}
            >
              Hemoglobin
            </button>
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
        </form>
        <div className="saveAndCancelButton bt">
          <button
            className="verifyBtn"
            type="button"
            onClick={() => verifyData()}
          >
            Verify
          </button>
          <button
            className="saveProfile"
            onClick={() => handleSubmitBloodThinner()}
          >
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
      </div>
    </div>
  );
}

export default BloodThinner;
