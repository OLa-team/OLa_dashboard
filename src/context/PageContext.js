import React, { useContext, useReducer } from "react";

const page = localStorage.getItem("currentPage")
  ? JSON.parse(localStorage.getItem("currentPage"))
  : "Patient List";

// Initial state
const initialState = {
  currentPage: page,
  loading: false,
};

// Page reducer
const PageReducer = (initialState, action) => {
  switch (action.type) {
    case "SET_CURRENT_PAGE":
      localStorage.setItem("currentPage", JSON.stringify(action.payload));
      return {
        ...initialState,
        currentPage: JSON.parse(localStorage.getItem("currentPage")),
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
const PageStateContext = React.createContext();
const PageDispatchContext = React.createContext();

// Export contexts
export function usePageState() {
  const context = useContext(PageStateContext);
  if (context === undefined) {
    throw new Error("usePageState must be used within a PageProvider");
  }

  return context;
}

export function usePageDispatch() {
  const context = useContext(PageDispatchContext);
  if (context === undefined) {
    throw new Error("usePageDispatch must be used within a PageProvider");
  }

  return context;
}

// Provider
export const PageProvider = ({ children }) => {
  const [page, dispatch] = useReducer(PageReducer, initialState);

  return (
    <PageStateContext.Provider value={page}>
      <PageDispatchContext.Provider value={dispatch}>
        {children}
      </PageDispatchContext.Provider>
    </PageStateContext.Provider>
  );
};
