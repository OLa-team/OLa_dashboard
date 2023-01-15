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
import { encryptLocalData } from "../utils";

const patientCollectionRef = collection(firestore, "patient");

// register new patient
export async function createPatientAccount(newPatientData, dispatch) {
  dispatch({
    type: "SET_LOADING_TRUE",
  });

  const patientId = newPatientData.patientId;
  try {
    await setDoc(doc(firestore, "patient", patientId), {
      name: newPatientData.name,
      icNo: newPatientData.icNo,
      phoneNo: newPatientData.phoneNo,
      patientId: newPatientData.patientId,
      birthDate: 0,
      age: 0,
      gender: "",
      nextOfKin: "",
      nextOfKinContact: "",
    });

    await setDoc(doc(firestore, "medical_condition", patientId), {
      nameUpdated: "",
      nameVerified: "",
      dateTimeUpdated: 0,
      hypertension: false,
      diabetes: false,
      hyperlipidemia: false,
      atrial: false,
      heart: false,
      stroke: false,
      vascular: false,
      asthma: false,
      copd: false,
      renal: false,
      liver: false,
      otherMedicalCondition: [],
    });

    await setDoc(doc(firestore, "allergy", patientId), {
      nameUpdated: "",
      nameVerified: "",
      dateTimeUpdated: 0,
      hasAllergy: false,
      allergyStatus: "unknown",
      food: [],
      medicine: [],
      newToAllergyPage: true,
    });

    await setDoc(doc(firestore, "stroke_risk", patientId), {
      nameUpdated: "",
      nameVerified: "",
      dateTimeUpdated: 0,
      heartFailure: false,
      hypertension: false,
      age75: false,
      diabetes: false,
      stroke: false,
      vascular: false,
      age6574: false,
      female: false,
      score: 0,
      result: "No result",
      colorMsg: "#000000",
    });

    await setDoc(doc(firestore, "bleeding_risk", patientId), {
      nameUpdated: "",
      nameVerified: "",
      dateTimeUpdated: 0,
      hypertension: false,
      renal: false,
      liver: false,
      stroke: false,
      bleeding: false,
      inr: false,
      age65: false,
      drugs: false,
      alcohol: false,
      score: 0,
      result: "No result",
      colorMsg: "#000000",
    });

    await setDoc(doc(firestore, "warfarin_quality", patientId), {
      nameUpdated: "",
      nameVerified: "",
      dateTimeUpdated: 0,
      sex: false,
      age: false,
      medHistory: false,
      treatment: false,
      tobacco: false,
      race: false,
      score: 0,
      result: "No result",
      colorMsg: "#000000",
    });

    await setDoc(doc(firestore, "health_goal", patientId), {
      nameUpdated: "",
      dateTimeUpdated: 0,
      healthGoalList: [],
      agreeToGoal: false,
    });

    await setDoc(doc(firestore, "medication", patientId), {
      nameUpdated: "",
      nameVerified: "",
      dateTimeUpdated: 0,
      medicine: [],
    });

    await setDoc(doc(firestore, "blood_thinner", patientId), {
      nameUpdated: "",
      nameVerified: "",
      dateTimeUpdated: 0,
      anticoagulant: "",
      indication: "",
      duration: "",
      dose1: "",
      dose2: "",
      dose3: "",
      inrRange: "",
      inrRecord: [],
      creatinineRecord: [],
      dose: "",
      ttrResult: {},
    });

    await setDoc(doc(firestore, "self_monitor", patientId), {
      bleedingSymptomRecord: [],
      bloodPressureHeartRateRecord: [],
      bodyWeightRecord: [],
      healthDiaryRecord: [],
      sugarLevelRecord: [],
    });

    await setDoc(doc(firestore, "notification", patientId), {
      SM_bleedingSymptom: false,
      SM_bodyWeight: false,
      SM_bpAndHeartRate: false,
      SM_healthDiary: false,
      SM_sugarLevel: false,
      // changeData: {},
      // changeDataMobile: false,
      // changeDataWeb: false,
      // registration: {},
      // registrationMobile: false,
      // registrationWeb: true,
    });

    await setDoc(doc(firestore, "hemoglobin", patientId), {
      nameUpdated: "",
      nameVerified: "",
      dateTimeUpdated: 0,
      hemoglobinRecord: [],
    });

    await setDoc(doc(firestore, "message_for_patients", patientId), {
      messageList: [],
      read: false,
    });

    await setDoc(doc(firestore, "reminder", patientId), {
      tasks: [],
    });
  } catch (error) {
    throw new Error(`Error in register new patient: `, error);
  }

  dispatch({
    type: "SET_LOADING_FALSE",
  });
}

