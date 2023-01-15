import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../firebase";
import { encryptLocalData } from "../utils";

const userCollectionRef = collection(firestore, "user");

// Fetch patient list
export async function fetchUserList(email, userDispatch, pageDispatch) {
  pageDispatch({
    type: "SET_LOADING_TRUE",
  });

  try {
    let responseData = await (
      await getDocs(userCollectionRef)
    ).docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    let number = 1;
    let userListData = responseData
      .filter((user) => {
        return user.email !== email;
      })
      .map((user) => ({
        userId: user.id,
        id: number++,
        username: user.username,
        email: user.email,
        icNo: user.icNo,
        isAdmin: user.isAdmin,
        isHcp: user.isHcp,
      }));
    if (userListData.length >= 0) {
      userDispatch({
        type: "SET_USER_LIST",
        payload: userListData,
      });
    }

    pageDispatch({
      type: "SET_LOADING_FALSE",
    });
  } catch (error) {
    throw new Error(`Error in set user list: `, error);
  }
}

// Register
export async function registerAdminOrHcp(newUserData, dispatch) {
  dispatch({
    type: "SET_LOADING_TRUE",
  });
  try {
    await addDoc(userCollectionRef, {
      email: newUserData.email,
      username: newUserData.username,
      icNo: newUserData.icNo,
      isAdmin: newUserData.isAdmin,
      isHcp: newUserData.isHcp,
    });
  } catch (error) {
    throw new Error(`Error in register new user: `, error);
  }

  dispatch({
    type: "SET_LOADING_FALSE",
  });
}

// update hcp profile
export async function updateAdminOrHcpProfile(profileData, dispatch) {
  dispatch({
    type: "SET_LOADING_TRUE",
  });

  try {
    await updateDoc(doc(firestore, "user", profileData.id), {
      username: profileData.username,
      email: profileData.email,
      icNo: profileData.icNo,
      isAdmin: profileData.isAdmin,
      isHcp: profileData.isHcp,
    });
  } catch (error) {
    alert(error.message);
    console.log("Error in update admin or hcp profile data", error);
    return;
  }

  dispatch({
    type: "SET_LOADING_FALSE",
  });
}

// filter user list
export function filterUserList(
  userDispatch,
  userList,
  filterRole,
  searchResult
) {
  let number = 1;
  let tempUserList = userList
    .filter((user) => {
      if (filterRole === "") {
        return userList;
      }
      if (filterRole === "admin") {
        return user.isAdmin && !user.isHcp;
      } else if (filterRole === "hcp") {
        return !user.isAdmin && user.isHcp;
      } else if (filterRole === "both") {
        return user.isAdmin && user.isHcp;
      }
    })
    .filter((user) => {
      return (
        user.username.toLowerCase().indexOf(searchResult.toLowerCase()) > -1
      );
    })
    .map((user) => ({
      ...user,
      id: number++,
    }));

  userDispatch({
    type: "SET_TEMP_USER_LIST",
    payload: tempUserList,
  });
}

// filter user list by role
export function filterUserListByRole(userDispatch, userList, role) {
  if (role === "") {
    return userList;
  }
  const tempUserList = userList.filter((user) => {
    if (role === "admin") {
      return user.isAdmin && !user.isHcp;
    } else if (role === "hcp") {
      return !user.isAdmin && user.isHcp;
    } else if (role === "both") {
      return user.isAdmin && user.isHcp;
    }
  });

  userDispatch({
    type: "SET_TEMP_USER_LIST",
    payload: tempUserList,
  });
}

// set admin or hcp data
export async function setCurrentAdminOrHcp(dispatch, hcpId) {
  if (localStorage.getItem("currentUser")) {
    localStorage.removeItem("currentUser");
  }

  try {
    dispatch({
      type: "SET_LOADING_TRUE",
    });

    let response = await getDocs(userCollectionRef);
    let data = response.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    let findUserData = data.filter((hcp) => hcp.id === hcpId);
    let userData = findUserData[0];

    if (findUserData.length === 1) {
      dispatch({
        type: "SET_CURRENT_HCP",
        payload: userData,
      });
      localStorage.setItem("currentUser", JSON.stringify(userData));

      dispatch({
        type: "SET_LOADING_FALSE",
      });
    }
  } catch (error) {
    throw new Error(`Error in set current hcp: `, error);
  }
}

// delete admin or hcp
export async function deleteUser(userId) {
  try {
    var userRef = doc(firestore, "user", userId);
    var userDataSnap = await getDoc(userRef);
    if (!userDataSnap.exists()) {
      alert("User document is not exist");
      return;
    }
    await deleteDoc(userRef);
  } catch (error) {
    alert("Error in delete user account", error);
    throw new Error("Error in delete user account", error);
  }
}

// Delete all selected user
export async function deleteAllSelectedUsers(
  selectedUserList,
  userDispatch,
  pageDispatch
) {
  pageDispatch({
    type: "SET_LOADING_TRUE",
  });

  await selectedUserList.forEach((user) => {
    deleteUser(user.userId, pageDispatch);
  });

  userDispatch({
    type: "DELETE_SELECTED_USERS",
    payload: selectedUserList,
  });

  pageDispatch({
    type: "SET_LOADING_FALSE",
  });
}
