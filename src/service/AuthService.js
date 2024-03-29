import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../firebase";
import { encryptLocalData } from "../utils";

const usersCollectionRef = collection(firestore, "user");
// const hcpsCollectionRef = collection(firestore, "hcp");
// const adminsCollectionRef = collection(firestore, "admin");

// Login
export async function loginUser(dispatch, email) {
  try {
    dispatch({ type: "REQUEST_LOGIN" });

    var response = await getDocs(usersCollectionRef);
    var data = response.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    let findUserData = data.filter((hcp) => hcp.email === email);

    if (findUserData.length === 1) {
      let userData = findUserData[0];
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: userData,
      });
      encryptLocalData(userData, "user");
      // localStorage.setItem("currentUser", JSON.stringify(userData));

      return userData;
    }

    dispatch({ type: "LOGIN_ERROR", error: data.errors[0] });
    return;
  } catch (error) {
    dispatch({ type: "LOGIN_ERROR", error: error });
  }
}

// Logout
export async function logout(dispatch) {
  dispatch({ type: "LOGOUT" });

  localStorage.removeItem("user");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("currentPatient");
  localStorage.removeItem("currentPage");
  localStorage.removeItem("currentPageNumber");

  localStorage.removeItem("data");
  localStorage.removeItem("notification");
  // localStorage.removeItem("medicalCondition");
  // localStorage.removeItem("allergy");
  // localStorage.removeItem("strokeRisk");
  // localStorage.removeItem("bleedingRisk");
  // localStorage.removeItem("warfarinQuality");
  // localStorage.removeItem("healthGoal");
  // localStorage.removeItem("defaultHealthGoal");
  // localStorage.removeItem("medication");
  // localStorage.removeItem("medicineList");
  // localStorage.removeItem("bloodThinner");
  // localStorage.removeItem("patientMonitoring");
  // localStorage.removeItem("hemoglobin");
  // localStorage.removeItem("messageForPatients");
  // localStorage.removeItem("notification");

  // localStorage.removeItem("warfarinQualityResultMessage");
  // localStorage.removeItem("bleedingRiskResultMessage");
  // localStorage.removeItem("strokeRiskResultMessage");
  // localStorage.removeItem("medicationConstantList");
}