// set current patient using patientId
export async function setCurrentPatient(dispatch, patientId) {
  if (localStorage.getItem("currentPatient")) {
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
      await getDoc(doc(firestore, "medical_condition", patientId))
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

    let responseMedication = await (
      await getDoc(doc(firestore, "medication", patientId))
    ).data();

    let responseBloodThinner = await (
      await getDoc(doc(firestore, "blood_thinner", patientId))
    ).data();

    let responsePatientMonitoring = await (
      await getDoc(doc(firestore, "self_monitor", patientId))
    ).data();

    let responseHemoglobin = await (
      await getDoc(doc(firestore, "hemoglobin", patientId))
    ).data();

    let responseNotification = await (
      await getDoc(doc(firestore, "notification", patientId))
    ).data();

    let responseMessageForPatients = await (
      await getDoc(doc(firestore, "message_for_patients", patientId))
    ).data();

    let responseDefaultHealthGoal = await (
      await getDoc(doc(firestore, "constant", "health_goal"))
    ).data();

    let responseStrokeRiskResultMessage = await (
      await getDoc(doc(firestore, "constant", "stroke_risk"))
    ).data();

    let responseBleedingRiskResultMessage = await (
      await getDoc(doc(firestore, "constant", "bleeding_risk"))
    ).data();

    let responseWarfarinQualityResultMessage = await (
      await getDoc(doc(firestore, "constant", "warfarin_quality"))
    ).data();

    let responseMedicationConstantList = await (
      await getDoc(doc(firestore, "constant", "medication"))
    ).data();

    // patient profile
    if (responsePatient) {
      dispatch({
        type: "SET_CURRENT_PATIENT",
        payload: responsePatient,
      });

      encryptLocalData(responsePatient, "currentPatient");
    } else {
      dispatch({
        type: "SET_CURRENT_PATIENT",
        payload: {},
      });

      localStorage.setItem("currentPatient", JSON.stringify({}));

      alert("Error in fetching currentPatient data");
    }

    // medical condition
    if (responseMedicalCondition) {
      dispatch({
        type: "SET_MEDICAL_CONDITION",
        payload: responseMedicalCondition,
      });

      localStorage.setItem(
        "medicalCondition",
        JSON.stringify(responseMedicalCondition)
      );
    } else {
      dispatch({
        type: "SET_MEDICAL_CONDITION",
        payload: {},
      });

      localStorage.setItem("medicalCondition", JSON.stringify({}));

      alert("Error in fetching medicalCondition data");
    }

    // allergy
    if (responseAllergy) {
      dispatch({
        type: "SET_ALLERGY",
        payload: responseAllergy,
      });

      localStorage.setItem("allergy", JSON.stringify(responseAllergy));
    } else {
      dispatch({
        type: "SET_ALLERGY",
        payload: {},
      });

      localStorage.setItem("allergy", JSON.stringify({}));

      alert("Error in fetching allergy data");
    }

    // stroke risk
    if (responseStrokeRisk) {
      dispatch({
        type: "SET_STROKE_RISK",
        payload: responseStrokeRisk,
      });

      localStorage.setItem("strokeRisk", JSON.stringify(responseStrokeRisk));
    } else {
      dispatch({
        type: "SET_STROKE_RISK",
        payload: {},
      });

      localStorage.setItem("strokeRisk", JSON.stringify({}));

      alert("Error in fetching strokeRisk data");
    }

    // bleeding risk
    if (responseBleedingRisk) {
      dispatch({
        type: "SET_BLEEDING_RISK",
        payload: responseBleedingRisk,
      });

      localStorage.setItem(
        "bleedingRisk",
        JSON.stringify(responseBleedingRisk)
      );
    } else {
      dispatch({
        type: "SET_BLEEDING_RISK",
        payload: {},
      });

      localStorage.setItem("bleedingRisk", JSON.stringify({}));

      alert("Error in fetching bleedingRisk data");
    }

    // warfarin quality
    if (responseWarfarinQuality) {
      dispatch({
        type: "SET_WARFARIN_QUALITY",
        payload: responseWarfarinQuality,
      });

      localStorage.setItem(
        "warfarinQuality",
        JSON.stringify(responseWarfarinQuality)
      );
    } else {
      dispatch({
        type: "SET_WARFARIN_QUALITY",
        payload: {},
      });

      localStorage.setItem("warfarinQuality", JSON.stringify({}));

      alert("Error in fetching warfarinQuality data");
    }

    // health goal
    if (responseHealthGoal) {
      dispatch({
        type: "SET_HEALTH_GOAL",
        payload: responseHealthGoal,
      });

      localStorage.setItem("healthGoal", JSON.stringify(responseHealthGoal));
    } else {
      dispatch({
        type: "SET_HEALTH_GOAL",
        payload: {},
      });

      localStorage.setItem("healthGoal", JSON.stringify({}));

      alert("Error in fetching healthGoal data");
    }

    // medication
    if (responseMedication) {
      dispatch({
        type: "SET_MEDICATION",
        payload: responseMedication,
      });

      localStorage.setItem("medication", JSON.stringify(responseMedication));
    } else {
      dispatch({
        type: "SET_MEDICATION",
        payload: {},
      });

      localStorage.setItem("medication", JSON.stringify({}));

      alert("Error in fetching medication data");
    }

    // blood thinner
    if (responseBloodThinner) {
      dispatch({
        type: "SET_BLOOD_THINNER",
        payload: responseBloodThinner,
      });

      localStorage.setItem(
        "bloodThinner",
        JSON.stringify(responseBloodThinner)
      );
    } else {
      dispatch({
        type: "SET_BLOOD_THINNER",
        payload: {},
      });

      localStorage.setItem("bloodThinner", JSON.stringify({}));

      alert("Error in fetching bloodThinner data");
    }

    // patient monitoring
    if (responsePatientMonitoring) {
      dispatch({
        type: "SET_PATIENT_MONITORING",
        payload: responsePatientMonitoring,
      });

      localStorage.setItem(
        "patientMonitoring",
        JSON.stringify(responsePatientMonitoring)
      );
    } else {
      dispatch({
        type: "SET_PATIENT_MONITORING",
        payload: {},
      });

      localStorage.setItem("patientMonitoring", JSON.stringify({}));

      alert("Error in fetching patientMonitoring data");
    }

    // hemoglobin
    if (responseHemoglobin) {
      dispatch({
        type: "SET_HEMOGLOBIN",
        payload: responseHemoglobin,
      });

      localStorage.setItem("hemoglobin", JSON.stringify(responseHemoglobin));
    } else {
      dispatch({
        type: "SET_HEMOGLOBIN",
        payload: {},
      });

      localStorage.setItem("hemoglobin", JSON.stringify({}));
      //
      alert("Error in fetching hemoglobin data");
    }

    // notification
    if (responseNotification) {
      dispatch({
        type: "SET_NOTIFICATION",
        payload: responseNotification,
      });

      localStorage.setItem(
        "notification",
        JSON.stringify(responseNotification)
      );
    } else {
      dispatch({
        type: "SET_NOTIFICATION",
        payload: {},
      });

      localStorage.setItem("notification", JSON.stringify({}));
      //
      alert("Error in fetching notification data");
    }

    // message for patients
    if (responseMessageForPatients) {
      dispatch({
        type: "SET_MESSAGE_FOR_PATIENTS",
        payload: responseMessageForPatients,
      });

      localStorage.setItem(
        "messageForPatients",
        JSON.stringify(responseMessageForPatients)
      );
    } else {
      dispatch({
        type: "SET_MESSAGE_FOR_PATIENTS",
        payload: {},
      });

      localStorage.setItem("messageForPatients", JSON.stringify({}));
      //
      alert("Error in fetching messageForPatients data");
    }

    // CONSTANT from db
    if (responseDefaultHealthGoal) {
      dispatch({
        type: "SET_DEFAULT_HEALTH_GOAL",
        payload: responseDefaultHealthGoal,
      });

      localStorage.setItem(
        "defaultHealthGoal",
        JSON.stringify(responseDefaultHealthGoal)
      );
    }

    if (responseStrokeRiskResultMessage) {
      dispatch({
        type: "SET_STROKE_RISK_RESULT_MESSAGE",
        payload: responseStrokeRiskResultMessage,
      });

      localStorage.setItem(
        "strokeRiskResultMessage",
        JSON.stringify(responseStrokeRiskResultMessage)
      );
    }

    if (responseBleedingRiskResultMessage) {
      dispatch({
        type: "SET_BLEEDING_RISK_RESULT_MESSAGE",
        payload: responseBleedingRiskResultMessage,
      });

      localStorage.setItem(
        "bleedingRiskResultMessage",
        JSON.stringify(responseBleedingRiskResultMessage)
      );
    }

    if (responseWarfarinQualityResultMessage) {
      dispatch({
        type: "SET_WARFARIN_QUALITY_RESULT_MESSAGE",
        payload: responseWarfarinQualityResultMessage,
      });

      localStorage.setItem(
        "warfarinQualityResultMessage",
        JSON.stringify(responseWarfarinQualityResultMessage)
      );
    }

    if (responseMedicationConstantList) {
      dispatch({
        type: "SET_MEDICATION_CONSTANT_LIST",
        payload: responseMedicationConstantList,
      });

      localStorage.setItem(
        "medicationConstantList",
        JSON.stringify(responseMedicationConstantList)
      );
    }

    dispatch({
      type: "SET_LOADING_FALSE",
    });
  } catch (error) {
    throw new Error(`Error in set current patient: `, error);
  }
}

