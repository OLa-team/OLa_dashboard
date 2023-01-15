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

const notificationCollectionRef = collection(firestore, "notification");

// fetch all notification data
export async function fetchAllNotification() {
  try {
    const data = await (
      await getDocs(notificationCollectionRef)
    ).docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return data;
  } catch (error) {
    alert(error.message);
    throw new Error("Error in get all notification", error);
  }
}

// get the patient that has notification only
export async function getHasNotifPatientList(notifDispatch) {
  try {
    let hasNotifList = [];
    const data = await (
      await getDocs(notificationCollectionRef)
    ).docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .forEach((notif) => {
        if (notif.SM_bleedingSymptom) {
          hasNotifList.push(notif);
        } else if (notif.SM_bodyWeight) {
          hasNotifList.push(notif);
        } else if (notif.SM_bpAndHeartRate) {
          hasNotifList.push(notif);
        } else if (notif.SM_healthDiary) {
          hasNotifList.push(notif);
        } else if (notif.SM_sugarLevel) {
          hasNotifList.push(notif);
        }
      });

    notifDispatch({
      type: "SET_HAS_NOTIF_LIST",
      payload: hasNotifList,
    });
  } catch (error) {
    alert(error.message);
    throw new Error(
      "Error in get all patient that has notification only",
      error
    );
  }
}

// update self monitoring notification
export async function updateSMNotification(patientId, module, dispatch) {
  try {
    if (module === "bpAndHeartRate") {
      await updateDoc(doc(firestore, "notification", patientId), {
        SM_bpAndHeartRate: false,
      });
    } else if (module === "sugarLevel") {
      await updateDoc(doc(firestore, "notification", patientId), {
        SM_sugarLevel: false,
      });
    } else if (module === "bodyWeight") {
      await updateDoc(doc(firestore, "notification", patientId), {
        SM_bodyWeight: false,
      });
    } else if (module === "bleedingSymptom") {
      await updateDoc(doc(firestore, "notification", patientId), {
        SM_bleedingSymptom: false,
      });
    } else if (module === "healthDiary") {
      await updateDoc(doc(firestore, "notification", patientId), {
        SM_healthDiary: false,
      });
    }

    let responseNotification = await (
      await getDoc(doc(firestore, "notification", patientId))
    ).data();
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
      alert("Error in fetching notification data");
    }
  } catch (error) {
    alert(error.message);
    throw new Error("Error in update self monitoring notification", error);
  }
}

// new patient registration notification from mobile
export async function updatePatientRegistrationNotification(
  patientId,
  dispatch,
  action
) {
  try {
    dispatch({
      type: "SET_LOADING_TRUE",
    });

    if (action === "approve") {
      await updateDoc(doc(firestore, "notification", patientId), {
        registrationWeb: true,
      });
    } else if (action === "reject") {
      await deleteDoc(doc(firestore, "notification", patientId));
    }
  } catch (error) {
    alert("Error when update patient registration notification");
    throw new Error(
      "Error when update patient registration notification",
      error
    );
  }
}

// notification when change patient profile data
export async function changeProfileDataNotification(changeDataObj, patientId) {
  try {
    await updateDoc(doc(firestore, "notification", patientId), {
      changeDataWeb: changeDataObj.changeDataWeb,
      changeData: changeDataObj.changeData,
    });
  } catch (error) {
    alert(error.message);
    throw new Error(
      "Error in sending notification to patient when changing the patient profile data",
      error
    );
    return;
  }
}
