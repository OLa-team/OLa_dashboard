import React, { useContext, useReducer } from "react";

// Initial State
const initialState = {
  hasNotifList: [],
};

// Notif reducer
const NotifReducer = (initialState, action) => {
  switch (action.type) {
    case "SET_HAS_NOTIF_LIST":
      return {
        ...initialState,
        hasNotifList: action.payload,
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// Create contexts
const NotifStateContext = React.createContext();
const NotifDispatchContext = React.createContext();

// Export contexts
export function useNotifState() {
  const context = useContext(NotifStateContext);
  if (context === undefined) {
    throw new Error("useNotifState must be used within a NotifProvider");
  }

  return context;
}

export function useNotifDispatch() {
  const context = useContext(NotifDispatchContext);
  if (context === undefined) {
    throw new Error("useNotifDispatch must be used within a NotifProvider");
  }

  return context;
}

// Provider
export const NotifProvider = ({ children }) => {
  const [notif, dispatch] = useReducer(NotifReducer, initialState);

  return (
    <NotifStateContext.Provider value={notif}>
      <NotifDispatchContext.Provider value={dispatch}>
        {children}
      </NotifDispatchContext.Provider>
    </NotifStateContext.Provider>
  );
};
