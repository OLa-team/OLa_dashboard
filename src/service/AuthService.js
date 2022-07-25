import { addDoc, collection, getDocs } from "firebase/firestore";
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
