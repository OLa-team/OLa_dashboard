import React, { useContext, useReducer } from "react";

let cp = localStorage.getItem("currentPatient")
  ? JSON.parse(localStorage.getItem("currentPatient"))
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
