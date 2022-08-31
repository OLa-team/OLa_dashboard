import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../firebase";

const hcpsCollectionRef = collection(firestore, "hcp");

// Login
export async function loginUser(dispatch, email) {
  try {
    dispatch({ type: "REQUEST_LOGIN" });

    let response = await getDocs(hcpsCollectionRef);
    let data = response.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    let findHcpData = data.filter((hcp) => hcp.email === email);
    let hcpData = findHcpData[0];

    if (findHcpData.length === 1) {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: hcpData,
      });
      localStorage.setItem("currentUser", JSON.stringify(hcpData));
      console.log("hcpData", hcpData);

      return hcpData;
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

  localStorage.removeItem("currentUser");
  localStorage.removeItem("currentPatient");
  localStorage.removeItem("currentPage");
  localStorage.removeItem("currentPageNumber");
  localStorage.removeItem("medicalCondition");
  localStorage.removeItem("allergy");
  localStorage.removeItem("strokeRisk");
  localStorage.removeItem("bleedingRisk");
  localStorage.removeItem("warfarinQuality");
}

// Register
export async function registerHcp(email, username) {
  try {
    await addDoc(hcpsCollectionRef, { email: email, username: username });
  } catch (error) {
    throw new Error(`Error in register new hcp: `, error);
  }
}

// update hcp profile
export async function updateHcpProfile(hcpProfileData, hcpId) {
  try {
    await updateDoc(doc(firestore, "hcp", hcpId), {
      username: hcpProfileData.username,
      icNo: hcpProfileData.icNo,
      email: hcpProfileData.email,
    });
  } catch (error) {
    alert(error.message);
    console.log("Error in update hcp profile data", error);
    return;
  }
}

// set hcp data
export async function setCurrentHcp(dispatch, hcpId) {
  if (localStorage.getItem("currentUser")) {
    localStorage.removeItem("currentUser");
  }

  try {
    dispatch({
      type: "SET_LOADING_TRUE",
    });

    let response = await getDocs(hcpsCollectionRef);
    let data = response.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    let findHcpData = data.filter((hcp) => hcp.id === hcpId);
    let hcpData = findHcpData[0];
    console.log("findHcpData", findHcpData);

    if (findHcpData.length === 1) {
      dispatch({
        type: "SET_CURRENT_HCP",
        payload: hcpData,
      });
      localStorage.setItem("currentUser", JSON.stringify(hcpData));

      dispatch({
        type: "SET_LOADING_FALSE",
      });
    }
  } catch (error) {
    throw new Error(`Error in set current hcp: `, error);
  }
}
