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

    console.log("data", data);

    return data;
  } catch (error) {
    alert(error.message);
    throw new Error("Error in get all notification", error);
  }
}

// new patient registration notification from mobile
export async function updatePatientRegistrationNotification(patientId) {
  try {
    await updateDoc(doc(firestore, "notification", patientId), {
      registrationWeb: true,
    });
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
