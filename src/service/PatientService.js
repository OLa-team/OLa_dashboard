import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../firebase";

const patientCollectionRef = collection(firestore, "patient");

// register new patient
export async function createPatientAccount(newPatientData, patientId) {
  try {
    await setDoc(doc(firestore, "patient", patientId), {
      name: newPatientData.name,
      icNo: newPatientData.icNo,
      phoneNo: "+6" + newPatientData.phoneNo,
      birthDate: "",
      age: 0,
      gender: "",
      nextOfKin: "",
      nextOfKinContact: "",
    });

    await setDoc(doc(firestore, "medical condition", patientId), {
      nameUpdated: "",
      dateTimeUpdated: "",
    });

    await setDoc(doc(firestore, "allergy", patientId), {
      nameUpdated: "",
      dateTimeUpdated: "",
    });

    await setDoc(doc(firestore, "stroke_risk", patientId), {
      nameUpdated: "",
      dateTimeUpdated: "",
    });

    await setDoc(doc(firestore, "bleeding_risk", patientId), {
      nameUpdated: "",
      dateTimeUpdated: "",
    });

    await setDoc(doc(firestore, "warfarin_quality", patientId), {
      nameUpdated: "",
      dateTimeUpdated: "",
    });

    await setDoc(doc(firestore, "health_goal", patientId), {
      nameUpdated: "",
      dateTimeUpdated: "",
    });
  } catch (error) {
    throw new Error(`Error in register new patient: `, error);
  }
}

// set current patient using patientId
export async function setCurrentPatient(dispatch, patientId) {
  if (localStorage.getItem("currentPatient")) {
    console.log("Remove", localStorage.getItem("currentPatient"));
    localStorage.removeItem("currentPatient");
  }

  try {
    dispatch({
      type: "SET_LOADING_TRUE",
    });

    let responsePatient = await (
      await getDoc(doc(firestore, "patient", patientId))
    ).data();

    let responseMedicalCondition = await (
      await getDoc(doc(firestore, "medical condition", patientId))
    ).data();

    let responseAllergy = await (
      await getDoc(doc(firestore, "allergy", patientId))
    ).data();

    let responseStrokeRisk = await (
      await getDoc(doc(firestore, "stroke_risk", patientId))
    ).data();

    let responseBleedingRisk = await (
      await getDoc(doc(firestore, "bleeding_risk", patientId))
    ).data();

    let responseWarfarinQuality = await (
      await getDoc(doc(firestore, "warfarin_quality", patientId))
    ).data();

    let responseHealthGoal = await (
      await getDoc(doc(firestore, "health_goal", patientId))
    ).data();

    const patientData = responsePatient;
    const medicalConditionData = responseMedicalCondition;
    const allergyData = responseAllergy;
    const strokeRiskData = responseStrokeRisk;
    const bleedingRiskData = responseBleedingRisk;
    const warfarinQualityData = responseWarfarinQuality;
    const healthGoalData = responseHealthGoal;

    if (responsePatient) {
      dispatch({
        type: "SET_CURRENT_PATIENT",
        payload: patientData,
      });

      localStorage.setItem("currentPatient", JSON.stringify(patientData));
    }

    if (responseMedicalCondition) {
      dispatch({
        type: "SET_MEDICAL_CONDITION",
        payload: medicalConditionData,
      });

      localStorage.setItem(
        "medicalCondition",
        JSON.stringify(medicalConditionData)
      );
    }

    if (responseAllergy) {
      dispatch({
        type: "SET_ALLERGY",
        payload: allergyData,
      });

      localStorage.setItem("allergy", JSON.stringify(allergyData));
    }

    if (responseStrokeRisk) {
      dispatch({
        type: "SET_STROKE_RISK",
        payload: strokeRiskData,
      });

      localStorage.setItem("strokeRisk", JSON.stringify(strokeRiskData));
    }

    if (responseBleedingRisk) {
      dispatch({
        type: "SET_BLEEDING_RISK",
        payload: bleedingRiskData,
      });

      localStorage.setItem("bleedingRisk", JSON.stringify(bleedingRiskData));
    }

    if (responseWarfarinQuality) {
      dispatch({
        type: "SET_WARFARIN_QUALITY",
        payload: warfarinQualityData,
      });

      localStorage.setItem(
        "warfarinQuality",
        JSON.stringify(warfarinQualityData)
      );
    }

    if (responseHealthGoal) {
      dispatch({
        type: "SET_HEALTH_GOAL",
        payload: healthGoalData,
      });

      localStorage.setItem("healthGoal", JSON.stringify(healthGoalData));
    }

    dispatch({
      type: "SET_LOADING_FALSE",
    });
  } catch (error) {
    throw new Error(`Error in set current patient: `, error);
  }
}

