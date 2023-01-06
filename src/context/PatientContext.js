import React, { useContext, useReducer } from "react";
import { decryptLocalData } from "../utils";

let cp = localStorage.getItem("currentPatient")
  ? decryptLocalData("currentPatient")
  : null;
let mc = localStorage.getItem("medicalCondition")
  ? JSON.parse(localStorage.getItem("medicalCondition"))
  : null;
let al = localStorage.getItem("allergy")
  ? JSON.parse(localStorage.getItem("allergy"))
  : null;
let sr = localStorage.getItem("strokeRisk")
  ? JSON.parse(localStorage.getItem("strokeRisk"))
  : null;
let br = localStorage.getItem("bleedingRisk")
  ? JSON.parse(localStorage.getItem("bleedingRisk"))
  : null;
let wq = localStorage.getItem("warfarinQuality")
  ? JSON.parse(localStorage.getItem("warfarinQuality"))
  : null;
let hg = localStorage.getItem("healthGoal")
  ? JSON.parse(localStorage.getItem("healthGoal"))
  : null;
let md = localStorage.getItem("medication")
  ? JSON.parse(localStorage.getItem("medication"))
  : null;
let bt = localStorage.getItem("bloodThinner")
  ? JSON.parse(localStorage.getItem("bloodThinner"))
  : null;
let pm = localStorage.getItem("patientMonitoring")
  ? JSON.parse(localStorage.getItem("patientMonitoring"))
  : null;
let hemo = localStorage.getItem("hemoglobin")
  ? JSON.parse(localStorage.getItem("hemoglobin"))
  : null;
let dhg = localStorage.getItem("defaultHealthGoal")
  ? JSON.parse(localStorage.getItem("defaultHealthGoal"))
  : null;
let srrm = localStorage.getItem("strokeRiskResultMessage")
  ? JSON.parse(localStorage.getItem("strokeRiskResultMessage"))
  : null;
let brrm = localStorage.getItem("bleedingRiskResultMessage")
  ? JSON.parse(localStorage.getItem("bleedingRiskResultMessage"))
  : null;
let wqrm = localStorage.getItem("warfarinQualityResultMessage")
  ? JSON.parse(localStorage.getItem("warfarinQualityResultMessage"))
  : null;
let mcl = localStorage.getItem("medicationConstantList")
  ? JSON.parse(localStorage.getItem("medicationConstantList"))
  : null;
let mfp = localStorage.getItem("messageForPatients")
  ? JSON.parse(localStorage.getItem("messageForPatients"))
  : null;

// Initial state
const initialState = {
  patientList: [],
  tempPatientList: [],
  selectedPatientList: [],
  currentPatient: cp,
  medicalCondition: mc || {},
  allergy: al || {},
  strokeRisk: sr || {},
  bleedingRisk: br || {},
  warfarinQuality: wq || {},
  healthGoal: hg || {},
  medication: md || {},
  bloodThinner: bt || {},
  patientMonitoring: pm || {},
  hemoglobin: hemo || {},
  defaultHealthGoal: dhg || {},
  strokeRiskResultMessage: srrm || {},
  bleedingRiskResultMessage: brrm || {},
  warfarinQualityResultMessage: wqrm || {},
  medicationConstantList: mcl || {},
  messageForPatients: mfp || {},
  bpAndHeartRateNotif: false,
  sugarLevelNotif: false,
  bodyWeightNotif: false,
  bleedingSymptomNotif: false,
  healthDiaryNotif: false,
  loading: false,
};

