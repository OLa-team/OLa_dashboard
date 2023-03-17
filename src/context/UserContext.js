import React, { useContext, useReducer } from "react";

// Initial state
const initialState = {
  userList: [],
  tempUserList: [],
  selectedUserList: [],
  progress: 0,
};

// User reducer
const UserReducer = (initialState, action) => {
  switch (action.type) {
    case "SET_USER_LIST":
      return {
        ...initialState,
        userList: action.payload,
      };

    case "SET_TEMP_USER_LIST":
      return {
        ...initialState,
        tempUserList: action.payload,
      };

    case "SET_SELECTED_USER_LIST":
      return {
        ...initialState,
        selectedUserList: action.payload,
      };

    case "DELETE_SELECTED_USERS":
      const selectedUsers = new Set(action.payload);
      return {
        ...initialState,
        userList: initialState.userList.filter((user) => {
          return !selectedUsers.has(user);
        }),
      };

    case "PENDING_PROGRESS":
      return {
        ...initialState,
        progress: initialState.progress + 10,
      };

    case "COMPLETE_PROGRESS":
      return {
        ...initialState,
        progress: 100,
      };

    case "RESET_PROGRESS":
      return {
        ...initialState,
        progress: 0,
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// Create contexts
const UserStateContext = React.createContext();
const UserDispatchContext = React.createContext();

// Export contexts
export function useUserState() {
  const context = useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }

  return context;
}

export function useUserDispatch() {
  const context = useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }

  return context;
}

// Provider
export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(UserReducer, initialState);

  return (
    <UserStateContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};