// fetch patient list
export async function fetchPatientList(
  patientDispatch,
  pageDispatch,
  patientHasNotifList
) {
  pageDispatch({
    type: "SET_LOADING_TRUE",
  });

  try {
    let response = await getDocs(patientCollectionRef);
    let data = response.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    // let number = 1;
    let patientListData = data.map((patient) => ({
      // id: number++,
      patientId: patient.id,
      name: patient.name,
      icNo: patient.icNo,
      phoneNo: patient.phoneNo,
    }));
    let notifList = [];

    if (patientHasNotifList.length > 0) {
      patientHasNotifList = patientHasNotifList.filter(
        (value, index, self) => self.indexOf(value) === index
      );
      console.log("patientHasNotifList", patientHasNotifList);
      patientHasNotifList.forEach((patientHasNotifId) => {
        patientListData.forEach((patient) => {
          if (patient.patientId === patientHasNotifId) {
            notifList.push(patient);
            patientListData = patientListData.filter((pt) => {
              return pt.patientId !== patientHasNotifId;
            });
          }
        });
      });
    }

    let number = 1;
    patientListData = notifList.concat(patientListData).map((pt) => ({
      ...pt,
      id: number++,
    }));

    if (patientListData.length >= 0) {
      patientDispatch({
        type: "SET_PATIENT_LIST",
        payload: patientListData,
      });
    }

    pageDispatch({
      type: "SET_LOADING_FALSE",
    });
  } catch (error) {
    throw new Error(`Error in set patient list: `, error.message);
  }
}