// Patient reducer
const PatientReducer = (initialState, action) => {
  switch (action.type) {
    case "SET_LOADING_TRUE":
      return {
        ...initialState,
        loading: true,
      };

    case "SET_LOADING_FALSE":
      return {
        ...initialState,
        loading: false,
      };

    case "SET_CURRENT_PATIENT":
      return {
        ...initialState,
        currentPatient: action.payload,
        loading: false,
      };

    case "DELETE_CURRENT_PATIENT":
      return {
        ...initialState,
        currentPatient: null,
      };

    case "SET_PATIENT_LIST":
      return {
        ...initialState,
        patientList: action.payload,
      };

    case "SET_TEMP_PATIENT_LIST":
      return {
        ...initialState,
        tempPatientList: action.payload,
      };

    case "SELECT_AND_SET_SELECTED_PATIENT_LIST_TO_DELETE":
      return {
        ...initialState,
        selectedPatientList: action.payload,
      };

    case "DELETE_SELECTED_PATIENTS_AND_UPDATE":
      const selectedPatients = new Set(action.payload);
      return {
        ...initialState,
        patientList: initialState.patientList.filter((patient) => {
          return !selectedPatients.has(patient);
        }),
      };

    case "SET_MEDICAL_CONDITION":
      return {
        ...initialState,
        medicalCondition: action.payload,
      };

    case "SET_ALLERGY":
      return {
        ...initialState,
        allergy: action.payload,
      };

    case "SET_STROKE_RISK":
      return {
        ...initialState,
        strokeRisk: action.payload,
      };

    case "SET_BLEEDING_RISK":
      return {
        ...initialState,
        bleedingRisk: action.payload,
      };

    case "SET_WARFARIN_QUALITY":
      return {
        ...initialState,
        warfarinQuality: action.payload,
      };

    case "SET_HEALTH_GOAL":
      return {
        ...initialState,
        healthGoal: action.payload,
      };

    case "SET_MEDICATION":
      return {
        ...initialState,
        medication: action.payload,
      };

    case "SET_BLOOD_THINNER":
      return {
        ...initialState,
        bloodThinner: action.payload,
      };

    case "SET_PATIENT_MONITORING":
      return {
        ...initialState,
        patientMonitoring: action.payload,
      };

    case "SET_HEMOGLOBIN":
      return {
        ...initialState,
        hemoglobin: action.payload,
      };

    case "SET_DEFAULT_HEALTH_GOAL":
      return {
        ...initialState,
        defaultHealthGoal: action.payload,
      };

    case "SET_STROKE_RISK_RESULT_MESSAGE":
      return {
        ...initialState,
        strokeRiskResultMessage: action.payload,
      };

    case "SET_BLEEDING_RISK_RESULT_MESSAGE":
      return {
        ...initialState,
        bleedingRiskResultMessage: action.payload,
      };

    case "SET_WARFARIN_QUALITY_RESULT_MESSAGE":
      return {
        ...initialState,
        warfarinQualityResultMessage: action.payload,
      };

    case "SET_MEDICATION_CONSTANT_LIST":
      return {
        ...initialState,
        medicationConstantList: action.payload,
      };

    case "SET_MESSAGE_FOR_PATIENTS":
      return {
        ...initialState,
        messageForPatients: action.payload,
      };

    case "SET_BP_AND_HEART_RATE_NOTIF_TRUE":
      return {
        ...initialState,
        bpAndHeartRateNotif: true,
      };

    case "SET_BP_AND_HEART_RAT_NOTIF_FALSE":
      return {
        ...initialState,
        bpAndHeartRateNotif: false,
      };

    case "SET_SUGAR_LEVEL_NOTIF_TRUE":
      return {
        ...initialState,
        sugarLevelNotif: true,
      };

    case "SET_SUGAR_LEVEL_NOTIF_FALSE":
      return {
        ...initialState,
        sugarLevelNotif: false,
      };

    case "SET_BODY_WEIGHT_NOTIF_TRUE":
      return {
        ...initialState,
        bodyWeightNotif: true,
      };

    case "SET_BODY_WEIGHT_NOTIF_FALSE":
      return {
        ...initialState,
        bodyWeightNotif: false,
      };

    case "SET_BLEEDING_SYMPTOM_NOTIF_TRUE":
      return {
        ...initialState,
        bleedingSymptomNotif: true,
      };

    case "SET_BLEEDING_SYMPTOM_NOTIF_FALSE":
      return {
        ...initialState,
        bleedingSymptomNotif: false,
      };

    case "SET_HEALTH_DIARY_NOTIF_TRUE":
      return {
        ...initialState,
        healthDiaryNotif: true,
      };

    case "SET_HEALTH_DIARY_NOTIF_FALSE":
      return {
        ...initialState,
        healthDiaryNotif: false,
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// Create contexts
const PatientStateContext = React.createContext();
const PatientDispatchContext = React.createContext();

// Export contexts
export function usePatientState() {
  const context = useContext(PatientStateContext);
  if (context === undefined) {
    throw new Error("usePatientState must be used within a PatientProvider");
  }

  return context;
}

export function usePatientDispatch() {
  const context = useContext(PatientDispatchContext);
  if (context === undefined) {
    throw new Error("usePatientDispatch must be used within a PatientProvider");
  }

  return context;
}

// Provider
export const PatientProvider = ({ children }) => {
  const [patient, dispatch] = useReducer(PatientReducer, initialState);

  return (
    <PatientStateContext.Provider value={patient}>
      <PatientDispatchContext.Provider value={dispatch}>
        {children}
      </PatientDispatchContext.Provider>
    </PatientStateContext.Provider>
  );
};
