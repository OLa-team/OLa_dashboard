import React from "react";
import { GiPlainCircle } from "react-icons/gi";
import { FiArrowRight } from "react-icons/fi";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { usePageDispatch, usePatientState } from "../../context";

function RiskScoring() {
  const navigate = useNavigate();
  const params = useParams();

  const pageDispatch = usePageDispatch();
  const patientState = usePatientState();

  function getResultMessage(testType, result) {
    let resultMessages = [];
    if (testType === "Stroke Risk") {
      resultMessages = patientState.strokeRiskResultMessage;
    } else if (testType === "Bleeding Risk") {
      resultMessages = patientState.bleedingRiskResultMessage;
    } else {
      resultMessages = patientState.warfarinQualityResultMessage;
    }

    if (result === "msg1") {
      return resultMessages.msg1;
    } else if (result === "msg2") {
      return resultMessages.msg2;
    } else if (result === "msg3") {
      return resultMessages.msg3;
    } else {
      return result;
    }
  }

  return (
    <div className="riskScoring">
      <div
        style={{
          padding: "70px 90px",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
        }}
      >
        <h1 style={{ textAlign: "center", fontSize: "35px" }}>
          Risk Assessment
        </h1>

        <BsArrowLeft
          className="backArrow"
          onClick={() => {
            navigate(`/dashboard/patient/${params.patientId}`);
            pageDispatch({
              type: "SET_CURRENT_PAGE",
              payload: "Patient Details",
            });
          }}
        />

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
                  ? getResultMessage(
                      "Stroke Risk",
                      patientState.strokeRisk.result
                    )
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
                  ? getResultMessage(
                      "Stroke Risk",
                      patientState.bleedingRisk.result
                    )
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
                  ? getResultMessage(
                      "Stroke Risk",
                      patientState.warfarinQuality.result
                    )
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
    </div>
  );
}

export default RiskScoring;