// filter patient list
export function filterPatientList(dispatch, patientList, searchResult) {
  let number = 1;
  let tempPatientList = patientList
    .filter((patient) => {
      return (
        (patient.name
          ? patient.name.toLowerCase().indexOf(searchResult.toLowerCase()) !==
            -1
          : false) ||
        (patient.icNo
          ? patient.icNo.toLowerCase().indexOf(searchResult.toLowerCase()) !==
            -1
          : false) ||
        (patient.phoneNo
          ? patient.phoneNo
              .toLowerCase()
              .indexOf(searchResult.toLowerCase()) !== -1
          : false)
      );
    })
    .map((pt) => ({
      ...pt,
      id: number++,
    }));

  dispatch({
    type: "SET_TEMP_PATIENT_LIST",
    payload: tempPatientList,
  });
}

// update patient profile data
export async function updatePatientProfile(newData) {
  try {
    await updateDoc(doc(firestore, "patient", newData.patientId), {
      // name: newData.name,
      // phoneNo: "+6" + newData.phoneNo,
      // icNo: newData.icNo,
      birthDate: newData.birthDate,
      age: newData.age,
      gender: newData.gender,
      // nextOfKin: newData.nextOfKin,
      // nextOfKinContact: newData.nextOfKinContact,
    });
  } catch (error) {
    alert(error.message);
    console.error("Error in update patient data", error);
    return;
  }
}

