import React, { useContext, useReducer } from "react";
import { decryptLocalData } from "../utils";

let user = localStorage.getItem("user") ? decryptLocalData("user") : null;
let token = localStorage.getItem("user") ? user.id : "";

// Initial state
const initialState = {
  userDetails: user || {},
  token: "" || token,
  loading: false,
  errorMessage: null,
};

// Auth reducer
const AuthReducer = (initialState, action) => {
  switch (action.type) {
    case "REQUEST_LOGIN":
      return {
        ...initialState,
        loading: true,
      };

    case "LOGIN_SUCCESS":
      return {
        ...initialState,
        userDetails: action.payload,
        token: action.payload.id,
        loading: false,
      };

    case "LOGOUT":
      return {
        ...initialState,
        userDetails: "",
        token: "",
      };

    case "LOGIN_ERROR":
      return {
        ...initialState,
        loading: false,
        errorMessage: action.error,
      };

    case "SET_CURRENT_HCP":
      return {
        ...initialState,
        userDetails: action.payload,
      };

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

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// Create contexts
const AuthStateContext = React.createContext();
const AuthDispatchContext = React.createContext();

// Export contexts
export function useAuthState() {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error("useAuthState must be used within a AuthProvider");
  }

  return context;
}

export function useAuthDispatch() {
  const context = useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error("useAuthDipatch must be used within a AuthProvider");
  }

  return context;
}

// Provider
export const AuthProvider = ({ children }) => {
  const [user, dispatch] = useReducer(AuthReducer, initialState);

  return (
    <AuthStateContext.Provider value={user}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};