// fetch patient list
export async function fetchPatientList(dispatch) {
  try {
    let response = await getDocs(patientCollectionRef);
    let data = response.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    let number = 1;
    let patientListData = data.map((patient) => ({
      patientId: patient.id,
      id: number++,
      name: patient.name,
      icNo: patient.icNo,
      phoneNo: patient.phoneNo,
    }));

    if (patientListData.length >= 0) {
      dispatch({
        type: "SET_PATIENT_LIST",
        payload: patientListData,
      });
      return patientListData;
    }

    return;
  } catch (error) {
    throw new Error(`Error in set patient list: `, error);
  }
}

// filter patient list
export function filterPatientList(dispatch, patientList, searchResult) {
  let tempPatientList = patientList.filter(
    (patient) =>
      patient.name.toLowerCase().indexOf(searchResult.toLowerCase()) > -1
  );

  dispatch({
    type: "SET_TEMP_PATIENT_LIST",
    payload: tempPatientList,
  });
}

// update patient profile data
export async function updatePatientProfile(newData) {
  try {
    await updateDoc(doc(firestore, "patient", newData.patientId), {
      name: newData.name,
      phoneNo: "+6" + newData.phoneNo,
      icNo: newData.icNo,
      birthDate: newData.birthDate,
      age: newData.age,
      gender: newData.gender,
      nextOfKin: newData.nextOfKin,
      nextOfKinContact: newData.nextOfKinContact,
    });
  } catch (error) {
    alert(error.message);
    console.log("Error in update patient data", error);
    return;
  }
}

// update patient medical condition data
export async function updateMedicalCondition(medicalConditionData, patientId) {
  try {
    await updateDoc(doc(firestore, "medical condition", patientId), {
      nameUpdated: medicalConditionData.nameUpdated,
      dateTimeUpdated: medicalConditionData.dateTimeUpdated,
      hypertension: medicalConditionData.hypertension,
      diabetes: medicalConditionData.diabetes,
      hyperlipidemia: medicalConditionData.hyperlipidemia,
      atrial: medicalConditionData.atrial,
      heart: medicalConditionData.heart,
      stroke: medicalConditionData.stroke,
      vascular: medicalConditionData.vascular,
      asthma: medicalConditionData.asthma,
      copd: medicalConditionData.copd,
      renal: medicalConditionData.renal,
      liver: medicalConditionData.liver,
    });
  } catch (error) {
    alert(error.message);
    console.log("Error in update medical condition data", error);
    return;
  }
}

// update patient allergy data
export async function updateAllergy(allergyData, patientId) {
  try {
    await updateDoc(doc(firestore, "allergy", patientId), {
      nameUpdated: allergyData.nameUpdated,
      dateTimeUpdated: allergyData.dateTimeUpdated,
      hasAllergy: allergyData.hasAllergy,
      food: allergyData.food,
      medicine: allergyData.medicine,
    });
  } catch (error) {
    alert(error.message);
    console.log("Error in update allergy data", error);
    return;
  }
}