// update patient medical condition data
export async function updateMedicalCondition(medicalConditionData, patientId) {
  try {
    await updateDoc(doc(firestore, "medical_condition", patientId), {
      nameUpdated: medicalConditionData.nameUpdated,
      dateTimeUpdated: medicalConditionData.dateTimeUpdated,
      nameVerified: medicalConditionData.nameVerified,
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
      otherMedicalCondition: medicalConditionData.otherMedicalCondition,
    });
  } catch (error) {
    alert(error.message);
    console.error("Error in update medical_condition data", error);
    return;
  }
}

// update patient allergy data
export async function updateAllergy(allergyData, patientId) {
  try {
    await updateDoc(doc(firestore, "allergy", patientId), {
      nameUpdated: allergyData.nameUpdated,
      dateTimeUpdated: allergyData.dateTimeUpdated,
      nameVerified: allergyData.nameVerified,
      allergyStatus: allergyData.allergyStatus,
      hasAllergy: allergyData.hasAllergy,
      food: allergyData.food,
      medicine: allergyData.medicine,
    });
  } catch (error) {
    alert(error.message);
    console.error("Error in update allergy data", error);
    return;
  }
}

// update patient stroke risk data
export async function updateStrokeRisk(strokeRiskData, patientId) {
  try {
    await updateDoc(doc(firestore, "stroke_risk", patientId), {
      nameUpdated: strokeRiskData.nameUpdated,
      dateTimeUpdated: strokeRiskData.dateTimeUpdated,
      nameVerified: strokeRiskData.nameVerified,
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
    console.error("Error in update stroke risk data", error);
    return;
  }
}

// update patient bleeding risk data
export async function updateBleedingRisk(bleedingRiskData, patientId) {
  try {
    await updateDoc(doc(firestore, "bleeding_risk", patientId), {
      nameUpdated: bleedingRiskData.nameUpdated,
      dateTimeUpdated: bleedingRiskData.dateTimeUpdated,
      nameVerified: bleedingRiskData.nameVerified,
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
    console.error("Error in update bleeding risk data", error);
    return;
  }
}

// update patient warfarin quality data
export async function updateWarfarinQuality(warfarinQualityData, patientId) {
  try {
    await updateDoc(doc(firestore, "warfarin_quality", patientId), {
      nameUpdated: warfarinQualityData.nameUpdated,
      dateTimeUpdated: warfarinQualityData.dateTimeUpdated,
      nameVerified: warfarinQualityData.nameVerified,
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
    console.error("Error in update warfarin quality data", error);
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
    console.error("Error in update health goal data", error);
    return;
  }
}

// update patient medication data
export async function updateMedication(medicationData, patientId) {
  try {
    await updateDoc(doc(firestore, "medication", patientId), {
      nameUpdated: medicationData.nameUpdated,
      dateTimeUpdated: medicationData.dateTimeUpdated,
      nameVerified: medicationData.nameVerified,
      medicine: medicationData.medicineList,
    });
  } catch (error) {
    alert(error.message);
    console.error("Error in update medication data", error);
    return;
  }
}

// update patient blood thinner data
export async function updateBloodThinner(
  bloodThinnerData,
  patientId,
  isChangeAnticoagulant
) {
  try {
    if (isChangeAnticoagulant) {
      await updateDoc(doc(firestore, "blood_thinner", patientId), {
        nameUpdated: bloodThinnerData.nameUpdated,
        dateTimeUpdated: bloodThinnerData.dateTimeUpdated,
        nameVerified: bloodThinnerData.nameVerified,
        anticoagulant: bloodThinnerData.anticoagulant,
        indication: bloodThinnerData.indication,
        dose: bloodThinnerData.dose,
        duration: bloodThinnerData.duration,
        dose1: bloodThinnerData.dose1,
        dose2: bloodThinnerData.dose2,
        dose3: bloodThinnerData.dose3,
        inrRange: bloodThinnerData.inrRange,
        dose: bloodThinnerData.dose,
        creatinineRecord: bloodThinnerData.creatinineRecord,
        inrRecord: bloodThinnerData.inrRecord,
      });
    } else {
      await updateDoc(doc(firestore, "blood_thinner", patientId), {
        nameUpdated: bloodThinnerData.nameUpdated,
        dateTimeUpdated: bloodThinnerData.dateTimeUpdated,
        nameVerified: bloodThinnerData.nameVerified,
        anticoagulant: bloodThinnerData.anticoagulant,
        indication: bloodThinnerData.indication,
        dose: bloodThinnerData.dose,
        duration: bloodThinnerData.duration,
        dose1: bloodThinnerData.dose1,
        dose2: bloodThinnerData.dose2,
        dose3: bloodThinnerData.dose3,
        inrRange: bloodThinnerData.inrRange,
      });
    }
  } catch (error) {
    alert(error.message);
    console.error("Error in update blood thinner data", error);
    return;
  }
}

// update patient inr record data
export async function updateInrRecord(inrRecordData, patientId) {
  try {
    await updateDoc(doc(firestore, "blood_thinner", patientId), {
      nameUpdated: inrRecordData.nameUpdated,
      dateTimeUpdated: inrRecordData.dateTimeUpdated,
      inrRecord: inrRecordData.inrRecord,
      ttrResult: inrRecordData.ttrResult,
    });
  } catch (error) {
    alert(error.message);
    console.error("Error in update inr record data", error);
    return;
  }
}

// update patient creatinine record data
export async function updateCreatinineRecord(creatinineRecordData, patientId) {
  try {
    await updateDoc(doc(firestore, "blood_thinner", patientId), {
      nameUpdated: creatinineRecordData.nameUpdated,
      dateTimeUpdated: creatinineRecordData.dateTimeUpdated,
      creatinineRecord: creatinineRecordData.creatinineRecord,
    });
  } catch (error) {
    alert(error.message);
    console.error("Error in update creatinine record data", error);
    return;
  }
}

// update patient hemoglobin record data
export async function updateHemoglobinRecord(hemoglobinData, patientId) {
  try {
    await updateDoc(doc(firestore, "hemoglobin", patientId), {
      nameUpdated: hemoglobinData.nameUpdated,
      dateTimeUpdated: hemoglobinData.dateTimeUpdated,
      hemoglobinRecord: hemoglobinData.hemoglobinList,
    });
  } catch (error) {
    alert(error.message);
    console.error("Error in update hemoglobin record data", error);
    return;
  }
}

// update patient message for patients data
export async function updateMessageForPatients(messageData, patientId) {
  try {
    await updateDoc(doc(firestore, "message_for_patients", patientId), {
      messageList: messageData.messageList,
      read: messageData.read,
    });
  } catch (error) {
    alert(error.message);
    console.error("Error in update message for patients data", error);
    return;
  }
}

// update name verified for specific data
export async function updateNameVerified(collection, patientId, nameVerified) {
  try {
    await updateDoc(doc(firestore, collection, patientId), {
      nameVerified: nameVerified,
    });
  } catch (error) {
    alert(error.message);
    console.log(
      `Error in update name verified in ${collection} collection`,
      error
    );
    return;
  }
}

// delete patient by id
export async function deletePatientById(id, dispatch) {
  try {
    var patientRef = doc(firestore, "patient", id);
    var medicalConRef = doc(firestore, "medical_condition", id);
    var allergyRef = doc(firestore, "allergy", id);
    var healthGoalRef = doc(firestore, "health_goal", id);
    var strokeRiskRef = doc(firestore, "stroke_risk", id);
    var bleedingRiskRef = doc(firestore, "bleeding_risk", id);
    var warfarinQualityRef = doc(firestore, "warfarin_quality", id);
    var medicationRef = doc(firestore, "medication", id);
    var bloodThinnerRef = doc(firestore, "blood_thinner", id);
    var selfMonitorRef = doc(firestore, "self_monitor", id);
    var hemoglobinRef = doc(firestore, "hemoglobin", id);
    var notificationRef = doc(firestore, "notification", id);
    var reminderRef = doc(firestore, "reminder", id);
    var messageForPatientsRef = doc(firestore, "message_for_patients", id);

    const patientDocSnap = await getDoc(patientRef);
    const medicalConDocSnap = await getDoc(medicalConRef);
    const allergyDocSnap = await getDoc(allergyRef);
    const healthGoalDocSnap = await getDoc(healthGoalRef);
    const strokeRiskDocSnap = await getDoc(strokeRiskRef);
    const bleedingRiskDocSnap = await getDoc(bleedingRiskRef);
    const warfarinQualityDocSnap = await getDoc(warfarinQualityRef);
    const medicationDocSnap = await getDoc(medicationRef);
    const bloodThinnerDocSnap = await getDoc(bloodThinnerRef);
    const selfMonitorDocSnap = await getDoc(selfMonitorRef);
    const hemoglobinDocSnap = await getDoc(hemoglobinRef);
    const notificationDocSnap = await getDoc(notificationRef);
    const reminderDocSnap = await getDoc(reminderRef);
    const messageForPatientsDocSnap = await getDoc(messageForPatientsRef);

    if (
      !patientDocSnap.exists() ||
      !medicalConDocSnap.exists() ||
      !allergyDocSnap.exists() ||
      !healthGoalDocSnap.exists() ||
      !strokeRiskDocSnap.exists() ||
      !bleedingRiskDocSnap.exists() ||
      !warfarinQualityDocSnap.exists() ||
      !medicationDocSnap.exists() ||
      !bloodThinnerDocSnap.exists() ||
      !selfMonitorDocSnap.exists() ||
      !hemoglobinDocSnap.exists() ||
      !notificationDocSnap.exists() ||
      !reminderDocSnap.exists() ||
      !messageForPatientsDocSnap.exists()
    ) {
      alert("Document does not exist");
      return;
    }

    // delete ref
    await deleteDoc(patientRef);
    await deleteDoc(medicalConRef);
    await deleteDoc(allergyRef);
    await deleteDoc(healthGoalRef);
    await deleteDoc(strokeRiskRef);
    await deleteDoc(bleedingRiskRef);
    await deleteDoc(warfarinQualityRef);
    await deleteDoc(medicationRef);
    await deleteDoc(bloodThinnerRef);
    await deleteDoc(selfMonitorRef);
    await deleteDoc(hemoglobinRef);
    await deleteDoc(notificationRef);
    await deleteDoc(reminderRef);
    await deleteDoc(messageForPatientsRef);
  } catch (error) {
    alert("Error in delete patient by id");
    throw new Error("Error in delete patient by id", error);
  }
}

// Delete all selected patient
export async function deleteAllSelectedPatients(dispatch, selectedPatientList) {
  await selectedPatientList.forEach((patient) => {
    deletePatientById(patient.patientId, dispatch);
  });

  dispatch({
    type: "DELETE_SELECTED_PATIENTS_AND_UPDATE",
    payload: selectedPatientList,
  });
}