// update patient stroke risk data
export async function updateStrokeRisk(strokeRiskData, patientId) {
  try {
    await updateDoc(doc(firestore, "stroke_risk", patientId), {
      nameUpdated: strokeRiskData.nameUpdated,
      dateTimeUpdated: strokeRiskData.dateTimeUpdated,
      heartFailure: strokeRiskData.heartFailure,
      hypertension: strokeRiskData.hypertension,
      age75: strokeRiskData.age75,
      diabetes: strokeRiskData.diabetes,
      stroke: strokeRiskData.stroke,
      vascular: strokeRiskData.vascular,
      age6574: strokeRiskData.age6574,
      female: strokeRiskData.female,
      score: strokeRiskData.score,
      result: strokeRiskData.result,
      colorMsg: strokeRiskData.colorMsg,
    });
  } catch (error) {
    alert(error.message);
    console.log("Error in update stroke risk data", error);
    return;
  }
}

// update patient bleeding risk data
export async function updateBleedingRisk(bleedingRiskData, patientId) {
  try {
    await updateDoc(doc(firestore, "bleeding_risk", patientId), {
      nameUpdated: bleedingRiskData.nameUpdated,
      dateTimeUpdated: bleedingRiskData.dateTimeUpdated,
      hypertension: bleedingRiskData.hypertension,
      renal: bleedingRiskData.renal,
      liver: bleedingRiskData.liver,
      stroke: bleedingRiskData.stroke,
      bleeding: bleedingRiskData.bleeding,
      inr: bleedingRiskData.inr,
      age65: bleedingRiskData.age65,
      drugs: bleedingRiskData.drugs,
      alcohol: bleedingRiskData.alcohol,
      score: bleedingRiskData.score,
      result: bleedingRiskData.result,
      colorMsg: bleedingRiskData.colorMsg,
    });
  } catch (error) {
    alert(error.message);
    console.log("Error in update bleeding risk data", error);
    return;
  }
}

// update patient warfarin quality data
export async function updateWarfarinQuality(warfarinQualityData, patientId) {
  try {
    await updateDoc(doc(firestore, "warfarin_quality", patientId), {
      nameUpdated: warfarinQualityData.nameUpdated,
      dateTimeUpdated: warfarinQualityData.dateTimeUpdated,
      sex: warfarinQualityData.sex,
      age: warfarinQualityData.age,
      medHistory: warfarinQualityData.medHistory,
      treatment: warfarinQualityData.treatment,
      tobacco: warfarinQualityData.tobacco,
      race: warfarinQualityData.race,
      score: warfarinQualityData.score,
      result: warfarinQualityData.result,
      colorMsg: warfarinQualityData.colorMsg,
    });
  } catch (error) {
    alert(error.message);
    console.log("Error in update warfarin quality data", error);
    return;
  }
}

// update patient health goal data
export async function updateHealthGoal(healthGoalData, patientId) {
  try {
    await updateDoc(doc(firestore, "health_goal", patientId), {
      nameUpdated: healthGoalData.nameUpdated,
      dateTimeUpdated: healthGoalData.dateTimeUpdated,
      healthGoalList: healthGoalData.healthGoalList,
      agreeToGoal: healthGoalData.agreeToGoal,
    });
  } catch (error) {
    alert(error.message);
    console.log("Error in update health goal data", error);
    return;
  }
}

// delete patient by id
export async function deletePatientById(id) {
  var patientRef = doc(firestore, "patient", id);
  var medicalConRef = doc(firestore, "medical condition", id);
  var allergyRef = doc(firestore, "allergy", id);

  const patientDocSnap = await getDoc(patientRef);
  const medicalConDocSnap = await getDoc(medicalConRef);
  const allergyDocSnap = await getDoc(allergyRef);

  if (
    !patientDocSnap.exists() ||
    !medicalConDocSnap.exists() ||
    !allergyDocSnap.exists()
  ) {
    alert("Document does not exist");
    return;
  }

  try {
    await deleteDoc(patientRef);
    await deleteDoc(medicalConRef);
    await deleteDoc(allergyRef);
  } catch (error) {
    console.log("Error in delete patient by id", error);
    return;
  }
}

// Delete all selected patient
export function deleteAllSelectedPatients(dispatch, patientList) {
  patientList.forEach((patient) => {
    deletePatientById(patient.patientId);
  });

  dispatch({
    type: "DELETE_SELECTED_PATIENTS_AND_UPDATE",
    payload: patientList,
  });

  console.log("deleted patients", patientList);
  return patientList;
}
